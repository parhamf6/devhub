'use client';

import { useState, useRef } from 'react';
import tomlyamlConverter, { converterInstance, ConversionOptions, ConversionResult } from '@/lib/tools/tool/tomlyaml';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Copy, Download, Upload, FileText, Code, Shuffle, Trash2, Settings, ChevronDown, ChevronUp, Zap, History } from 'lucide-react';
import { LearnButton } from '@/features/dashboard/tools/components/learn-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const tool = tomlyamlConverter;
const defaultOptions: ConversionOptions = {
  mode: 'toml-to-yaml',
  outputFormat: 'pretty',
  indentSize: 2,
  sortKeys: false,
  preserveComments: false,
  yamlFlowLevel: -1,
};

const EXAMPLES = {
  toml: `# Example TOML configuration
title = "TOML Example"
owner.name = "John Doe"
owner.dob = 1979-05-27T07:32:00Z

[database]
server = "192.168.1.1"
ports = [8001, 8002, 8003]
connection_max = 5000
enabled = true

[servers.alpha]
ip = "10.0.0.1"
dc = "eqdc10"

[servers.beta]
ip = "10.0.0.2"
dc = "eqdc10"`,

  yaml: `# Example YAML configuration
title: TOML Example
owner:
  name: John Doe
  dob: 1979-05-27T07:32:00.000Z

database:
  server: 192.168.1.1
  ports:
    - 8001
    - 8002
    - 8003
  connection_max: 5000
  enabled: true

servers:
  alpha:
    ip: 10.0.0.1
    dc: eqdc10
  beta:
    ip: 10.0.0.2
    dc: eqdc10`
};

export default function TomlYamlConverterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [options, setOptions] = useState<ConversionOptions>(defaultOptions);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<{ message: string; line?: number } | null>(null);
  const [history, setHistory] = useState<ConversionResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Conversion logic
  const convert = (val: string, opts = options) => {
    setIsLoading(true);
    setTimeout(() => {
      const result = converterInstance.convert(val, opts);
      setOutput(result.success ? result.output : '');
      if (!result.success && result.error) {
        setError({ message: result.error, line: result.errorLine });
        toast.error(result.error);
      } else {
        setError(null);
        // Save to history (limit to 20)
        setHistory(prev => {
          const next = [{ ...result, input: val, options: { ...opts } }, ...prev];
          return next.slice(0, 20);
        });
      }
      setIsLoading(false);
    }, 100);
  };

  // Handle input change
  const handleInputChange = (val: string) => {
    setInput(val);
    convert(val);
  };

  // Swap direction
  const handleSwap = () => {
    const newMode = options.mode === 'toml-to-yaml' ? 'yaml-to-toml' : 'toml-to-yaml';
    setOptions(prev => ({ ...prev, mode: newMode }));
    setInput(output);
    convert(output, { ...options, mode: newMode });
    toast.success('Direction swapped');
  };

  // Beautify TOML
  const handleBeautify = () => {
    if (options.mode === 'toml-to-yaml') {
      const result = converterInstance.beautifyToml(input, options.indentSize);
      if (result.success) {
        setInput(result.output);
        toast.success('Beautified TOML');
      } else {
        toast.error(result.error || 'Beautify failed');
      }
    } else {
      toast.info('Beautify only for TOML input');
    }
  };

  // Minify TOML
  const handleMinify = () => {
    if (options.mode === 'toml-to-yaml') {
      const result = converterInstance.minifyToml(input);
      if (result.success) {
        setInput(result.output);
        toast.success('Minified TOML');
      } else {
        toast.error(result.error || 'Minify failed');
      }
    } else {
      toast.info('Minify only for TOML input');
    }
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
    const format = options.mode === 'toml-to-yaml' ? 'yaml' : 'toml';
    const filename = converterInstance.generateFileName(format);
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
    setError(null);
    toast.success('Cleared');
  };

  // Insert example
  const handleExample = () => {
    const example = options.mode === 'toml-to-yaml' ? EXAMPLES.toml : EXAMPLES.yaml;
    setInput(example);
    convert(example);
    toast.success('Example loaded');
  };

  // Restore from history
  const handleHistoryRestore = (item: ConversionResult & { input: string; options: ConversionOptions }) => {
    setInput(item.input);
    setOutput(item.output);
    setOptions(item.options);
    toast.success('Restored from history');
  };

  // Counts
  const inputLines = input.split('\n').length;
  const inputChars = input.length;
  const outputLines = output.split('\n').length;
  const outputChars = output.length;

  // Error highlighting logic
  const getHighlightedInput = () => {
    if (!error?.line) return input;
    const lines = input.split('\n');
    return lines
      .map((line, idx) =>
        idx + 1 === error.line
          ? `>> ${line}` // Mark error line
          : `   ${line}`
      )
      .join('\n');
  };

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
            mdFilePath="content/learn/tomlyaml.md"
          />
        </div>

        {/* Settings */}
        <div className="flex flex-wrap gap-2 items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => setShowSettings(v => !v)}
                aria-label="Show settings"
              >
                <Settings className="w-4 h-4" />
                {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Show/Hide advanced settings</TooltipContent>
          </Tooltip>
          <span className="text-muted-foreground text-xs">Lines: {inputLines} | Chars: {inputChars}</span>
          <span className="text-muted-foreground text-xs">Output Lines: {outputLines} | Chars: {outputChars}</span>
        </div>

        {showSettings && (
          <div className="flex flex-wrap gap-4 items-center bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm">Indent:</span>
              <select
                value={options.indentSize}
                onChange={e => setOptions(prev => ({ ...prev, indentSize: Number(e.target.value) }))}
                className="rounded border border-border bg-popover px-2 py-1 text-sm"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Output:</span>
              <select
                value={options.outputFormat}
                onChange={e => setOptions(prev => ({ ...prev, outputFormat: e.target.value as ConversionOptions['outputFormat'] }))}
                className="rounded border border-border bg-popover px-2 py-1 text-sm"
              >
                <option value="pretty">Pretty</option>
                <option value="minified">Minified</option>
                <option value="compact">Compact</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={options.sortKeys}
                onChange={e => setOptions(prev => ({ ...prev, sortKeys: e.target.checked }))}
                className="rounded"
              />
              Sort Keys
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm">YAML Flow Level:</span>
              <input
                type="number"
                min={-1}
                max={10}
                value={options.yamlFlowLevel}
                onChange={e => setOptions(prev => ({ ...prev, yamlFlowLevel: Number(e.target.value) }))}
                className="w-16 rounded border border-border bg-popover px-2 py-1 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Mode:</span>
              <select
                value={options.mode}
                onChange={e => {
                  setOptions(prev => ({ ...prev, mode: e.target.value as ConversionOptions['mode'] }));
                  convert(input, { ...options, mode: e.target.value as ConversionOptions['mode'] });
                }}
                className="rounded border border-border bg-popover px-2 py-1 text-sm"
              >
                <option value="toml-to-yaml">TOML → YAML</option>
                <option value="yaml-to-toml">YAML → TOML</option>
                <option value="auto-detect">Auto Detect</option>
              </select>
            </div>
            <Button
              size="sm"
              variant="default"
              onClick={() => convert(input, options)}
            >
              Save & Convert
            </Button>
          </div>
        )}

        {/* Direction Toggle */}
        <div className="flex flex-col gap-4">
          <div className='flex flex-wrap gap-4'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" onClick={handleExample}>
                  <Zap className="w-4 h-4" /> Example
                </Button>
              </TooltipTrigger>
              <TooltipContent>Load example {options.mode === 'toml-to-yaml' ? 'TOML' : 'YAML'}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" onClick={handleClear}>
                  <Trash2 className="w-4 h-4" /> Clear All
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear input and output</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant={showHistory ? "secondary" : "outline"} onClick={() => setShowHistory(v => !v)}>
                  <History className="w-4 h-4" /> History
                </Button>
              </TooltipTrigger>
              <TooltipContent>Show conversion history</TooltipContent>
            </Tooltip>
          </div>
          <div className='flex gap-4 flex-wrap'>
            <Button
              variant={options.mode === 'toml-to-yaml' ? 'default' : 'outline'}
              onClick={() => {
                setOptions(prev => ({ ...prev, mode: 'toml-to-yaml' }));
                convert(input, { ...options, mode: 'toml-to-yaml' });
              }}
            >
              TOML → YAML
            </Button>
            <Button
              variant={options.mode === 'yaml-to-toml' ? 'default' : 'outline'}
              onClick={() => {
                setOptions(prev => ({ ...prev, mode: 'yaml-to-toml' }));
                convert(input, { ...options, mode: 'yaml-to-toml' });
              }}
            >
              YAML → TOML
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  onClick={handleSwap}
                  className="flex items-center gap-2"
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
              <span className="font-medium text-sm">Input</span>
              <div className="flex items-center gap">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".toml,.yaml,.yml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Upload file</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" onClick={handlePaste}>
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Paste from clipboard</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" onClick={handleBeautify}>
                      <Code className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Beautify TOML</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" onClick={handleMinify}>
                      <Code className="h-4 w-4 rotate-90" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Minify TOML</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" onClick={() => handleCopy(input, 'Input')} disabled={!input}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy input</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" onClick={handleClear}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clear input</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <textarea
              ref={inputRef}
              value={error?.line ? getHighlightedInput() : input}
              onChange={e => handleInputChange(e.target.value)}
              placeholder={
                options.mode === 'toml-to-yaml'
                  ? EXAMPLES.toml
                  : EXAMPLES.yaml
              }
              className={`flex-1 p-4 font-mono text-sm bg-transparent outline-none resize-none min-h-[200px] ${error?.line ? 'bg-error/10' : ''}`}
              spellCheck={false}
              autoFocus
              style={error?.line ? { color: '#b91c1c' } : undefined}
            />
            {error && (
              <div className="px-4 py-2 text-error text-xs bg-error/10 rounded-b">
                {error.line ? `Line ${error.line}: ` : ''}{error.message}
              </div>
            )}
          </Card>
          {/* Output Editor */}
          <Card className="flex-1 flex flex-col bg-card border border-border">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-popover rounded-t-lg">
              <span className="font-medium text-sm">Output</span>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" onClick={() => handleCopy(output, 'Output')} disabled={!output}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy output</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" onClick={handleDownload} disabled={!output}>
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
                      onClick={() => handleHistoryRestore(item as any)}
                    >
                      <div className="text-xs text-muted-foreground truncate">
                        {item.options.mode === 'toml-to-yaml' ? 'TOML → YAML' : 'YAML → TOML'} | {item.input?.slice(0, 40)}...
                      </div>
                      <div className="text-xs text-muted-foreground opacity-70">
                        {item.output?.slice(0, 40)}...
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