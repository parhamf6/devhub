'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
    Copy, 
    Download, 
    Upload, 
    FileText, 
    Code, 
    Shuffle, 
    Trash2, 
    Settings, 
    ChevronDown, 
    ChevronUp, 
    Zap, 
    History,
    Table,
    FileJson,
    FileSpreadsheet,
    Eye,
    EyeOff,
    RefreshCw
} from 'lucide-react';
import { LearnButton } from '@/features/dashboard/tools/components/learn-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Table as TableComponent, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import jsonCsvConverter , {formatValueTool} from '@/lib/tools/tool/jsoncsv';
// Tool metadata
const tool = jsonCsvConverter

// Conversion options
interface ConversionOptions {
  mode: 'json-to-csv' | 'csv-to-json';
  delimiter: string;
  header: boolean;
  skipEmptyLines: boolean;
  transform?: (row: any) => any;
  dynamicTyping: boolean;
  preview: boolean;
}

const defaultOptions: ConversionOptions = {
  mode: 'json-to-csv',
  delimiter: ',',
  header: true,
  skipEmptyLines: true,
  dynamicTyping: true,
  preview: true,
};

// Example data
const EXAMPLES = {
  json: `[
  {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com",
    "active": true
  },
  {
    "name": "Jane Smith",
    "age": 25,
    "email": "jane@example.com",
    "active": false
  }
]`,
  csv: `name,age,email,active
John Doe,30,john@example.com,true
Jane Smith,25,jane@example.com,false`
};

// Helper function to format values for display
const formatValue = formatValueTool

export default function JsonCsvConverterPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [options, setOptions] = useState<ConversionOptions>(defaultOptions);
    const [isLoading, setIsLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [error, setError] = useState<{ message: string; line?: number } | null>(null);
    const [history, setHistory] = useState<{ input: string; output: string; options: ConversionOptions }[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [showPreview, setShowPreview] = useState(true);
    const [papaLoaded, setPapaLoaded] = useState(false);
    const [showReformatOption, setShowReformatOption] = useState(false);
    const [isReformatted, setIsReformatted] = useState(false);
    
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const outputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load Papa Parse dynamically
    useEffect(() => {
        const loadPapa = async () => {
        try {
            const Papa = (await import('papaparse')).default;
            // Store Papa in window for global access
            (window as any).Papa = Papa;
            setPapaLoaded(true);
            
            // Load initial example
            const example = options.mode === 'json-to-csv' ? EXAMPLES.json : EXAMPLES.csv;
            setInput(example);
            convert(example);
        } catch (err) {
            console.error('Failed to load Papa Parse:', err);
            toast.error('Failed to load converter library');
        }
        };
        
        loadPapa();
    }, []);

    // Get Papa Parse instance
    const getPapa = () => {
        return (window as any).Papa;
    };

    // Convert JSON to CSV
    const jsonToCsv = (jsonString: string, opts: ConversionOptions) => {
        try {
        const Papa = getPapa();
        if (!Papa) throw new Error('Converter not loaded');
        
        const jsonData = JSON.parse(jsonString);
        
        // Check if JSON is an array
        if (!Array.isArray(jsonData)) {
            throw new Error('Input JSON must be an array of objects');
        }
        
        const csv = Papa.unparse(jsonData, {
            header: opts.header,
            skipEmptyLines: opts.skipEmptyLines,
            delimiter: opts.delimiter,
        });
        
        return { success: true, output: csv, data: jsonData };
        } catch (err) {
        return { success: false, error: (err as Error).message };
        }
    };

  // Convert CSV to JSON
    const csvToJson = (csvString: string, opts: ConversionOptions) => {
        try {
        const Papa = getPapa();
        if (!Papa) throw new Error('Converter not loaded');
        
        const result = Papa.parse(csvString, {
            header: opts.header,
            skipEmptyLines: opts.skipEmptyLines,
            delimiter: opts.delimiter,
            dynamicTyping: opts.dynamicTyping,
            transform: opts.transform,
        });
        
        if (result.errors.length > 0) {
            throw new Error(result.errors[0].message);
        }
        
        const jsonString = JSON.stringify(result.data, null, 2);
        return { success: true, output: jsonString, data: result.data };
        } catch (err) {
        return { success: false, error: (err as Error).message };
        }
    };

    // Main conversion function
    const convert = (val: string, opts = options) => {
        if (!val.trim() || !papaLoaded) {
        setOutput('');
        setPreviewData([]);
        return;
        }
        
        setIsLoading(true);
        setError(null);
        setShowReformatOption(false);
        
        setTimeout(() => {
        let result;
        
        if (opts.mode === 'json-to-csv') {
            result = jsonToCsv(val, opts);
            
            // Check if the error is about JSON not being an array
            if (!result.success && result.error === 'Input JSON must be an array of objects') {
            setShowReformatOption(true);
            }
        } else {
            result = csvToJson(val, opts);
        }
        
        if (result.success) {
            setOutput(result.output);
            setPreviewData(result.data || []);
            
            // Save to history (limit to 20)
            setHistory(prev => {
            const next = [{ input: val, output: result.output, options: { ...opts } }, ...prev];
            return next.slice(0, 20);
            });
        } else {
            setError({ message: result.error });
            toast.error(result.error);
        }
        
        setIsLoading(false);
        }, 100);
    };

    // Reformat JSON to be an array
    const handleReformatJson = () => {
        try {
        const parsedJson = JSON.parse(input);
        
        // If it's already an array, do nothing
        if (Array.isArray(parsedJson)) {
            toast.info('JSON is already in the correct format');
            return;
        }
        
        // Wrap the object in an array
        const reformattedJson = [parsedJson];
        const reformattedString = JSON.stringify(reformattedJson, null, 2);
        
        setInput(reformattedString);
        setIsReformatted(true);
        setShowReformatOption(false);
        convert(reformattedString);
        toast.success('JSON reformatted successfully');
        } catch (err) {
        toast.error('Failed to reformat JSON');
        }
    };

    // Handle input change
    const handleInputChange = (val: string) => {
        setInput(val);
        setIsReformatted(false); // Reset reformatted state when input changes
        convert(val);
    };

    // Swap direction
    const handleSwap = () => {
        const newMode = options.mode === 'json-to-csv' ? 'csv-to-json' : 'json-to-csv';
        setOptions(prev => ({ ...prev, mode: newMode }));
        setInput(output);
        convert(output, { ...options, mode: newMode });
        toast.success('Direction swapped');
    };

    // Copy output
    const handleCopy = (text: string, label: string) => {
        if (text) {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied!`);
        }
    };

    // Download output
    const handleDownload = () => {
        if (!output) return;
        const format = options.mode === 'json-to-csv' ? 'csv' : 'json';
        const filename = `converted.${format}`;
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(`Downloaded as .${format}`);
    };

    // Paste from clipboard
    const handlePaste = async () => {
        try {
        const text = await navigator.clipboard.readText();
        setInput(text);
        setIsReformatted(false);
        convert(text);
        toast.success('Pasted from clipboard');
        } catch {
        toast.error('Paste failed');
        }
    };

    // Upload file
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            setInput(text);
            setIsReformatted(false);
            convert(text);
            toast.success('File loaded');
        };
        reader.readAsText(file);
        }
    };

    // Clear input/output
    const handleClear = () => {
        setInput('');
        setOutput('');
        setPreviewData([]);
        setError(null);
        setShowReformatOption(false);
        setIsReformatted(false);
        toast.success('Cleared');
    };

    // Insert example
    const handleExample = () => {
        const example = options.mode === 'json-to-csv' ? EXAMPLES.json : EXAMPLES.csv;
        setInput(example);
        setIsReformatted(false);
        convert(example);
        toast.success('Example loaded');
    };

    // Restore from history
    const handleHistoryRestore = (item: { input: string; output: string; options: ConversionOptions }) => {
        setInput(item.input);
        setOutput(item.output);
        setOptions(item.options);
        setIsReformatted(false);
        toast.success('Restored from history');
    };

    // Toggle preview
    const handleTogglePreview = () => {
        setShowPreview(!showPreview);
    };

    // Counts
    const inputLines = input.split('\n').length;
    const inputChars = input.length;
    const outputLines = output.split('\n').length;
    const outputChars = output.length;

    return (
        <TooltipProvider>
        <div className="flex flex-col p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold">{tool.name}</h1>
                <p className="text-muted-foreground">{tool.description}</p>
            </div>
            <LearnButton
                tool={{
                name: tool.name,
                description: tool.description,
                slug: tool.slug,
                category: tool.category,
                tags: tool.tags,
                }}
                variant="secondary"
                mdFilePath="content/learn/jsoncsv.md"
            />
            </div>

            {/* Loading state */}
            {!papaLoaded && (
            <Card className="p-4 bg-muted border border-border">
                <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm">Loading converter library...</span>
                </div>
            </Card>
            )}

            {/* Settings */}
            <div className="flex flex-wrap gap-2 items-center">
            <Tooltip>
                <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    onClick={() => setShowSettings(v => !v)}
                    aria-label="Show settings"
                    disabled={!papaLoaded}
                >
                    <Settings className="w-4 h-4" />
                    {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
                </TooltipTrigger>
                <TooltipContent>Show/Hide advanced settings</TooltipContent>
            </Tooltip>
            
            <span className="text-muted-foreground text-xs">Lines: {inputLines} | Chars: {inputChars}</span>
            <span className="text-muted-foreground text-xs">Output Lines: {outputLines} | Chars: {outputChars}</span>
            
            {options.mode === 'json-to-csv' && (
                <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                    variant={showPreview ? "secondary" : "outline"}
                    size="sm"
                    onClick={handleTogglePreview}
                    disabled={!papaLoaded}
                    >
                    {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>{showPreview ? 'Hide table preview' : 'Show table preview'}</TooltipContent>
                </Tooltip>
            )}
            </div>

            {showSettings && (
            <div className="flex flex-wrap gap-4 items-center bg-muted/50 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2">
                <span className="text-sm">Delimiter:</span>
                <select
                    value={options.delimiter}
                    onChange={e => setOptions(prev => ({ ...prev, delimiter: e.target.value }))}
                    className="rounded border border-border bg-popover px-2 py-1 text-sm"
                    disabled={!papaLoaded}
                >
                    <option value=",">Comma (,)</option>
                    <option value=";">Semicolon (;)</option>
                    <option value="\t">Tab</option>
                    <option value="|">Pipe (|)</option>
                </select>
                </div>
                
                <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    checked={options.header}
                    onChange={e => setOptions(prev => ({ ...prev, header: e.target.checked }))}
                    className="rounded"
                    disabled={!papaLoaded}
                />
                Header Row
                </label>
                
                <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    checked={options.skipEmptyLines}
                    onChange={e => setOptions(prev => ({ ...prev, skipEmptyLines: e.target.checked }))}
                    className="rounded"
                    disabled={!papaLoaded}
                />
                Skip Empty Lines
                </label>
                
                {options.mode === 'csv-to-json' && (
                <label className="flex items-center gap-2 text-sm">
                    <input
                    type="checkbox"
                    checked={options.dynamicTyping}
                    onChange={e => setOptions(prev => ({ ...prev, dynamicTyping: e.target.checked }))}
                    className="rounded"
                    disabled={!papaLoaded}
                    />
                    Dynamic Typing
                </label>
                )}
                
                <div className="flex items-center gap-2">
                <span className="text-sm">Mode:</span>
                <select
                    value={options.mode}
                    onChange={e => {
                    setOptions(prev => ({ ...prev, mode: e.target.value as ConversionOptions['mode'] }));
                    convert(input, { ...options, mode: e.target.value as ConversionOptions['mode'] });
                    }}
                    className="rounded border border-border bg-popover px-2 py-1 text-sm"
                    disabled={!papaLoaded}
                >
                    <option value="json-to-csv">JSON → CSV</option>
                    <option value="csv-to-json">CSV → JSON</option>
                </select>
                </div>
                
                <Button
                size="sm"
                variant="default"
                onClick={() => convert(input, options)}
                disabled={!papaLoaded}
                >
                Apply & Convert
                </Button>
            </div>
            )}

            {/* Direction Toggle */}
            <div className="flex flex-col gap-4">
            <div className='flex flex-wrap gap-4'>
                <Tooltip>
                <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" onClick={handleExample} disabled={!papaLoaded}>
                    <Zap className="w-4 h-4" /> Example
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Load example {options.mode === 'json-to-csv' ? 'JSON' : 'CSV'}</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" onClick={handleClear} disabled={!papaLoaded}>
                    <Trash2 className="w-4 h-4" /> Clear All
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Clear input and output</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                <TooltipTrigger asChild>
                    <Button size="sm" variant={showHistory ? "secondary" : "outline"} onClick={() => setShowHistory(v => !v)} disabled={!papaLoaded}>
                    <History className="w-4 h-4" /> History
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Show conversion history</TooltipContent>
                </Tooltip>
            </div>
            
            <div className='flex gap-4 flex-wrap'>
                <Button
                variant={options.mode === 'json-to-csv' ? 'default' : 'outline'}
                onClick={() => {
                    setOptions(prev => ({ ...prev, mode: 'json-to-csv' }));
                    convert(input, { ...options, mode: 'json-to-csv' });
                }}
                disabled={!papaLoaded}
                >
                <FileJson className="w-4 h-4 mr-2" /> JSON → CSV
                </Button>
                
                <Button
                variant={options.mode === 'csv-to-json' ? 'default' : 'outline'}
                onClick={() => {
                    setOptions(prev => ({ ...prev, mode: 'csv-to-json' }));
                    convert(input, { ...options, mode: 'csv-to-json' });
                }}
                disabled={!papaLoaded}
                >
                <FileSpreadsheet className="w-4 h-4 mr-2" /> CSV → JSON
                </Button>
                
                <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                    variant="secondary"
                    onClick={handleSwap}
                    className="flex items-center gap-2"
                    disabled={!papaLoaded}
                    >
                    <Shuffle className="w-4 h-4" />
                    Swap
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Swap direction</TooltipContent>
                </Tooltip>
            </div>
            </div>

            {/* Editors */}
            <div className="flex flex-col md:flex-row gap-4">
            {/* Input Editor */}
            <Card className="flex-1 flex flex-col bg-card border border-border">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-popover rounded-t-lg">
                <span className="font-medium text-sm flex items-center gap-2">
                    {options.mode === 'json-to-csv' ? 
                    <><FileJson className="w-4 h-4" /> JSON Input</> : 
                    <><FileSpreadsheet className="w-4 h-4" /> CSV Input</>
                    }
                    {isReformatted && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Reformatted</span>
                    )}
                </span>
                <div className="flex items-center gap">
                    <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={!papaLoaded}
                    />
                    <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={!papaLoaded}
                        >
                        <Upload className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Upload file</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" onClick={handlePaste} disabled={!papaLoaded}>
                        <FileText className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Paste from clipboard</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" onClick={() => handleCopy(input, 'Input')} disabled={!input || !papaLoaded}>
                        <Copy className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy input</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" onClick={handleClear} disabled={!papaLoaded}>
                        <Trash2 className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear input</TooltipContent>
                    </Tooltip>
                </div>
                </div>
                
                <textarea
                ref={inputRef}
                value={input}
                onChange={e => handleInputChange(e.target.value)}
                placeholder={
                    options.mode === 'json-to-csv'
                    ? EXAMPLES.json
                    : EXAMPLES.csv
                }
                className={`flex-1 p-4 font-mono text-sm bg-transparent outline-none resize-none min-h-[200px] ${error ? 'bg-error/10' : ''}`}
                spellCheck={false}
                autoFocus
                disabled={!papaLoaded}
                style={error ? { color: '#b91c1c' } : undefined}
                />
                
                {error && (
                <div className="px-4 py-2 text-error text-xs bg-error/10 rounded-b">
                    {error.message}
                    {showReformatOption && (
                    <div className="mt-2 flex items-center gap-2">
                        <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleReformatJson}
                        className="text-xs h-7 px-2"
                        >
                        <RefreshCw className="w-3 h-3 mr-1" /> Reformat JSON
                        </Button>
                        <span className="text-xs">Wrap JSON object in an array</span>
                    </div>
                    )}
                </div>
                )}
            </Card>
            
            {/* Output Editor */}
            <Card className="flex-1 flex flex-col bg-card border border-border">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-popover rounded-t-lg">
                <span className="font-medium text-sm flex items-center gap-2">
                    {options.mode === 'json-to-csv' ? 
                    <><FileSpreadsheet className="w-4 h-4" /> CSV Output</> : 
                    <><FileJson className="w-4 h-4" /> JSON Output</>
                    }
                </span>
                <div className="flex items-center gap-1">
                    <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" onClick={() => handleCopy(output, 'Output')} disabled={!output || !papaLoaded}>
                        <Copy className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy output</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" onClick={handleDownload} disabled={!output || !papaLoaded}>
                        <Download className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download output</TooltipContent>
                    </Tooltip>
                </div>
                </div>
                
                <textarea
                ref={outputRef}
                value={output}
                readOnly
                placeholder="Converted output will appear here..."
                className="flex-1 p-4 font-mono text-sm bg-transparent outline-none resize-none min-h-[200px]"
                spellCheck={false}
                />
            </Card>
            </div>

            {/* CSV Preview Table */}
            {options.mode === 'json-to-csv' && showPreview && previewData.length > 0 && (
            <Card className="p-4 bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                <Table className="w-4 h-4" />
                <span className="font-semibold text-sm">CSV Preview</span>
                <span className="text-xs text-muted-foreground ml-auto">
                    Showing {previewData.length} rows
                </span>
                </div>
                
                <div className="max-h-96 overflow-auto">
                <TableComponent>
                    <TableHeader>
                    <TableRow>
                        {Object.keys(previewData[0]).map((key, index) => (
                        <TableHead key={index} className="font-medium">{key}</TableHead>
                        ))}
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {previewData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                        {Object.values(row).map((value: any, cellIndex) => (
                            <TableCell key={cellIndex} className="text-sm">
                            {formatValue(value)}
                            </TableCell>
                        ))}
                        </TableRow>
                    ))}
                    </TableBody>
                </TableComponent>
                </div>
            </Card>
            )}

            {/* History Panel */}
            {showHistory && (
            <div className="mt-4">
                <Card className="p-4 bg-muted border border-border">
                <div className="flex items-center gap-2 mb-2">
                    <History className="w-4 h-4" />
                    <span className="font-semibold text-sm">Conversion History</span>
                </div>
                
                {history.length === 0 && (
                    <div className="text-xs text-muted-foreground">No history yet.</div>
                )}
                
                {history.length > 0 && (
                    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                    {history.map((item, idx) => (
                        <button
                        key={idx}
                        className="p-2 rounded hover:bg-accent cursor-pointer transition"
                        onClick={() => handleHistoryRestore(item)}
                        >
                        <div className="text-xs text-muted-foreground truncate">
                            {item.options.mode === 'json-to-csv' ? 'JSON → CSV' : 'CSV → JSON'} | {item.input.slice(0, 40)}...
                        </div>
                        <div className="text-xs text-muted-foreground opacity-70">
                            {item.output.slice(0, 40)}...
                        </div>
                        </button>
                    ))}
                    </div>
                )}
                </Card>
            </div>
            )}
        </div>
        </TooltipProvider>
    );
}