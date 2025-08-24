'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import uuidGenerator, { UUIDOptions } from '@/lib/tools/tool/uuid-generator';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { 
  Copy, 
  RefreshCcw, 
  Download, 
  Upload, 
  History, 
  Settings, 
  CheckCircle, 
  X, 
  FileText,
  Hash,
  Trash2,
  Save,
  Info,
  AlertTriangle
} from 'lucide-react';
import { LearnButton } from '@/features/dashboard/tools/components/learn-button';

const tool = uuidGenerator;

// Types
interface UUIDHistoryItem {
  id: string;
  timestamp: number;
  options: UUIDOptions;
  uuids: string[];
  name?: string;
}

interface ValidationResult {
  uuid: string;
  valid: boolean;
  version?: string;
  variant?: string;
  error?: string;
}

interface UUIDVersion {
  value: 'v1' | 'v2' | 'v3' | 'v4' | 'v5';
  label: string;
  description: string;
}

interface OutputFormat {
  value: 'plain' | 'json' | 'csv' | 'sql' | 'javascript';
  label: string;
}

interface Namespace {
  value: string;
  label: string;
  uuid: string;
}

// UUID versions with descriptions
const uuidVersions: UUIDVersion[] = [
  { value: 'v1', label: 'Version 1', description: 'Time-based UUID' },
  { value: 'v2', label: 'Version 2', description: 'DCE Security UUID' },
  { value: 'v3', label: 'Version 3', description: 'MD5 hash-based UUID' },
  { value: 'v4', label: 'Version 4', description: 'Random UUID' },
  { value: 'v5', label: 'Version 5', description: 'SHA-1 hash-based UUID' }
];

// Output formats
const outputFormats: OutputFormat[] = [
  { value: 'plain', label: 'Plain Text' },
  { value: 'json', label: 'JSON Array' },
  { value: 'csv', label: 'CSV' },
  { value: 'sql', label: 'SQL Insert' },
  { value: 'javascript', label: 'JavaScript Array' }
];

// Predefined namespaces for v3 and v5
const predefinedNamespaces: Namespace[] = [
  { value: 'dns', label: 'DNS Namespace', uuid: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' },
  { value: 'url', label: 'URL Namespace', uuid: '6ba7b811-9dad-11d1-80b4-00c04fd430c8' },
  { value: 'oid', label: 'OID Namespace', uuid: '6ba7b812-9dad-11d1-80b4-00c04fd430c8' },
  { value: 'x500', label: 'X.500 DN Namespace', uuid: '6ba7b814-9dad-11d1-80b4-00c04fd430c8' }
];

export default function UUIDGeneratorPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Generator state
  const [options, setOptions] = useState<UUIDOptions>({
    version: 'v4',
    uppercase: false,
    removeHyphens: false,
    count: 5,
    namespace: '',
    name: '',
    outputFormat: 'plain'
  });
  
  const [uuids, setUUIDs] = useState<string[]>([]);
  const [history, setHistory] = useState<UUIDHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  
  // Validation state
  const [validationInput, setValidationInput] = useState<string>('');
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  
  // Settings state
  const [autoCopy, setAutoCopy] = useState<boolean>(false);
  
  // Initialize
  useEffect(() => {
    generate();
    loadHistory();
  }, []);
  
  // Load history from localStorage
  const loadHistory = useCallback(() => {
    const savedHistory = localStorage.getItem('uuidHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory) as UUIDHistoryItem[]);
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);
  
  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('uuidHistory', JSON.stringify(history));
  }, [history]);
  
  // Generate UUIDs
  const generate = useCallback(() => {
    try {
      const result = tool.generate(options);
      setUUIDs(result as string[]);
      
      if (autoCopy && result.length === 1) {
        navigator.clipboard.writeText(result[0] as string);
        toast.success('UUID copied to clipboard!');
      }
    } catch (error) {
      toast.error(`Failed to generate UUIDs: ${(error as Error).message}`);
    }
  }, [options, autoCopy]);
  
  // Copy a single UUID
  const copyUUID = useCallback((uuid: string) => {
    navigator.clipboard.writeText(uuid);
    toast.success('UUID copied to clipboard!');
  }, []);
  
  // Copy all UUIDs
  const copyAll = useCallback(() => {
    if (uuids.length === 0) return;
    
    let textToCopy = '';
    
    switch (options.outputFormat) {
      case 'json':
        textToCopy = JSON.stringify(uuids, null, 2);
        break;
      case 'csv':
        textToCopy = uuids.join(',');
        break;
      case 'sql':
        textToCopy = uuids.map(uuid => `INSERT INTO table (uuid) VALUES ('${uuid}');`).join('\n');
        break;
      case 'javascript':
        textToCopy = `[\n  ${uuids.map(uuid => `'${uuid}'`).join(',\n  ')}\n]`;
        break;
      default:
        textToCopy = uuids.join('\n');
    }
    
    navigator.clipboard.writeText(textToCopy);
    toast.success('All UUIDs copied to clipboard!');
  }, [uuids, options.outputFormat]);
  
  // Save to history
  const saveToHistory = useCallback(() => {
    if (uuids.length === 0) return;
    
    const name = prompt('Enter a name for this UUID set:');
    if (!name) return;
    
    const newHistoryItem: UUIDHistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      options: { ...options },
      uuids: [...uuids],
      name
    };
    
    setHistory(prev => [newHistoryItem, ...prev]);
    toast.success('Saved to history!');
  }, [uuids, options]);
  
  // Load from history
  const loadFromHistory = useCallback((item: UUIDHistoryItem) => {
    setOptions(item.options);
    setUUIDs(item.uuids);
    setShowHistory(false);
    toast.success('Loaded from history!');
  }, []);
  
  // Delete from history
  const deleteFromHistory = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
    toast.success('Removed from history!');
  }, []);
  
  // Export UUIDs
  const exportUUIDs = useCallback(() => {
    if (uuids.length === 0) return;
    
    let content = '';
    let filename = '';
    let mimeType = 'text/plain';
    
    switch (options.outputFormat) {
      case 'json':
        content = JSON.stringify(uuids, null, 2);
        filename = 'uuids.json';
        mimeType = 'application/json';
        break;
      case 'csv':
        content = uuids.join(',');
        filename = 'uuids.csv';
        mimeType = 'text/csv';
        break;
      case 'sql':
        content = uuids.map(uuid => `INSERT INTO table (uuid) VALUES ('${uuid}');`).join('\n');
        filename = 'uuids.sql';
        break;
      case 'javascript':
        content = `[\n  ${uuids.map(uuid => `'${uuid}'`).join(',\n  ')}\n]`;
        filename = 'uuids.js';
        mimeType = 'application/javascript';
        break;
      default:
        content = uuids.join('\n');
        filename = 'uuids.txt';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('UUIDs exported!');
  }, [uuids, options.outputFormat]);
  
  // Import UUIDs
  const importUUIDs = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        // Try to parse as JSON first
        try {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            setUUIDs(parsed);
            toast.success('UUIDs imported from JSON!');
            return;
          }
        } catch {
          // Not JSON, continue
        }
        
        // Otherwise, split by newlines or commas
        const imported = content.split(/[\n,]/)
          .map(line => line.trim())
          .filter(line => line.length > 0);
        
        if (imported.length > 0) {
          setUUIDs(imported);
          toast.success(`Imported ${imported.length} UUIDs!`);
        } else {
          toast.error('No valid UUIDs found in file!');
        }
      } catch (error) {
        toast.error(`Failed to import: ${(error as Error).message}`);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);
  
  // Validate UUIDs
  const validateUUIDs = useCallback(() => {
    if (!validationInput.trim()) {
      toast.error('Please enter UUIDs to validate');
      return;
    }
    
    const uuidsToValidate = validationInput
      .split(/[\n,]/)
      .map(uuid => uuid.trim())
      .filter(uuid => uuid.length > 0);
    
    const results: ValidationResult[] = uuidsToValidate.map(uuid => {
      // Simple validation regex
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const valid = uuidRegex.test(uuid);
      
      if (!valid) {
        return { uuid, valid: false, error: 'Invalid UUID format' };
      }
      
      // Extract version
      const version = uuid.charAt(14);
      
      // Extract variant
      const variantChar = uuid.charAt(19).toLowerCase();
      let variant = '';
      if (variantChar === '8' || variantChar === '9' || variantChar === 'a' || variantChar === 'b') {
        variant = 'RFC 4122';
      } else if (variantChar === 'c' || variantChar === 'd' || variantChar === 'e' || variantChar === 'f') {
        variant = 'Reserved Microsoft';
      } else {
        variant = 'Reserved Future';
      }
      
      return { uuid, valid: true, version, variant };
    });
    
    setValidationResults(results);
  }, [validationInput]);
  
  // Format date
  const formatDate = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  }, []);
  
  return (
    <div className="flex flex-col p-2 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{tool.name}</h1>
          <p className="text-muted-foreground">{tool.description}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="default"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
          <LearnButton
            tool={{
              name: tool.name,
              description: tool.description,
              slug: tool.slug,
              category: tool.category,
              tags: tool.tags,
            }}
            variant="secondary"
            mdFilePath="content/learn/uuid-generator.md"
          />
        </div>
      </div>
      
      {/* History Sidebar */}
      {showHistory && (
        <Card className="absolute right-4 top-24 z-10 w-80 max-h-[70vh] overflow-hidden shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <History className="w-4 h-4" />
                UUID History
              </span>
              <Button variant="ghost" size="sm" onClick={() => setShowHistory(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto max-h-[60vh]">
            {history.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No history yet
              </div>
            ) : (
              <div className="divide-y">
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => loadFromHistory(item)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(item.timestamp)}
                        </div>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {item.options.version.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.uuids.length} UUIDs
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => deleteFromHistory(item.id, e)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-xs font-mono truncate mt-1 text-muted-foreground">
                      {item.uuids[0]?.substring(0, 20)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Main Content */}
      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="validate">Validate</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        {/* Generate Tab */}
        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Options Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  Generator Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Version Selector */}
                <div>
                  <Label className="text-base font-medium">UUID Version</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {uuidVersions.map((version) => (
                      <div key={version.value} className="flex items-start gap-2">
                        <Checkbox
                          id={version.value}
                          checked={options.version === version.value}
                          onCheckedChange={() => setOptions(prev => ({ ...prev, version: version.value }))}
                        />
                        <div>
                          <Label htmlFor={version.value} className="font-medium">
                            {version.label}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {version.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Version-specific options */}
                {(options.version === 'v3' || options.version === 'v5') && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Namespace</Label>
                      <Select 
                        value={options.namespace} 
                        onValueChange={(value) => setOptions(prev => ({ ...prev, namespace: value }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a namespace" />
                        </SelectTrigger>
                        <SelectContent>
                          {predefinedNamespaces.map((ns) => (
                            <SelectItem key={ns.value} value={ns.uuid}>
                              {ns.label}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom">Custom Namespace</SelectItem>
                        </SelectContent>
                      </Select>
                      {options.namespace === 'custom' && (
                        <Input
                          placeholder="Enter custom namespace UUID"
                          value={(options as any).customNamespace || ''}
                          onChange={(e) => setOptions(prev => ({ ...prev, customNamespace: e.target.value }))}
                          className="mt-2"
                        />
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-base font-medium">Name</Label>
                      <Input
                        placeholder="Enter name for UUID generation"
                        value={options.name}
                        onChange={(e) => setOptions(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
                
                {/* Count Slider */}
                <div>
                  <div className="flex justify-between">
                    <Label className="text-base font-medium">Count: {options.count}</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setOptions(prev => ({ ...prev, count: 1 }))}
                    >
                      Reset
                    </Button>
                  </div>
                  <Slider
                    min={1}
                    max={100}
                    step={1}
                    value={[options.count]}
                    onValueChange={([val]) => setOptions(prev => ({ ...prev, count: val }))}
                    className="mt-2"
                  />
                </div>
                
                {/* Output Format */}
                <div>
                  <Label className="text-base font-medium">Output Format</Label>
                  <Select 
                    value={options.outputFormat} 
                    onValueChange={(value) => setOptions(prev => ({ ...prev, outputFormat: value as OutputFormat['value'] }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {outputFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Other Options */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="uppercase"
                      checked={options.uppercase}
                      onCheckedChange={(checked) =>
                        setOptions((prev) => ({ ...prev, uppercase: Boolean(checked) }))
                      }
                    />
                    <Label htmlFor="uppercase">Uppercase</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="removeHyphens"
                      checked={options.removeHyphens}
                      onCheckedChange={(checked) =>
                        setOptions((prev) => ({ ...prev, removeHyphens: Boolean(checked) }))
                      }
                    />
                    <Label htmlFor="removeHyphens">Remove Hyphens</Label>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button onClick={generate} className="flex-1">
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                  <Button variant="outline" onClick={saveToHistory}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Output Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Generated UUIDs
                  </span>
                  <div className="flex gap-2">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={importUUIDs} 
                      className="hidden" 
                      accept=".txt,.json,.csv,.js"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={exportUUIDs}
                      disabled={uuids.length === 0}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={copyAll}
                      disabled={uuids.length === 0}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 font-mono text-sm min-h-[300px] max-h-[400px] overflow-y-auto">
                  {uuids.length > 0 ? (
                    <div className="space-y-2">
                      {uuids.map((uuid, index) => (
                        <div key={index} className="flex items-center justify-between group">
                          <div className="truncate">{uuid}</div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyUUID(uuid)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Generate UUIDs to see them here
                    </div>
                  )}
                </div>
                
                {uuids.length > 0 && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    Generated {uuids.length} UUID{uuids.length !== 1 ? 's' : ''} using {options.version.toUpperCase()}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Validate Tab */}
        <TabsContent value="validate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                UUID Validator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Enter UUIDs to validate (one per line)</Label>
                <Textarea
                  value={validationInput}
                  onChange={(e) => setValidationInput(e.target.value)}
                  placeholder="550e8400-e29b-41d4-a716-446655440000&#10;6ba7b810-9dad-11d1-80b4-00c04fd430c8"
                  className="mt-2 min-h-[120px]"
                />
              </div>
              
              <Button onClick={validateUUIDs} className="w-full">
                Validate UUIDs
              </Button>
              
              {validationResults.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Validation Results</h3>
                    <Badge variant={validationResults.every(r => r.valid) ? "default" : "destructive"}>
                      {validationResults.filter(r => r.valid).length}/{validationResults.length} valid
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {validationResults.map((result, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${result.valid ? 'bg-success-muted border-success' : 'bg-error-muted border-error'}`}>
                        <div className="flex justify-between items-start">
                          <div className="font-mono text-sm truncate max-w-[70%]">{result.uuid}</div>
                          <Badge variant={result.valid ? "default" : "destructive"}>
                            {result.valid ? 'Valid' : 'Invalid'}
                          </Badge>
                        </div>
                        
                        {result.valid ? (
                          <div className="mt-2 text-sm grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-muted-foreground">Version:</span> {result.version}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Variant:</span> {result.variant}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 text-sm text-error-foreground">
                            {result.error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Application Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Auto-copy single UUIDs</Label>
                  <p className="text-sm text-muted-foreground">Automatically copy when generating a single UUID</p>
                </div>
                <Checkbox
                  checked={autoCopy}
                  onCheckedChange={(checked) => setAutoCopy(Boolean(checked))}
                />
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-base font-medium mb-3">About UUID Versions</h3>
                <div className="space-y-3 text-sm">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Version 1:</strong> Generated from a timestamp and MAC address. Not recommended for privacy-sensitive applications.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Version 3 & 5:</strong> Generated from a namespace and name using MD5 (v3) or SHA-1 (v5) hashing. Deterministic - same inputs produce same UUID.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Version 4:</strong> Generated from random numbers. Most common and recommended for general use.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}