// lib/tools/tool/url.ts

export interface URLOptions {
    mode: 'encode' | 'decode' | 'auto';
    input: string;
    fileName?: string;
    fileContent?: string;
    outputFormat: 'text';
}

export interface URLResult {
    output: string;
    inputType: 'text' | 'encoded' | 'file';
    outputType: 'text' | 'encoded';
    isValid: boolean;
    error?: string;
    fileName?: string;
}

const urlEncoder = {
    name: "URL Encoder/Decoder",
    slug: "url-encoder-decoder",
    description: "Encode/decode URL components",
    info: "Safely encode special characters in URLs or decode percent-encoded strings.",
    category: "Text & Data",
    version: "1.0.0",
    tags: ["url", "encode", "decode"],
    
    process: (options: URLOptions): URLResult => {
        try {
            const input = options.fileContent || options.input;
            
            if (!input) {
                return {
                    output: '',
                    inputType: 'text',
                    outputType: 'text',
                    isValid: true,
                    error: 'No input provided'
                };
            }
            
            let isEncoded = false;
            
            // Auto-detect if mode is auto
            if (options.mode === 'auto') {
                // Simple heuristic: if input contains % followed by two hex digits, it's likely encoded
                isEncoded = /%[0-9A-Fa-f]{2}/.test(input);
            } else {
                isEncoded = options.mode === 'decode';
            }
            
            let output: string;
            let inputType: 'text' | 'encoded' | 'file' = options.fileContent ? 'file' : (isEncoded ? 'encoded' : 'text');
            let outputType: 'text' | 'encoded' = isEncoded ? 'text' : 'encoded';
            
            if (isEncoded) {
                // Decode URL
                try {
                    output = decodeURIComponent(input);
                } catch (e) {
                    return {
                        output: '',
                        inputType,
                        outputType,
                        isValid: false,
                        error: 'Invalid URL encoding'
                    };
                }
            } else {
                // Encode URL
                output = encodeURIComponent(input);
            }
            
            return {
                output,
                inputType,
                outputType,
                isValid: true,
                fileName: options.fileName
            };
        } catch (error) {
            return {
                output: '',
                inputType: 'text',
                outputType: 'text',
                isValid: false,
                error: `Error processing URL: ${error instanceof Error ? error.message : String(error)}`
            };
        }
    },
    
    download: (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

export default urlEncoder;