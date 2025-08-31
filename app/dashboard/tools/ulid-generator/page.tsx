'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import ulidGenerator, { ULIDOptions } from '@/lib/tools/tool/ulid-generator';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { 
  Copy, 
  RefreshCcw, 
  Clock, 
  Hash, 
  Calendar as CalendarIcon,
  Download, 
  Upload, 
  History, 
  Settings, 
  CheckCircle, 
  X, 
  FileText,
  Trash2,
  Save,
  Info,
  AlertTriangle,
  Bookmark
} from 'lucide-react';
import { LearnButton } from '@/features/dashboard/tools/components/learn-button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tooltip , TooltipContent , TooltipTrigger } from '@/components/ui/tooltip';

const tool = ulidGenerator;

// Types
interface ULIDHistoryItem {
  id: string;
  timestamp: number;
  options: ULIDOptions;
  ulids: string[];
  name?: string;
}

interface ValidationResult {
  ulid: string;
  valid: boolean;
  timestamp?: Date;
  error?: string;
}

interface OutputFormat {
  value: 'plain' | 'json' | 'csv' | 'sql' | 'javascript';
  label: string;
}

// Output formats
const outputFormats: OutputFormat[] = [
  { value: 'plain', label: 'Plain Text' },
  { value: 'json', label: 'JSON Array' },
  { value: 'csv', label: 'CSV' },
  { value: 'sql', label: 'SQL Insert' },
  { value: 'javascript', label: 'JavaScript Array' }
];

// ULID information
const ulidInfo = {
  structure: 'ULID consists of 48 bits for timestamp and 80 bits for randomness',
  encoding: 'Crockford\'s Base32 encoding is used (0-9, A-Z except I, L, O, U)',
  sortable: 'ULIDs are lexicographically sortable by time',
  format: '26 characters total: 10 for time (48 bits) + 16 for randomness (80 bits)'
};

export default function ULIDGeneratorPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Generator state
  const [options, setOptions] = useState<ULIDOptions>({
    count: 5,
    uppercase: false,
    time: null,
    entropy: null,
    includeTimestamp: false,
    sortDirection: 'asc',
    outputFormat: 'plain'
  });
  
  const [ulids, setULIDs] = useState<string[]>([]);
  const [customEntropy, setCustomEntropy] = useState<string>('');
  const [history, setHistory] = useState<ULIDHistoryItem[]>([]);
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
    const savedHistory = localStorage.getItem('ulidHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory) as ULIDHistoryItem[]);
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);
  
  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('ulidHistory', JSON.stringify(history));
  }, [history]);
  
  // Generate ULIDs
  const generate = useCallback(() => {
    try {
      const result = tool.generate(options);
      setULIDs(result as string[]);
      
      if (autoCopy && result.length === 1) {
        navigator.clipboard.writeText(result[0] as string);
        toast.success('ULID copied to clipboard!');
      }
    } catch (error) {
      toast.error(`Failed to generate ULIDs: ${(error as Error).message}`);
    }
  }, [options, autoCopy]);
  
  // Copy a single ULID
  const copyULID = useCallback((ulid: string) => {
    navigator.clipboard.writeText(ulid);
    toast.success('ULID copied to clipboard!');
  }, []);
  
  // Copy all ULIDs
  const copyAll = useCallback(() => {
    if (ulids.length === 0) return;
    
    let textToCopy = '';
    
    switch (options.outputFormat) {
      case 'json':
        textToCopy = JSON.stringify(ulids, null, 2);
        break;
      case 'csv':
        textToCopy = ulids.join(',');
        break;
      case 'sql':
        textToCopy = ulids.map(ulid => `INSERT INTO table (ulid) VALUES ('${ulid}');`).join('\n');
        break;
      case 'javascript':
        textToCopy = `[\n  ${ulids.map(ulid => `'${ulid}'`).join(',\n  ')}\n]`;
        break;
      default:
        textToCopy = ulids.join('\n');
    }
    
    navigator.clipboard.writeText(textToCopy);
    toast.success('All ULIDs copied to clipboard!');
  }, [ulids, options.outputFormat]);
  
  // Save to history
  const saveToHistory = useCallback(() => {
    if (ulids.length === 0) return;
    
    const name = prompt('Enter a name for this ULID set:');
    if (!name) return;
    
    const newHistoryItem: ULIDHistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      options: { ...options },
      ulids: [...ulids],
      name
    };
    
    setHistory(prev => [newHistoryItem, ...prev]);
    toast.success('Saved to history!');
  }, [ulids, options]);
  
  // Load from history
  const loadFromHistory = useCallback((item: ULIDHistoryItem) => {
    setOptions(item.options);
    setULIDs(item.ulids);
    setShowHistory(false);
    toast.success('Loaded from history!');
  }, []);
  
  // Delete from history
  const deleteFromHistory = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
    toast.success('Removed from history!');
  }, []);
  
  // Export ULIDs
  const exportULIDs = useCallback(() => {
    if (ulids.length === 0) return;
    
    let content = '';
    let filename = '';
    let mimeType = 'text/plain';
    
    switch (options.outputFormat) {
      case 'json':
        content = JSON.stringify(ulids, null, 2);
        filename = 'ulids.json';
        mimeType = 'application/json';
        break;
      case 'csv':
        content = ulids.join(',');
        filename = 'ulids.csv';
        mimeType = 'text/csv';
        break;
      case 'sql':
        content = ulids.map(ulid => `INSERT INTO table (ulid) VALUES ('${ulid}');`).join('\n');
        filename = 'ulids.sql';
        break;
      case 'javascript':
        content = `[\n  ${ulids.map(ulid => `'${ulid}'`).join(',\n  ')}\n]`;
        filename = 'ulids.js';
        mimeType = 'application/javascript';
        break;
      default:
        content = ulids.join('\n');
        filename = 'ulids.txt';
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
    
    toast.success('ULIDs exported!');
  }, [ulids, options.outputFormat]);
  
  // Import ULIDs
  const importULIDs = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
            setULIDs(parsed);
            toast.success('ULIDs imported from JSON!');
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
          setULIDs(imported);
          toast.success(`Imported ${imported.length} ULIDs!`);
        } else {
          toast.error('No valid ULIDs found in file!');
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
  
  // Handle custom entropy
  const handleSetCustomEntropy = useCallback(() => {
    if (customEntropy) {
      // Validate entropy (should be 16 characters of Crockford's Base32)
      if (/^[0-9A-HJKMNP-TV-Z]{16}$/i.test(customEntropy)) {
        setOptions(prev => ({ ...prev, entropy: customEntropy }));
        toast.success('Custom entropy set!');
      } else {
        toast.error('Entropy must be 16 characters of Crockford\'s Base32');
      }
    } else {
      setOptions(prev => ({ ...prev, entropy: null }));
    }
  }, [customEntropy]);
  
  // Validate ULIDs
  const validateULIDs = useCallback(() => {
    if (!validationInput.trim()) {
      toast.error('Please enter ULIDs to validate');
      return;
    }
    
    const ulidsToValidate = validationInput
      .split(/[\n,]/)
      .map(ulid => ulid.trim())
      .filter(ulid => ulid.length > 0);
    
    const results: ValidationResult[] = ulidsToValidate.map(ulid => {
      // Simple validation regex for ULID (26 characters, Crockford's Base32)
      const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
      const valid = ulidRegex.test(ulid);
      
      if (!valid) {
        return { ulid, valid: false, error: 'Invalid ULID format' };
      }
      
      // Extract timestamp (first 10 characters = 48 bits)
      const timePart = ulid.substring(0, 10);
      
      // Convert Crockford's Base32 to a number
      const crockfordBase32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
      let timestamp = 0;
      
      for (let i = 0; i < timePart.length; i++) {
        const char = timePart.charAt(i).toUpperCase();
        const value = crockfordBase32.indexOf(char);
        if (value === -1) {
          return { ulid, valid: false, error: 'Invalid character in time part' };
        }
        timestamp = timestamp * 32 + value;
      }
      
      // Convert to milliseconds (Unix timestamp in milliseconds)
      const timestampMs = timestamp;
      
      return { 
        ulid, 
        valid: true, 
        timestamp: new Date(timestampMs) 
      };
    });
    
    setValidationResults(results);
  }, [validationInput]);
  
  // Format date
  const formatDate = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  }, []);
  
  // Extract timestamp from ULID
  const extractTimestamp = useCallback((ulid: string) => {
    if (ulid.length < 10) return null;
    
    // Convert Crockford's Base32 to a number
    const crockfordBase32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    const timePart = ulid.substring(0, 10);
    let timestamp = 0;
    
    for (let i = 0; i < timePart.length; i++) {
      const char = timePart.charAt(i).toUpperCase();
      const value = crockfordBase32.indexOf(char);
      if (value === -1) return null;
      timestamp = timestamp * 32 + value;
    }
    
    return new Date(timestamp);
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
            <Bookmark className="w-4 h-4 mr-2" />
            Saved
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
            mdFilePath="content/learn/ulid-generator.md"
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
                ULID Saves
              </span>
              <Button variant="ghost" size="sm" onClick={() => setShowHistory(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto max-h-[60vh]">
            {history.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No Saves yet
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
                          <Badge variant="outline" className="text-xs">
                            {item.ulids.length} ULIDs
                          </Badge>
                          {item.options.time && (
                            <Badge variant="secondary" className="text-xs">
                              Custom Time
                            </Badge>
                          )}
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
                      {item.ulids[0]?.substring(0, 16)}...
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
          <TabsTrigger value="info">Info</TabsTrigger>
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
                
                {/* Custom Time Input with Calendar */}
                <div>
                  <Label className="text-base font-medium flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    Custom Time (optional)
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !options.time && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {options.time ? format(options.time, "PPP HH:mm:ss") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={options.time}
                        onSelect={(date) => setOptions(prev => ({ ...prev, time: date }))}
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setOptions(prev => ({ ...prev, time: null }))}
                          className="w-full"
                        >
                          Clear Date
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  {options.time && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Using custom time: {options.time.toLocaleString()}
                    </p>
                  )}
                </div>
                
                {/* Sort Direction */}
                <div>
                  <Label className="text-base font-medium">Sort Direction</Label>
                  <Select 
                    value={options.sortDirection} 
                    onValueChange={(value) => setOptions(prev => ({ ...prev, sortDirection: value as 'asc' | 'desc' }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending (oldest first)</SelectItem>
                      <SelectItem value="desc">Descending (newest first)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Additional Options */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Additional Options</Label>
                  <div className="flex flex-col gap-3">
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
                        id="includeTimestamp"
                        checked={options.includeTimestamp}
                        onCheckedChange={(checked) =>
                          setOptions((prev) => ({ ...prev, includeTimestamp: Boolean(checked) }))
                        }
                      />
                      <Label htmlFor="includeTimestamp">Include Timestamp</Label>
                    </div>
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
                    Generated ULIDs
                  </span>
                  <div className="flex gap-2">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={importULIDs} 
                      className="hidden" 
                      accept=".txt,.json,.csv,.js"
                    />
                    <Tooltip>
                      <TooltipTrigger>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        import ULIDs
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={exportULIDs}
                          disabled={ulids.length === 0}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Download generated ULIDs in txt format
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={copyAll}
                          disabled={ulids.length === 0}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Copy Generated ULIDs
                      </TooltipContent>
                    </Tooltip>

                    

                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Custom Entropy Input */}
                <div>
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Custom Entropy (optional)
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={customEntropy}
                      onChange={(e) => setCustomEntropy(e.target.value)}
                      placeholder="16 chars of Crockford's Base32"
                      maxLength={16}
                    />
                    <Button onClick={handleSetCustomEntropy} variant="outline">
                      {options.entropy ? 'Clear' : 'Set'}
                    </Button>
                  </div>
                  {options.entropy && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Using custom entropy: {options.entropy}
                    </p>
                  )}
                </div>
                
                {/* ULID Output */}
                <div className="bg-muted rounded-lg p-4 font-mono text-sm min-h-[300px] max-h-[400px] overflow-y-auto">
                  {ulids.length > 0 ? (
                    <div className="space-y-2">
                      {ulids.map((ulid, index) => {
                        const timestamp = extractTimestamp(ulid);
                        return (
                          <div key={index} className="flex flex-col group">
                            <div className="flex items-center justify-between">
                              <div className="truncate">{ulid}</div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => copyULID(ulid)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                            {options.includeTimestamp && timestamp && (
                              <div className="text-xs text-muted-foreground">
                                {timestamp.toLocaleString()}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Generate ULIDs to see them here
                    </div>
                  )}
                </div>
                
                {ulids.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Generated {ulids.length} ULID{ulids.length !== 1 ? 's' : ''} 
                    {options.time && ' with custom time'}
                    {options.entropy && ' with custom entropy'}
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
                ULID Validator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Enter ULIDs to validate (one per line)</Label>
                <Textarea
                  value={validationInput}
                  onChange={(e) => setValidationInput(e.target.value)}
                  placeholder="01H4ZKJ4V4Z7J4Z7J4Z7J4Z7J4&#10;01H4ZKJ4V4Z7J4Z7J4Z7J4Z7J5"
                  className="mt-2 min-h-[120px]"
                />
              </div>
              
              <Button onClick={validateULIDs} className="w-full">
                Validate ULIDs
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
                          <div className="font-mono text-sm truncate max-w-[70%]">{result.ulid}</div>
                          <Badge variant={result.valid ? "default" : "destructive"}>
                            {result.valid ? 'Valid' : 'Invalid'}
                          </Badge>
                        </div>
                        
                        {result.valid ? (
                          <div className="mt-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Timestamp:</span> {result.timestamp?.toLocaleString()}
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
        
        {/* Info Tab */}
        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="w-5 h-5" />
                About ULIDs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-base font-medium mb-3">What is a ULID?</h3>
                <p className="text-sm text-muted-foreground">
                  ULID (Universally Unique Lexicographically Sortable Identifier) is a unique identifier that is 
                  lexicographically sortable and contains a timestamp component. It was designed to be a 
                  more sortable and user-friendly alternative to UUIDs.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-base font-medium mb-3">Structure</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      {ulidInfo.structure}
                    </AlertDescription>
                  </Alert>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      {ulidInfo.encoding}
                    </AlertDescription>
                  </Alert>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      {ulidInfo.sortable}
                    </AlertDescription>
                  </Alert>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      {ulidInfo.format}
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-base font-medium mb-3">Advantages over UUID</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                  <li>Lexicographically sortable by time</li>
                  <li>More compact (26 characters vs 36 for UUID)</li>
                  <li>URL-safe and case-insensitive encoding</li>
                  <li>Contains timestamp information in the ID itself</li>
                  <li>No need for separate timestamp fields in databases</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-base font-medium mb-3">Use Cases</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                  <li>Database primary keys that need to be sortable</li>
                  <li>Distributed systems where time-ordering is important</li>
                  <li>URL-friendly identifiers</li>
                  <li>Log entries that need to be sorted by time</li>
                  <li>Event sourcing and event streams</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}