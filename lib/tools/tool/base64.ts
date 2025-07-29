// lib/tools/tool/base64-encoder.ts
import { ToolSchema } from "../tool-schema";

export type Base64Options = {
  mode: 'encode' | 'decode' | 'auto';
  input: string;
  fileName?: string;
  fileContent?: string;
  outputFormat?: 'text' | 'file';
};

export type Base64Result = {
  output: string;
  inputType: 'text' | 'base64' | 'file';
  outputType: 'text' | 'base64';
  isValid: boolean;
  error?: string;
  fileName?: string;
};

function isBase64(str: string): boolean {
  if (!str || str.length === 0) return false;
  
  // Remove whitespace and newlines
  const cleanStr = str.replace(/\s/g, '');
  
  // Check if it's a valid base64 string
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  
  if (!base64Regex.test(cleanStr)) return false;
  
  // Check if length is multiple of 4
  if (cleanStr.length % 4 !== 0) return false;
  
  try {
    // Try to decode to verify it's valid base64
    const decoded = atob(cleanStr);
    // If we can decode and re-encode to get the same result (minus padding differences), it's valid
    const reencoded = btoa(decoded).replace(/=+$/, '');
    const originalWithoutPadding = cleanStr.replace(/=+$/, '');
    return reencoded === originalWithoutPadding;
  } catch {
    return false;
  }
}

function processBase64({ mode, input, fileName, fileContent }: Base64Options): Base64Result {
  try {
    // Handle file input
    if (fileContent && fileName) {
      if (mode === 'encode' || (mode === 'auto' && !isBase64(fileContent))) {
        const encoded = btoa(fileContent);
        return {
          output: encoded,
          inputType: 'file',
          outputType: 'base64',
          isValid: true,
          fileName: fileName.replace(/\.[^/.]+$/, '') + '.base64.txt'
        };
      } else {
        try {
          const decoded = atob(fileContent.replace(/\s/g, ''));
          return {
            output: decoded,
            inputType: 'file',
            outputType: 'text',
            isValid: true,
            fileName: fileName.replace(/\.base64\.txt$/, '') || 'decoded.txt'
          };
        } catch {
          return {
            output: '',
            inputType: 'file',
            outputType: 'text',
            isValid: false,
            error: 'Invalid base64 content in file'
          };
        }
      }
    }

    // Handle text input
    if (!input.trim()) {
      return {
        output: '',
        inputType: 'text',
        outputType: 'text',
        isValid: false,
        error: 'Input is empty'
      };
    }

    const cleanInput = input.trim();

    if (mode === 'encode') {
      const encoded = btoa(cleanInput);
      return {
        output: encoded,
        inputType: 'text',
        outputType: 'base64',
        isValid: true
      };
    } else if (mode === 'decode') {
      try {
        const decoded = atob(cleanInput.replace(/\s/g, ''));
        return {
          output: decoded,
          inputType: 'base64',
          outputType: 'text',
          isValid: true
        };
      } catch {
        return {
          output: '',
          inputType: 'base64',
          outputType: 'text',
          isValid: false,
          error: 'Invalid base64 string'
        };
      }
    } else { // auto mode
      if (isBase64(cleanInput)) {
        try {
          const decoded = atob(cleanInput.replace(/\s/g, ''));
          return {
            output: decoded,
            inputType: 'base64',
            outputType: 'text',
            isValid: true
          };
        } catch {
          return {
            output: '',
            inputType: 'base64',
            outputType: 'text',
            isValid: false,
            error: 'Invalid base64 string'
          };
        }
      } else {
        const encoded = btoa(cleanInput);
        return {
          output: encoded,
          inputType: 'text',
          outputType: 'base64',
          isValid: true
        };
      }
    }
  } catch (error) {
    return {
      output: '',
      inputType: 'text',
      outputType: 'text',
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

function downloadAsFile(content: string, filename: string) {
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

const base64Encoder = {
  name: "Base64 Encoder/Decoder",
  slug: "base64-encoder",
  description: "Encode and decode text or files to/from Base64 with auto-detection and file upload support",
  category: "Text",
  version: "1.0.0",
  tags: ["Encoding", "Base64", "Converter", "File"],
  process: (options: Base64Options) => processBase64(options),
  download: downloadAsFile,
  isBase64: isBase64,
};

export default base64Encoder;