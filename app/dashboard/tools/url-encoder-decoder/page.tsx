'use client';

import { useEffect, useState, useCallback } from 'react';
// import type { URLOptions, URLResult } from '@/lib/tools/tool/url';
import urlEncoder , {URLOptions, URLResult} from '@/lib/tools/tool/url-encoder-decoder';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    Copy, 
    Download, 
    Upload, 
    RotateCcw, 
    FileText, 
    Link,
    AlertCircle,
    CheckCircle2,
    RefreshCw
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

const tool = urlEncoder;

export default function URLEncoderPage() {
    const [options, setOptions] = useState<URLOptions>({
        mode: 'auto',
        input: '',
        outputFormat: 'text'
    });
    
    const [result, setResult] = useState<URLResult>({
        output: '',
        inputType: 'text',
        outputType: 'text',
        isValid: true
    });
    
    const [isDragOver, setIsDragOver] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const processInput = useCallback(async () => {
        if (!tool?.process) return;
        
        setIsProcessing(true);
        
        // Add small delay for better UX on fast operations
        setTimeout(() => {
            const processResult = tool.process(options);
            setResult(processResult);
            setIsProcessing(false);
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
            };
            reader.readAsText(file);
        }
    };

    const clearAll = () => {
        setOptions({
            mode: 'auto',
            input: '',
            outputFormat: 'text'
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

    const getInputTypeIcon = () => {
        switch (result.inputType) {
            case 'encoded': return <Link className="w-4 h-4" />;
            case 'file': return <FileText className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    const getInputTypeLabel = () => {
        switch (result.inputType) {
            case 'encoded': return 'URL Encoded';
            case 'file': return 'File';
            default: return 'Text';
        }
    };

    const getOutputTypeLabel = () => {
        return result.outputType === 'encoded' ? 'URL Encoded' : 'Text';
    };

    return (
        <div className="flex flex-col justify-center p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 justify-between">
                <div className='flex justify-between gap-4 flex-wrap'>
                    <div>
                        <h1 className="text-2xl font-bold">{tool?.name}</h1>
                    </div>
                    <div>
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
                </div>
                <div>
                    <p className="text-muted-foreground">{tool?.description}</p>
                </div>
            </div>

            {/* Mode Selection */}
            <div className="flex flex-col gap-2">
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
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".txt,.url"
                />
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('file-upload')?.click()}
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

            {/* Text Input */}
            <div className="flex flex-col gap-2">
                <Label className="font-medium">Text Input</Label>
                <Textarea
                    placeholder="Enter URL to encode/decode or upload a file above..."
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
                            <FileText className="w-4 h-4" />
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
                    </div>
                </div>
                
                <Card className="relative">
                    <CardContent className="p-4">
                        <Textarea
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
        </div>
    );
}