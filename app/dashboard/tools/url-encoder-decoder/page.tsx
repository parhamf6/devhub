'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import urlEncoder, { URLOptions, URLResult } from '@/lib/tools/tool/url-encoder-decoder';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Copy, 
    Download, 
    Upload, 
    RotateCcw, 
    FileText, 
    Link,
    AlertCircle,
    CheckCircle2,
    RefreshCw,
    History,
    Settings,
    Code,
    File,
    Hash,
    Type,
    Save,
    Trash2,
    Play,
    Pause,
    SkipForward,
    SkipBack,
    Plus,
    Minus,
    ExternalLink,
    Braces,
    Key
} from 'lucide-react';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { LearnButton } from '@/features/dashboard/tools/components/learn-button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const tool = urlEncoder;

// Define types for our advanced features
type ConversionHistory = {
    id: string;
    timestamp: Date;
    input: string;
    output: string;
    inputType: string;
    outputType: string;
    options: URLOptions;
};

type Preset = {
    id: string;
    name: string;
    description: string;
    options: URLOptions;
};

type QueryParam = {
    id: string;
    key: string;
    value: string;
    enabled: boolean;
};

const DEFAULT_PRESETS: Preset[] = [
    {
        id: 'standard-encode',
        name: 'Standard Encoding',
        description: 'Encode URL with standard percent-encoding',
        options: {
            mode: 'encode',
            input: '',
            outputFormat: 'text',
            encodeSpaces: true,
            encodeSpecialChars: true,
            encodeReserved: false,
            plusForSpace: false
        }
    },
    {
        id: 'form-encode',
        name: 'Form Data Encoding',
        description: 'Encode form data with spaces as plus signs',
        options: {
            mode: 'encode',
            input: '',
            outputFormat: 'text',
            encodeSpaces: true,
            encodeSpecialChars: true,
            encodeReserved: false,
            plusForSpace: true
        }
    },
    {
        id: 'full-encode',
        name: 'Full Encoding',
        description: 'Encode all non-alphanumeric characters',
        options: {
            mode: 'encode',
            input: '',
            outputFormat: 'text',
            encodeSpaces: true,
            encodeSpecialChars: true,
            encodeReserved: true,
            plusForSpace: false
        }
    },
    {
        id: 'standard-decode',
        name: 'Standard Decoding',
        description: 'Decode URL with standard percent-decoding',
        options: {
            mode: 'decode',
            input: '',
            outputFormat: 'text'
        }
    },
    {
        id: 'plus-decode',
        name: 'Plus to Space Decoding',
        description: 'Decode plus signs to spaces',
        options: {
            mode: 'decode',
            input: '',
            outputFormat: 'text',
            plusToSpace: true
        }
    }
];

const CODE_GENERATION_TEMPLATES = {
    javascript: (input: string, isEncode: boolean, options: any) => {
        let code = `// ${isEncode ? 'Encode' : 'Decode'} URL\n`;
        code += `const input = '${input.replace(/'/g, "\\'")}';\n\n`;
        
        if (isEncode) {
            code += `// Using encodeURIComponent for standard encoding\n`;
            code += `let encoded = encodeURIComponent(input);\n\n`;
            
            if (options.plusForSpace) {
                code += `// Replace %20 with + for form data\n`;
                code += `encoded = encoded.replace(/%20/g, '+');\n\n`;
            }
            
            if (options.encodeReserved) {
                code += `// Encode reserved characters\n`;
                code += `encoded = encoded.replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());\n\n`;
            }
            
            code += `console.log(encoded);`;
        } else {
            code += `// Using decodeURIComponent for standard decoding\n`;
            code += `let decoded = decodeURIComponent(input);\n\n`;
            
            if (options.plusToSpace) {
                code += `// Replace + with space\n`;
                code += `decoded = decoded.replace(/\\+/g, ' ');\n\n`;
            }
            
            code += `console.log(decoded);`;
        }
        
        return code;
    },
    python: (input: string, isEncode: boolean, options: any) => {
        let code = `import urllib.parse\n\n`;
        code += `# ${isEncode ? 'Encode' : 'Decode'} URL\n`;
        code += `input = '${input.replace(/'/g, "\\'")}'\n\n`;
        
        if (isEncode) {
            code += `# Using urllib.parse.quote_plus for form data or quote for standard encoding\n`;
            if (options.plusForSpace) {
                code += `encoded = urllib.parse.quote_plus(input)\n`;
            } else {
                code += `encoded = urllib.parse.quote(input)\n`;
            }
            
            if (options.encodeReserved) {
                code += `\n# Encode reserved characters\n`;
                code += `encoded = urllib.parse.quote(encoded, safe='')\n`;
            }
            
            code += `\nprint(encoded)`;
        } else {
            code += `# Using urllib.parse.unquote_plus for form data or unquote for standard decoding\n`;
            if (options.plusToSpace) {
                code += `decoded = urllib.parse.unquote_plus(input)\n`;
            } else {
                code += `decoded = urllib.parse.unquote(input)\n`;
            }
            
            code += `\nprint(decoded)`;
        }
        
        return code;
    },
    java: (input: string, isEncode: boolean, options: any) => {
        let code = `import java.io.UnsupportedEncodingException;\n`;
        code += `import java.net.URLEncoder;\n`;
        code += `import java.net.URLDecoder;\n`;
        code += `import java.nio.charset.StandardCharsets;\n\n`;
        code += `public class URLEncoderExample {\n`;
        code += `    public static void main(String[] args) throws UnsupportedEncodingException {\n`;
        code += `        String input = "${input.replace(/"/g, '\\"')}";\n\n`;
        
        if (isEncode) {
            code += `        // Using URLEncoder for encoding\n`;
            code += `        String encoded = URLEncoder.encode(input, StandardCharsets.UTF_8.toString());\n\n`;
            
            if (options.plusForSpace) {
                code += `        // For form data, spaces are encoded as +\n`;
            } else {
                code += `        // Replace + with %20 for standard URL encoding\n`;
                code += `        encoded = encoded.replace("+", "%20");\n`;
            }
            
            code += `\n        System.out.println(encoded);\n`;
        } else {
            code += `        // Using URLDecoder for decoding\n`;
            code += `        String decoded = URLDecoder.decode(input, StandardCharsets.UTF_8.toString());\n\n`;
            
            code += `        System.out.println(decoded);\n`;
        }
        
        code += `    }\n`;
        code += `}`;
        
        return code;
    }
};

export default function URLEncoderPage() {
    const [options, setOptions] = useState<URLOptions>({
        mode: 'auto',
        input: '',
        outputFormat: 'text',
        encodeSpaces: true,
        encodeSpecialChars: true,
        encodeReserved: false,
        plusForSpace: false,
        plusToSpace: false
    });
    
    const [result, setResult] = useState<URLResult>({
        output: '',
        inputType: 'text',
        outputType: 'text',
        isValid: true
    });
    
    const [isDragOver, setIsDragOver] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState('text');
    const [history, setHistory] = useState<ConversionHistory[]>([]);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState<string>('');
    const [codeLanguage, setCodeLanguage] = useState<string>('javascript');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
    const [autoSave, setAutoSave] = useState(true);
    const [batchInput, setBatchInput] = useState<string>('');
    const [batchResults, setBatchResults] = useState<{input: string, output: string, valid: boolean}[]>([]);
    const [queryParams, setQueryParams] = useState<QueryParam[]>([
        { id: '1', key: '', value: '', enabled: true }
    ]);
    const [urlParts, setUrlParts] = useState({
        protocol: 'https://',
        domain: '',
        path: '',
        query: '',
        fragment: ''
    });
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const outputRef = useRef<HTMLTextAreaElement>(null);
    
    // Load history from localStorage on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('url-history');
        if (savedHistory) {
            try {
                const parsed = JSON.parse(savedHistory);
                setHistory(parsed.map((item: any) => ({
                    ...item,
                    timestamp: new Date(item.timestamp)
                })));
            } catch (e) {
                console.error('Failed to parse history', e);
            }
        }
    }, []);
    
    // Save history to localStorage when it changes
    useEffect(() => {
        if (autoSave && history.length > 0) {
            localStorage.setItem('url-history', JSON.stringify(history));
        }
    }, [history, autoSave]);
    
    const processInput = useCallback(async () => {
        if (!tool?.process) return;
        
        setIsProcessing(true);
        
        // Add small delay for better UX on fast operations
        setTimeout(() => {
            const processResult = tool.process(options);
            setResult(processResult);
            setIsProcessing(false);
            
            // Add to history if valid result
            if (processResult.isValid && processResult.output) {
                const newHistoryItem: ConversionHistory = {
                    id: Date.now().toString(),
                    timestamp: new Date(),
                    input: options.input || options.fileContent || '',
                    output: processResult.output,
                    inputType: processResult.inputType,
                    outputType: processResult.outputType,
                    options: { ...options }
                };
                
                setHistory(prev => [newHistoryItem, ...prev.slice(0, 19)]); // Keep last 20 items
            }
        }, 100);
    }, [options]);
    
    useEffect(() => {
        processInput();
    }, [processInput]);
    
    const handleCopy = async () => {
        if (!result.output) {
            toast.error('Nothing to copy');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(result.output);
            toast.success('Copied to clipboard!');
        } catch {
            toast.error('Failed to copy to clipboard');
        }
    };
    
    const handleDownload = () => {
        if (!result.output) {
            toast.error('Nothing to download');
            return;
        }
        
        const filename = result.fileName || 
            (result.outputType === 'encoded' ? 'encoded-url.txt' : 'decoded-url.txt');
        
        if (tool?.download) {
            tool.download(result.output, filename);
            toast.success('File downloaded!');
        }
    };
    
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            setOptions(prev => ({
                ...prev,
                input: '',
                fileName: file.name,
                fileContent: content
            }));
            setActiveTab('file');
        };
        reader.readAsText(file);
    };
    
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };
    
    const handleDragLeave = () => {
        setIsDragOver(false);
    };
    
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                const content = event.target?.result as string;
                setOptions(prev => ({
                    ...prev,
                    input: '',
                    fileName: file.name,
                    fileContent: content
                }));
                setActiveTab('file');
            };
            
            reader.readAsText(file);
        }
    };
    
    const clearAll = () => {
        setOptions({
            mode: 'auto',
            input: '',
            outputFormat: 'text',
            encodeSpaces: true,
            encodeSpecialChars: true,
            encodeReserved: false,
            plusForSpace: false,
            plusToSpace: false
        });
        setResult({
            output: '',
            inputType: 'text',
            outputType: 'text',
            isValid: true
        });
    };
    
    const swapInputOutput = () => {
        if (!result.output) return;
        
        setOptions(prev => ({
            ...prev,
            input: result.output,
            fileName: undefined,
            fileContent: undefined
        }));
    };
    
    const applyPreset = (presetId: string) => {
        const preset = DEFAULT_PRESETS.find(p => p.id === presetId);
        if (preset) {
            setOptions(prev => ({
                ...prev,
                ...preset.options,
                input: prev.input, // Keep current input
                fileName: prev.fileName, // Keep current file
                fileContent: prev.fileContent
            }));
            setSelectedPreset(presetId);
            toast.success(`Applied preset: ${preset.name}`);
        }
    };
    
    const loadFromHistory = (item: ConversionHistory) => {
        setOptions({
            ...item.options,
            input: item.input
        });
        setCurrentHistoryIndex(history.findIndex(h => h.id === item.id));
        toast.success('Loaded from history');
    };
    
    const playHistory = () => {
        if (history.length === 0) return;
        
        setIsPlaying(true);
        let index = currentHistoryIndex >= 0 ? currentHistoryIndex : 0;
        
        const playNext = () => {
            if (!isPlaying) return;
            
            if (index >= history.length) {
                setIsPlaying(false);
                return;
            }
            
            const item = history[index];
            setOptions({
                ...item.options,
                input: item.input
            });
            setCurrentHistoryIndex(index);
            
            index++;
            setTimeout(playNext, 2000); // 2 seconds between each item
        };
        
        playNext();
    };
    
    const pauseHistory = () => {
        setIsPlaying(false);
    };
    
    const nextHistoryItem = () => {
        if (currentHistoryIndex < history.length - 1) {
            const nextIndex = currentHistoryIndex + 1;
            const item = history[nextIndex];
            setOptions({
                ...item.options,
                input: item.input
            });
            setCurrentHistoryIndex(nextIndex);
        }
    };
    
    const prevHistoryItem = () => {
        if (currentHistoryIndex > 0) {
            const prevIndex = currentHistoryIndex - 1;
            const item = history[prevIndex];
            setOptions({
                ...item.options,
                input: item.input
            });
            setCurrentHistoryIndex(prevIndex);
        }
    };
    
    const clearHistory = () => {
        if (confirm('Are you sure you want to clear all history?')) {
            setHistory([]);
            localStorage.removeItem('url-history');
            toast.success('History cleared');
        }
    };
    
    const generateCode = () => {
        const input = options.input || options.fileContent || '';
        const isEncode = result.outputType === 'encoded';
        
        if (!input) return '';
        
        switch (codeLanguage) {
            case 'javascript':
                return CODE_GENERATION_TEMPLATES.javascript(input, isEncode, options);
            case 'python':
                return CODE_GENERATION_TEMPLATES.python(input, isEncode, options);
            case 'java':
                return CODE_GENERATION_TEMPLATES.java(input, isEncode, options);
            default:
                return '';
        }
    };
    
    const copyCode = async () => {
        const code = generateCode();
        if (!code) {
            toast.error('No code to copy');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(code);
            toast.success('Code copied to clipboard!');
        } catch {
            toast.error('Failed to copy code');
        }
    };
    
    const processBatch = () => {
        if (!batchInput.trim()) {
            toast.error('Please enter URLs to process');
            return;
        }
        
        const urls = batchInput.split('\n').filter(url => url.trim());
        const results = urls.map(url => {
            try {
                const batchOptions = { ...options, input: url.trim() };
                const batchResult = tool.process(batchOptions);
                return {
                    input: url.trim(),
                    output: batchResult.output,
                    valid: batchResult.isValid
                };
            } catch (e) {
                return {
                    input: url.trim(),
                    output: 'Error processing URL',
                    valid: false
                };
            }
        });
        
        setBatchResults(results);
        toast.success(`Processed ${results.length} URLs`);
    };
    
    const addQueryParam = () => {
        setQueryParams(prev => [
            ...prev,
            { id: Date.now().toString(), key: '', value: '', enabled: true }
        ]);
    };
    
    const removeQueryParam = (id: string) => {
        if (queryParams.length <= 1) return;
        setQueryParams(prev => prev.filter(param => param.id !== id));
    };
    
    const updateQueryParam = (id: string, field: keyof QueryParam, value: string | boolean) => {
        setQueryParams(prev =>
            prev.map(param =>
                param.id === id ? { ...param, [field]: value } : param
            )
        );
    };
    
    const buildUrlFromParts = () => {
        const { protocol, domain, path, query, fragment } = urlParts;
        let url = protocol + domain;
        
        if (path) {
            url += path.startsWith('/') ? path : '/' + path;
        }
        
        if (query) {
            url += '?' + query;
        }
        
        if (fragment) {
            url += '#' + fragment;
        }
        
        setOptions(prev => ({
            ...prev,
            input: url
        }));
        
        toast.success('URL built from parts');
    };
    
    const parseUrlToParts = () => {
        const url = options.input || options.fileContent || '';
        if (!url) {
            toast.error('No URL to parse');
            return;
        }
        
        try {
            const urlObj = new URL(url);
            setUrlParts({
                protocol: urlObj.protocol + '//',
                domain: urlObj.hostname,
                path: urlObj.pathname,
                query: urlObj.search.substring(1),
                fragment: urlObj.hash.substring(1)
            });
            toast.success('URL parsed to parts');
        } catch (e) {
            toast.error('Invalid URL format');
        }
    };
    
    const buildQueryFromParams = () => {
        const enabledParams = queryParams.filter(p => p.enabled && p.key.trim());
        if (enabledParams.length === 0) {
            toast.error('No valid query parameters');
            return;
        }
        
        const queryString = enabledParams
            .map(param => {
                const encodedKey = encodeURIComponent(param.key.trim());
                const encodedValue = param.value ? encodeURIComponent(param.value.trim()) : '';
                return `${encodedKey}=${encodedValue}`;
            })
            .join('&');
        
        setUrlParts(prev => ({
            ...prev,
            query: queryString
        }));
        
        toast.success('Query string built from parameters');
    };
    
    const parseQueryToParams = () => {
        const queryString = urlParts.query;
        if (!queryString) {
            toast.error('No query string to parse');
            return;
        }
        
        const params = queryString.split('&');
        const newParams: QueryParam[] = params.map((param, index) => {
            const [key, value] = param.split('=');
            return {
                id: (index + 1).toString(),
                key: decodeURIComponent(key),
                value: value ? decodeURIComponent(value) : '',
                enabled: true
            };
        });
        
        setQueryParams(newParams);
        toast.success('Query string parsed to parameters');
    };
    
    const getInputTypeIcon = () => {
        switch (result.inputType) {
            case 'encoded': return <Link className="w-4 h-4" />;
            case 'file': return <File className="w-4 h-4" />;
            case 'json': return <Braces className="w-4 h-4" />;
            case 'query': return <Key className="w-4 h-4" />;
            default: return <Type className="w-4 h-4" />;
        }
    };
    
    const getInputTypeLabel = () => {
        switch (result.inputType) {
            case 'encoded': return 'URL Encoded';
            case 'file': return 'File';
            case 'json': return 'JSON';
            case 'query': return 'Query String';
            default: return 'Text';
        }
    };
    
    const getOutputTypeLabel = () => {
        return result.outputType === 'encoded' ? 'URL Encoded' : 'Text';
    };
    
    return (
        <div className="flex flex-col justify-center p-2 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 justify-between">
                <div className='flex justify-between gap-4 flex-wrap'>
                    <div>
                        <h1 className="text-2xl font-bold">{tool?.name}</h1>
                    </div>
                    <LearnButton 
                        tool={{
                            name: tool?.name || '',
                            description: tool?.description || '',
                            slug: tool?.slug || 'url-encoder-decoder',
                            category: tool?.category || 'Text & Data',
                            tags: tool?.tags
                        }}
                        variant="secondary"
                        mdFilePath="content/learn/url.md"
                    />
                </div>
                <div>
                    <p className="text-muted-foreground">{tool?.description}</p>
                </div>
            </div>
            
            {/* Mode Selection and Presets */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <Label className="font-medium">Mode</Label>
                    <Select
                        value={options.mode}
                        onValueChange={(value: 'encode' | 'decode' | 'auto') => 
                            setOptions(prev => ({ ...prev, mode: value }))
                        }
                    >
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="auto">Auto-detect</SelectItem>
                            <SelectItem value="encode">Encode URL</SelectItem>
                            <SelectItem value="decode">Decode URL</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <Label className="font-medium">Presets</Label>
                    <Select
                        value={selectedPreset}
                        onValueChange={applyPreset}
                    >
                        <SelectTrigger className="w-full sm:w-64">
                            <SelectValue placeholder="Select a preset" />
                        </SelectTrigger>
                        <SelectContent>
                            {DEFAULT_PRESETS.map(preset => (
                                <SelectItem key={preset.id} value={preset.id}>
                                    {preset.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="flex items-center gap-2 mt-2 sm:mt-6">
                    <Switch
                        id="auto-save"
                        checked={autoSave}
                        onCheckedChange={setAutoSave}
                    />
                    <Label htmlFor="auto-save" className="text-sm">Auto-save history</Label>
                </div>
            </div>
            
            {/* Input Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="text" className="flex items-center gap-1">
                        <Type className="w-4 h-4" />
                        Text
                    </TabsTrigger>
                    <TabsTrigger value="file" className="flex items-center gap-1">
                        <File className="w-4 h-4" />
                        File
                    </TabsTrigger>
                    <TabsTrigger value="builder" className="flex items-center gap-1">
                        <Link className="w-4 h-4" />
                        Builder
                    </TabsTrigger>
                    <TabsTrigger value="batch" className="flex items-center gap-1">
                        <Hash className="w-4 h-4" />
                        Batch
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <Label className="font-medium">Text Input</Label>
                        <Textarea
                            placeholder="Enter URL to encode/decode..."
                            value={options.input}
                            onChange={(e) => setOptions(prev => ({ 
                                ...prev, 
                                input: e.target.value,
                                fileName: undefined,
                                fileContent: undefined 
                            }))}
                            className="min-h-32 font-mono text-sm resize-y"
                        />
                    </div>
                </TabsContent>
                
                <TabsContent value="file" className="space-y-4">
                    {/* File Upload Area */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                            isDragOver 
                                ? 'border-primary bg-primary/5' 
                                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop a file here, or click to select
                        </p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                            accept=".txt,.url,.csv"
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                        </Button>
                        {options.fileName && (
                            <p className="text-xs text-muted-foreground mt-2">
                                Selected: {options.fileName}
                            </p>
                        )}
                    </div>
                </TabsContent>
                
                <TabsContent value="builder" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* URL Parts Builder */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">URL Parts</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">Protocol</Label>
                                    <Select
                                        value={urlParts.protocol}
                                        onValueChange={(value) => setUrlParts(prev => ({ ...prev, protocol: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="https://">https://</SelectItem>
                                            <SelectItem value="http://">http://</SelectItem>
                                            <SelectItem value="ftp://">ftp://</SelectItem>
                                            <SelectItem value="file://">file://</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">Domain</Label>
                                    <Input
                                        placeholder="example.com"
                                        value={urlParts.domain}
                                        onChange={(e) => setUrlParts(prev => ({ ...prev, domain: e.target.value }))}
                                    />
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">Path</Label>
                                    <Input
                                        placeholder="/path/to/resource"
                                        value={urlParts.path}
                                        onChange={(e) => setUrlParts(prev => ({ ...prev, path: e.target.value }))}
                                    />
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-medium">Query String</Label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={parseQueryToParams}
                                            disabled={!urlParts.query}
                                        >
                                            Parse to Parameters
                                        </Button>
                                    </div>
                                    <Textarea
                                        placeholder="key1=value1&key2=value2"
                                        value={urlParts.query}
                                        onChange={(e) => setUrlParts(prev => ({ ...prev, query: e.target.value }))}
                                        className="min-h-20 font-mono text-sm"
                                    />
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">Fragment</Label>
                                    <Input
                                        placeholder="section1"
                                        value={urlParts.fragment}
                                        onChange={(e) => setUrlParts(prev => ({ ...prev, fragment: e.target.value }))}
                                    />
                                </div>
                                
                                <div className="flex gap-2">
                                    <Button onClick={buildUrlFromParts}>
                                        Build URL
                                    </Button>
                                    <Button variant="outline" onClick={parseUrlToParts}>
                                        Parse Current URL
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        
                        {/* Query Parameters Builder */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Query Parameters</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm font-medium">Parameters</Label>
                                    <Button variant="ghost" size="sm" onClick={addQueryParam}>
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add
                                    </Button>
                                </div>
                                
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {queryParams.map((param) => (
                                        <div key={param.id} className="flex items-center gap-2">
                                            <Switch
                                                checked={param.enabled}
                                                onCheckedChange={(checked) => updateQueryParam(param.id, 'enabled', checked)}
                                            />
                                            <Input
                                                placeholder="Key"
                                                value={param.key}
                                                onChange={(e) => updateQueryParam(param.id, 'key', e.target.value)}
                                                className="flex-1"
                                            />
                                            <Input
                                                placeholder="Value"
                                                value={param.value}
                                                onChange={(e) => updateQueryParam(param.id, 'value', e.target.value)}
                                                className="flex-1"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeQueryParam(param.id)}
                                                disabled={queryParams.length <= 1}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                
                                <Button onClick={buildQueryFromParams} className="w-full">
                                    Build Query String
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                
                <TabsContent value="batch" className="space-y-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label className="font-medium">Batch Input (one URL per line)</Label>
                            <Textarea
                                placeholder="https://example.com/path?query=value&#10;https://another-example.com/another/path"
                                value={batchInput}
                                onChange={(e) => setBatchInput(e.target.value)}
                                className="min-h-32 font-mono text-sm resize-y"
                            />
                        </div>
                        
                        <Button onClick={processBatch}>
                            Process Batch
                        </Button>
                        
                        {batchResults.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Batch Results</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-64">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Input</TableHead>
                                                    <TableHead>Output</TableHead>
                                                    <TableHead>Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {batchResults.map((result, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell className="font-mono text-sm max-w-xs truncate">
                                                            {result.input}
                                                        </TableCell>
                                                        <TableCell className="font-mono text-sm max-w-xs truncate">
                                                            {result.output}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={result.valid ? "default" : "destructive"}>
                                                                {result.valid ? "Success" : "Error"}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
            
            {/* Advanced Options */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <Label className="font-medium">Advanced Options</Label>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                        <Settings className="w-4 h-4 mr-2" />
                        {showAdvanced ? 'Hide' : 'Show'} Advanced
                    </Button>
                </div>
                
                {showAdvanced && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                        {options.mode === 'encode' && (
                            <>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        id="encode-spaces"
                                        checked={options.encodeSpaces !== false}
                                        onCheckedChange={(checked) => setOptions(prev => ({ ...prev, encodeSpaces: checked }))}
                                    />
                                    <Label htmlFor="encode-spaces" className="text-sm">Encode spaces</Label>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <Switch
                                        id="plus-for-space"
                                        checked={options.plusForSpace || false}
                                        onCheckedChange={(checked) => setOptions(prev => ({ ...prev, plusForSpace: checked }))}
                                    />
                                    <Label htmlFor="plus-for-space" className="text-sm">Use + for spaces</Label>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <Switch
                                        id="encode-special"
                                        checked={options.encodeSpecialChars !== false}
                                        onCheckedChange={(checked) => setOptions(prev => ({ ...prev, encodeSpecialChars: checked }))}
                                    />
                                    <Label htmlFor="encode-special" className="text-sm">Encode special characters</Label>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <Switch
                                        id="encode-reserved"
                                        checked={options.encodeReserved || false}
                                        onCheckedChange={(checked) => setOptions(prev => ({ ...prev, encodeReserved: checked }))}
                                    />
                                    <Label htmlFor="encode-reserved" className="text-sm">Encode reserved characters</Label>
                                </div>
                            </>
                        )}
                        
                        {options.mode === 'decode' && (
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="plus-to-space"
                                    checked={options.plusToSpace || false}
                                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, plusToSpace: checked }))}
                                />
                                <Label htmlFor="plus-to-space" className="text-sm">Convert + to space</Label>
                            </div>
                        )}
                        
                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium">Output Format</Label>
                            <Select
                                value={options.outputFormat || 'text'}
                                onValueChange={(value) => setOptions(prev => ({ ...prev, outputFormat: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="text">Plain Text</SelectItem>
                                    <SelectItem value="json">JSON</SelectItem>
                                    <SelectItem value="html">HTML</SelectItem>
                                    <SelectItem value="csv">CSV</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Status and Controls */}
            <div className="flex flex-wrap gap-2 items-center justify-between">
                <div className="flex gap-2 items-center">
                    <Badge variant="outline" className="flex items-center gap-1">
                        {getInputTypeIcon()}
                        {getInputTypeLabel()}
                    </Badge>
                    <span className="text-muted-foreground">→</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                        {result.outputType === 'encoded' ? 
                            <Link className="w-4 h-4" /> : 
                            <Type className="w-4 h-4" />
                        }
                        {getOutputTypeLabel()}
                    </Badge>
                    {isProcessing && (
                        <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
                    )}
                </div>
                
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={swapInputOutput}
                        disabled={!result.output || !result.isValid}
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Swap
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAll}
                    >
                        Clear
                    </Button>
                </div>
            </div>
            
            {/* Error Alert */}
            {result.error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{result.error}</AlertDescription>
                </Alert>
            )}
            
            {/* Success Alert */}
            {result.isValid && result.output && !result.error && (
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                        {result.outputType === 'encoded' ? 'Successfully URL encoded' : 'Successfully URL decoded'}
                        {result.fileName && ` • Output filename: ${result.fileName}`}
                    </AlertDescription>
                </Alert>
            )}
            
            {/* Output */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <Label className="font-medium">Output</Label>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCopy}
                            disabled={!result.output || !result.isValid}
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleDownload}
                            disabled={!result.output || !result.isValid}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={!result.output || !result.isValid}
                                >
                                    <Code className="w-4 h-4 mr-2" />
                                    Generate Code
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                    <DialogTitle>Generate Code</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col gap-4">
                                    <div className="flex gap-2">
                                        <Label className="text-sm font-medium self-center">Language:</Label>
                                        <Select
                                            value={codeLanguage}
                                            onValueChange={setCodeLanguage}
                                        >
                                            <SelectTrigger className="w-40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="javascript">JavaScript</SelectItem>
                                                <SelectItem value="python">Python</SelectItem>
                                                <SelectItem value="java">Java</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={copyCode}
                                        >
                                            <Copy className="w-4 h-4 mr-2" />
                                            Copy Code
                                        </Button>
                                    </div>
                                    <Textarea
                                        value={generateCode()}
                                        readOnly
                                        className="min-h-64 font-mono text-sm"
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                
                <Card className="relative">
                    <CardContent className="p-4">
                        <Textarea
                            ref={outputRef}
                            value={result.output}
                            readOnly
                            className="min-h-32 font-mono text-sm border-0 resize-y p-0 focus-visible:ring-0"
                            placeholder={result.error ? "Error in processing" : "Output will appear here..."}
                        />
                    </CardContent>
                </Card>
            </div>
            
            {/* Statistics */}
            {result.output && result.isValid && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="font-medium">Input Size</div>
                        <div className="text-muted-foreground">
                            {(options.input || options.fileContent || '').length} chars
                        </div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="font-medium">Output Size</div>
                        <div className="text-muted-foreground">
                            {result.output.length} chars
                        </div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="font-medium">Size Change</div>
                        <div className="text-muted-foreground">
                            {result.outputType === 'encoded' ? 
                                ((options.input || options.fileContent || '').length > 0 ? 
                                    `+${Math.round(((result.output.length - (options.input || options.fileContent || '').length) / (options.input || options.fileContent || '').length) * 100)}%` : 
                                    '+0%') : 
                                ((options.input || options.fileContent || '').length > 0 ? 
                                    `-${Math.round((((options.input || options.fileContent || '').length - result.output.length) / (options.input || options.fileContent || '').length) * 100)}%` : 
                                    '-0%')
                            }
                        </div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="font-medium">Operation</div>
                        <div className="text-muted-foreground">
                            {result.outputType === 'encoded' ? 'Encoded' : 'Decoded'}
                        </div>
                    </div>
                </div>
            )}
            
            {/* History Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <History className="w-5 h-5" />
                            Conversion History
                        </div>
                        <div className="flex gap-2">
                            {isPlaying ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={pauseHistory}
                                >
                                    <Pause className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={playHistory}
                                    disabled={history.length === 0}
                                >
                                    <Play className="w-4 h-4" />
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={prevHistoryItem}
                                disabled={currentHistoryIndex <= 0}
                            >
                                <SkipBack className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={nextHistoryItem}
                                disabled={currentHistoryIndex >= history.length - 1}
                            >
                                <SkipForward className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearHistory}
                                disabled={history.length === 0}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {history.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">No conversion history yet</p>
                    ) : (
                        <ScrollArea className="h-64">
                            <div className="space-y-2">
                                {history.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                            index === currentHistoryIndex
                                                ? 'bg-primary/10 border-primary'
                                                : 'bg-muted/30 hover:bg-muted/50'
                                        }`}
                                        onClick={() => loadFromHistory(item)}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {item.inputType}
                                                </Badge>
                                                <span className="text-muted-foreground">→</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {item.outputType}
                                                </Badge>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {item.timestamp.toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <div className="text-sm font-medium truncate">
                                            {item.input.substring(0, 50)}
                                            {item.input.length > 50 ? '...' : ''}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}