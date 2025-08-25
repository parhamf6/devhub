'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import type { Base64Options, Base64Result } from '@/lib/tools/tool/base64';
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
    Binary,
    AlertCircle,
    CheckCircle2,
    RefreshCw,
    History,
    Settings,
    Code,
    FileImage,
    File,
    Hash,
    Link,
    Type,
    Save,
    Trash2,
    Play,
    Pause,
    SkipForward,
    SkipBack,
    Moon,
    Sun
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
import { Slider } from '@/components/ui/slider';
import base64Encoder from '@/lib/tools/tool/base64';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const tool = base64Encoder;

// Define types for our advanced features
type ConversionHistory = {
    id: string;
    timestamp: Date;
    input: string;
    output: string;
    inputType: string;
    outputType: string;
    options: Base64Options;
};

type Preset = {
    id: string;
    name: string;
    description: string;
    options: Base64Options;
};

const DEFAULT_PRESETS: Preset[] = [
    {
        id: 'standard-encode',
        name: 'Standard Encoding',
        description: 'Encode text to standard Base64',
        options: {
            mode: 'encode',
            input: '',
            outputFormat: 'text',
            charset: 'utf-8',
            lineBreaks: false,
            urlSafe: false,
            includePadding: true
        }
    },
    {
        id: 'url-safe-encode',
        name: 'URL-Safe Encoding',
        description: 'Encode text to URL-safe Base64',
        options: {
            mode: 'encode',
            input: '',
            outputFormat: 'text',
            charset: 'utf-8',
            lineBreaks: false,
            urlSafe: true,
            includePadding: false
        }
    },
    {
        id: 'mime-encode',
        name: 'MIME Encoding',
        description: 'Encode text to MIME Base64 with line breaks',
        options: {
            mode: 'encode',
            input: '',
            outputFormat: 'text',
            charset: 'utf-8',
            lineBreaks: true,
            lineLength: 76,
            urlSafe: false,
            includePadding: true
        }
    },
    {
        id: 'standard-decode',
        name: 'Standard Decoding',
        description: 'Decode standard Base64 to text',
        options: {
            mode: 'decode',
            input: '',
            outputFormat: 'text',
            charset: 'utf-8'
        }
    },
    {
        id: 'url-safe-decode',
        name: 'URL-Safe Decoding',
        description: 'Decode URL-safe Base64 to text',
        options: {
            mode: 'decode',
            input: '',
            outputFormat: 'text',
            charset: 'utf-8',
            urlSafe: true
        }
    }
];

const CODE_GENERATION_TEMPLATES = {
    javascript: (input: string, isEncode: boolean, options: any) => {
        const method = isEncode ? 'btoa' : 'atob';
        let code = `// ${isEncode ? 'Encode' : 'Decode'} string to ${isEncode ? 'Base64' : 'text'}\n`;
        code += `const input = '${input.replace(/'/g, "\\'")}';\n\n`;
        
        if (options.urlSafe && isEncode) {
            code += `// URL-safe encoding\n`;
            code += `let encoded = btoa(input)\n`;
            code += `  .replace(/\\+/g, '-')\n`;
            code += `  .replace(/\\//g, '_')\n`;
            code += `  .replace(/=/g, '');\n\n`;
            code += `console.log(encoded);`;
        } else if (options.urlSafe && !isEncode) {
            code += `// URL-safe decoding\n`;
            code += `let decoded = atob(input\n`;
            code += `  .replace(/-/g, '+')\n`;
            code += `  .replace(/_/g, '/')\n`;
            code += `  .padEnd(input.length + (4 - input.length % 4) % 4, '='));\n\n`;
            code += `console.log(decoded);`;
        } else {
            code += `const result = ${method}(input);\n\n`;
            code += `console.log(result);`;
        }
        
        return code;
    },
    python: (input: string, isEncode: boolean, options: any) => {
        const method = isEncode ? 'b64encode' : 'b64decode';
        let code = `import base64\n\n`;
        code += `# ${isEncode ? 'Encode' : 'Decode'} string to ${isEncode ? 'Base64' : 'text'}\n`;
        code += `input = '${input.replace(/'/g, "\\'")}'.encode('utf-8')\n\n`;
        
        if (options.urlSafe) {
            code += `# URL-safe ${isEncode ? 'encoding' : 'decoding'}\n`;
            code += `result = base64.${method}(input).decode('utf-8')\n`;
            
            if (isEncode) {
                code += `  .replace('+', '-')\n`;
                code += `  .replace('/', '_')\n`;
                code += `  .replace('=', '')\n`;
            } else {
                code += `  .replace('-', '+')\n`;
                code += `  .replace('_', '/')\n`;
                code += `  .pad '=' * ((4 - len(result) % 4) % 4)\n`;
            }
        } else {
            code += `result = base64.${method}(input).decode('utf-8')\n`;
        }
        
        code += `\nprint(result)`;
        return code;
    },
    java: (input: string, isEncode: boolean, options: any) => {
        const method = isEncode ? 'encodeToString' : 'decode';
        let code = `import java.util.Base64;\nimport java.nio.charset.StandardCharsets;\n\n`;
        code += `public class Base64Example {\n`;
        code += `    public static void main(String[] args) {\n`;
        code += `        String input = "${input.replace(/"/g, '\\"')}";\n\n`;
        
        if (options.urlSafe) {
            code += `        // URL-safe ${isEncode ? 'encoding' : 'decoding'}\n`;
            code += `        Base64.${isEncode ? 'getUrlEncoder' : 'getUrlDecoder'}()`;
        } else {
            code += `        // Standard ${isEncode ? 'encoding' : 'decoding'}\n`;
            code += `        Base64.get${isEncode ? 'Encoder' : 'Decoder'}()`;
        }
        
        code += `.${method}(input.getBytes(StandardCharsets.UTF_8))`;
        
        if (!isEncode) {
            code += `, StandardCharsets.UTF_8)`;
        }
        
        code += `;\n\n`;
        code += `        System.out.println(result);\n`;
        code += `    }\n`;
        code += `}`;
        
        return code;
    }
};

export default function Base64EncoderPage() {
    const [options, setOptions] = useState<Base64Options>({
        mode: 'auto',
        input: '',
        outputFormat: 'text',
        charset: 'utf-8',
        lineBreaks: false,
        lineLength: 76,
        urlSafe: false,
        includePadding: true
    });
    
    const [result, setResult] = useState<Base64Result>({
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
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const outputRef = useRef<HTMLTextAreaElement>(null);
    
    // Load history from localStorage on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('base64-history');
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
            localStorage.setItem('base64-history', JSON.stringify(history));
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
            (result.outputType === 'base64' ? 'encoded.base64.txt' : 'decoded.txt');
        
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
        
        // Handle different file types
        if (file.type.startsWith('image/')) {
            reader.readAsDataURL(file);
        } else {
            reader.readAsText(file);
        }
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
            
            // Handle different file types
            if (file.type.startsWith('image/')) {
                reader.readAsDataURL(file);
            } else {
                reader.readAsText(file);
            }
        }
    };
    
    const clearAll = () => {
        setOptions({
            mode: 'auto',
            input: '',
            outputFormat: 'text',
            charset: 'utf-8',
            lineBreaks: false,
            lineLength: 76,
            urlSafe: false,
            includePadding: true
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
            localStorage.removeItem('base64-history');
            toast.success('History cleared');
        }
    };
    
    const generateCode = () => {
        const input = options.input || options.fileContent || '';
        const isEncode = result.outputType === 'base64';
        
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
    
    const getInputTypeIcon = () => {
        switch (result.inputType) {
            case 'base64': return <Binary className="w-4 h-4" />;
            case 'file': return <File className="w-4 h-4" />;
            case 'image': return <FileImage className="w-4 h-4" />;
            case 'hex': return <Hash className="w-4 h-4" />;
            case 'url': return <Link className="w-4 h-4" />;
            default: return <Type className="w-4 h-4" />;
        }
    };
    
    const getInputTypeLabel = () => {
        switch (result.inputType) {
            case 'base64': return 'Base64';
            case 'file': return 'File';
            case 'image': return 'Image';
            case 'hex': return 'Hex';
            case 'url': return 'URL';
            default: return 'Text';
        }
    };
    
    const getOutputTypeLabel = () => {
        return result.outputType === 'base64' ? 'Base64' : 'Text';
    };
    
    const handleUrlInput = (url: string) => {
        // Simple URL validation
        if (!url.match(/^https?:\/\//i)) {
            toast.error('Please enter a valid URL');
            return;
        }
        
        // In a real implementation, we would fetch the URL content
        // For now, we'll just set the URL as input
        setOptions(prev => ({
            ...prev,
            input: url,
            fileName: undefined,
            fileContent: undefined
        }));
        setActiveTab('url');
    };
    
    const handleHexInput = (hex: string) => {
        // Simple hex validation
        if (!/^[0-9A-Fa-f]+$/.test(hex)) {
            toast.error('Please enter valid hexadecimal characters');
            return;
        }
        
        setOptions(prev => ({
            ...prev,
            input: hex,
            fileName: undefined,
            fileContent: undefined
        }));
        setActiveTab('hex');
    };
    
    return (
        <div className={`flex flex-col justify-center p-2 md:p-6 space-y-6`}>
            {/* Header */}
            <div className="flex flex-col gap-4 justify-between">
                <div className='flex justify-between gap-4 flex-wrap'>
                    <div>
                        <h1 className="text-2xl font-bold">{tool?.name}</h1>
                    </div>
                    <div className="flex gap-2">
                        <LearnButton 
                            tool={{
                                name: tool?.name || '',
                                description: tool?.description || '',
                                slug: tool?.slug || 'base64-encoder',
                                category: tool?.category || 'Encoding',
                                tags: tool?.tags
                            }}
                            variant="secondary"
                            mdFilePath="content/learn/base64.md"
                        />
                    </div>
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
                            <SelectItem value="encode">Encode to Base64</SelectItem>
                            <SelectItem value="decode">Decode from Base64</SelectItem>
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
                    <TabsTrigger value="url" className="flex items-center gap-1">
                        <Link className="w-4 h-4" />
                        URL
                    </TabsTrigger>
                    <TabsTrigger value="hex" className="flex items-center gap-1">
                        <Hash className="w-4 h-4" />
                        Hex
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <Label className="font-medium">Text Input</Label>
                        <Textarea
                            placeholder="Enter text to encode/decode..."
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
                            accept=".txt,.base64,.jpg,.jpeg,.png,.gif,.webp"
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
                
                <TabsContent value="url" className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <Label className="font-medium">URL Input</Label>
                        <div className="flex gap-2 items-center">
                            <Input
                                placeholder="https://example.com/file.txt"
                                value={options.input}
                                onChange={(e) => setOptions(prev => ({ 
                                    ...prev, 
                                    input: e.target.value
                                }))}
                                className="font-mono text-sm"
                            />
                            <Button
                                onClick={() => handleUrlInput(options.input)}
                                disabled={!options.input}
                            >
                                Fetch
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Enter a URL to fetch its content and encode/decode it
                        </p>
                    </div>
                </TabsContent>
                
                <TabsContent value="hex" className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <Label className="font-medium">Hexadecimal Input</Label>
                        <div className="flex gap-2">
                            <Textarea
                                placeholder="48656C6C6F20576F726C64"
                                value={options.input}
                                onChange={(e) => setOptions(prev => ({ 
                                    ...prev, 
                                    input: e.target.value
                                }))}
                                className="min-h-32 font-mono text-sm resize-y"
                            />
                            <Button
                                onClick={() => handleHexInput(options.input)}
                                disabled={!options.input}
                                className="self-start"
                            >
                                Convert
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Enter hexadecimal values (0-9, A-F) to convert to text and then encode/decode
                        </p>
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
                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium">Character Encoding</Label>
                            <Select
                                value={options.charset || 'utf-8'}
                                onValueChange={(value) => setOptions(prev => ({ ...prev, charset: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="utf-8">UTF-8</SelectItem>
                                    <SelectItem value="utf-16">UTF-16</SelectItem>
                                    <SelectItem value="ascii">ASCII</SelectItem>
                                    <SelectItem value="iso-8859-1">ISO-8859-1</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
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
                                    <SelectItem value="data-uri">Data URI</SelectItem>
                                    <SelectItem value="html">HTML Embed</SelectItem>
                                    <SelectItem value="css">CSS Embed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Switch
                                id="url-safe"
                                checked={options.urlSafe || false}
                                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, urlSafe: checked }))}
                            />
                            <Label htmlFor="url-safe" className="text-sm">URL-safe encoding</Label>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Switch
                                id="include-padding"
                                checked={options.includePadding !== false}
                                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includePadding: checked }))}
                            />
                            <Label htmlFor="include-padding" className="text-sm">Include padding</Label>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="line-breaks"
                                    checked={options.lineBreaks || false}
                                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, lineBreaks: checked }))}
                                />
                                <Label htmlFor="line-breaks" className="text-sm">Add line breaks</Label>
                            </div>
                            
                            {options.lineBreaks && (
                                <div className="mt-2">
                                    <Label className="text-xs text-muted-foreground">
                                        Line length: {options.lineLength || 76} characters
                                    </Label>
                                    <Slider
                                        value={[options.lineLength || 76]}
                                        onValueChange={(value) => setOptions(prev => ({ ...prev, lineLength: value[0] }))}
                                        max={120}
                                        min={16}
                                        step={4}
                                        className="mt-1"
                                    />
                                </div>
                            )}
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
                        {result.outputType === 'base64' ? 
                            <Binary className="w-4 h-4" /> : 
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
                        {result.outputType === 'base64' ? 'Successfully encoded to Base64' : 'Successfully decoded from Base64'}
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
                            {result.outputType === 'base64' ? '+33%' : '-25%'}
                        </div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="font-medium">Operation</div>
                        <div className="text-muted-foreground">
                            {result.outputType === 'base64' ? 'Encoded' : 'Decoded'}
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