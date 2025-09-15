'use client';
import React, { useState, useRef, useCallback } from 'react';
import curlBuilder,{ buildCurlCommand, CurlBuilderOptions, CurlBuilderResult } from '@/lib/tools/tool/curl-builder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Copy, Plus, Trash2, Upload, Download, Save, FolderOpen, 
  Settings, Zap, Code, Eye, EyeOff, History, Star, 
  Globe, Lock, Unlock, Clock, FileText, 
  RefreshCw, PlayCircle, Bookmark, BookmarkCheck,
  ChevronDown, ChevronRight, AlertCircle, CheckCircle2,
  Lightbulb, Terminal, FileCode, Import,
} from 'lucide-react';
import { LearnButton } from '@/features/dashboard/tools/components/learn-button';
const HTTP_METHODS = [
  { value: 'GET', color: 'bg-green-500' },
  { value: 'POST', color: 'bg-blue-500' },
  { value: 'PUT', color: 'bg-yellow-500' },
  { value: 'PATCH', color: 'bg-orange-500' },
  { value: 'DELETE', color: 'bg-red-500' },
  { value: 'HEAD', color: 'bg-purple-500' },
  { value: 'OPTIONS', color: 'bg-gray-500' },
  { value: 'CONNECT', color: 'bg-indigo-500' },
  { value: 'TRACE', color: 'bg-pink-500' }
];
const tool = curlBuilder
const COMMON_HEADERS = [
  { key: 'Authorization', value: 'Bearer your-token', description: 'Authentication token' },
  { key: 'Content-Type', value: 'application/json', description: 'Request body format' },
  { key: 'Accept', value: 'application/json', description: 'Expected response format' },
  { key: 'User-Agent', value: 'DevHub/1.0', description: 'Client identification' },
  { key: 'X-API-Key', value: '', description: 'API key for authentication' },
  { key: 'Cache-Control', value: 'no-cache', description: 'Caching directives' },
  { key: 'Origin', value: 'https://devhub.app', description: 'Request origin' },
  { key: 'Referer', value: '', description: 'Referring page URL' }
];

const REQUEST_PRESETS = {
  'JSON API': {
    headers: [
      { key: 'Content-Type', value: 'application/json' },
      { key: 'Accept', value: 'application/json' }
    ],
    bodyType: 'json' as const,
    body: '{\n  "example": "data"\n}'
  },
  'GraphQL': {
    headers: [
      { key: 'Content-Type', value: 'application/json' }
    ],
    bodyType: 'json' as const,
    body: '{\n  "query": "{ user { id name } }"\n}'
  },
  'Form Data': {
    headers: [
      { key: 'Content-Type', value: 'application/x-www-form-urlencoded' }
    ],
    bodyType: 'form' as const,
    body: 'key1=value1&key2=value2'
  },
  'File Upload': {
    headers: [
      { key: 'Content-Type', value: 'multipart/form-data' }
    ],
    bodyType: 'form' as const,
    body: '--boundary\nContent-Disposition: form-data; name="file"; filename="example.txt"\n\nfile content here'
  }
};

const DEFAULT_OPTIONS: CurlBuilderOptions = {
  method: 'GET',
  url: '',
  query: [],
  headers: [],
  bodyType: 'none',
  body: '',
  timeout: 30,
  followRedirects: true,
  maxRedirects: 5,
  verifySSL: true,
  userAgent: '',
  httpVersion: '1.1',
  proxy: '',
  compress: false,
};

interface SavedRequest {
  id: string;
  name: string;
  options: CurlBuilderOptions;
  createdAt: Date;
  starred: boolean;
}

export default function CurlBuilderPage() {
  const [options, setOptions] = useState<CurlBuilderOptions>(DEFAULT_OPTIONS);
  const [curl, setCurl] = useState<string>('');
  const [activeTab, setActiveTab] = useState('request');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [savedRequests, setSavedRequests] = useState<SavedRequest[]>([]);
  const [currentRequestName, setCurrentRequestName] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    query: true,
    headers: true,
    body: false,
    auth: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Build cURL command on options change
  React.useEffect(() => {
    try {
      const result: CurlBuilderResult = buildCurlCommand(options);
      setCurl(result.command);
      setError(result.error || null);
      setIsValid(!result.error && options.url.length > 0);
    } catch (e: any) {
      setError(e.message);
      setCurl('');
      setIsValid(false);
    }
  }, [options]);

  // URL and Method handlers
  const handleUrlChange = useCallback((url: string) => {
    setOptions(o => ({ ...o, url }));
  }, []);

  const handleMethodChange = useCallback((method: string) => {
    setOptions(o => ({ ...o, method }));
  }, []);

  // Query Parameters
  const handleQueryChange = useCallback((idx: number, key: string, value: string) => {
    setOptions(o => {
      const query = [...o.query];
      query[idx] = { key, value };
      return { ...o, query };
    });
  }, []);

  const addQueryParam = useCallback(() => {
    setOptions(o => ({ ...o, query: [...o.query, { key: '', value: '' }] }));
  }, []);

  const removeQueryParam = useCallback((idx: number) => {
    setOptions(o => ({ ...o, query: o.query.filter((_, i) => i !== idx) }));
  }, []);

  // Headers
  const handleHeaderChange = useCallback((idx: number, key: string, value: string) => {
    setOptions(o => {
      const headers = [...o.headers];
      headers[idx] = { key, value };
      return { ...o, headers };
    });
  }, []);

  const addHeader = useCallback((preset?: { key: string; value: string }) => {
    const newHeader = preset || { key: '', value: '' };
    setOptions(o => ({ ...o, headers: [...o.headers, newHeader] }));
  }, []);

  const removeHeader = useCallback((idx: number) => {
    setOptions(o => ({ ...o, headers: o.headers.filter((_, i) => i !== idx) }));
  }, []);

  // Body
  const handleBodyTypeChange = useCallback((bodyType: CurlBuilderOptions['bodyType']) => {
    setOptions(o => ({ ...o, bodyType }));
  }, []);

  const handleBodyChange = useCallback((body: string) => {
    setOptions(o => ({ ...o, body }));
  }, []);

  // Advanced options
  const handleOptionChange = useCallback((key: keyof CurlBuilderOptions, value: any) => {
    setOptions(o => ({ ...o, [key]: value }));
  }, []);

  // Presets
  const applyPreset = useCallback((presetName: keyof typeof REQUEST_PRESETS) => {
    const preset = REQUEST_PRESETS[presetName];
    setOptions(o => ({
      ...o,
      headers: [...o.headers, ...preset.headers],
      bodyType: preset.bodyType,
      body: preset.body
    }));
    toast.success(`Applied ${presetName} preset`);
  }, []);

  // Save/Load functionality
  const saveRequest = useCallback(() => {
    if (!currentRequestName.trim()) {
      toast.error('Please enter a name for the request');
      return;
    }
    
    const newRequest: SavedRequest = {
      id: Date.now().toString(),
      name: currentRequestName,
      options: { ...options },
      createdAt: new Date(),
      starred: false
    };
    
    setSavedRequests(prev => [...prev, newRequest]);
    setCurrentRequestName('');
    toast.success('Request saved successfully');
  }, [currentRequestName, options]);

  const loadRequest = useCallback((request: SavedRequest) => {
    setOptions(request.options);
    toast.success(`Loaded request: ${request.name}`);
  }, []);

  const deleteRequest = useCallback((id: string) => {
    setSavedRequests(prev => prev.filter(r => r.id !== id));
    toast.success('Request deleted');
  }, []);

  const toggleStar = useCallback((id: string) => {
    setSavedRequests(prev => prev.map(r => r.id === id ? { ...r, starred: !r.starred } : r));
  }, []);

  // Import/Export
  const exportRequest = useCallback(() => {
    const data = JSON.stringify(options, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'curl-request.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Request exported');
  }, [options]);

  const importRequest = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setOptions(imported);
        toast.success('Request imported successfully');
      } catch (error) {
        toast.error('Invalid request file');
      }
    };
    reader.readAsText(file);
  }, []);

  // Copy functionality
  const handleCopy = useCallback(() => {
    if (curl) {
      navigator.clipboard.writeText(curl);
      toast.success('cURL command copied!');
    }
  }, [curl]);

  // Reset
  const handleReset = useCallback(() => {
    setOptions(DEFAULT_OPTIONS);
    setCurrentRequestName('');
    toast.success('Request reset');
  }, []);

  // Format body
  const formatBody = useCallback(() => {
    if (options.bodyType === 'json') {
      try {
        const formatted = JSON.stringify(JSON.parse(options.body), null, 2);
        handleBodyChange(formatted);
        toast.success('JSON formatted');
      } catch {
        toast.error('Invalid JSON');
      }
    }
  }, [options.body, options.bodyType, handleBodyChange]);

  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const selectedMethod = HTTP_METHODS.find(m => m.value === options.method) || HTTP_METHODS[0];

  return (
    <TooltipProvider>
      <div className="container mx-auto p-2 md:p-6 space-y-6 max-w-7xl">
        {/* Enhanced Header */}
        <div className="flex flex-col flex-wrap gap-4">
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
                  mdFilePath="content/learn/curl-builder.md"
              />
            </div>
          <div className="space-y-2 flex flex-wrap flex-col gap-4">
            
            {/* Status Indicators */}
            <div className="flex items-center gap-2">
              {isValid ? (
                <Badge variant="default" className="bg-success text-success-foreground">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Valid Request
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Invalid Request
                </Badge>
              )}
              {options.verifySSL && (
                <Badge variant="outline">
                  <Lock className="w-3 h-3 mr-1" />
                  SSL Verified
                </Badge>
              )}
              {options.compress && (
                <Badge variant="outline">
                  {/* <Compress className="w-3 h-3 mr-1" /> */}
                  Compressed
                </Badge>
              )}
            </div>
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Import className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" onClick={exportRequest}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleCopy} disabled={!curl}>
                <Copy className="w-4 h-4 mr-2" />
                Copy cURL
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Request URL and Method */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Request Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap flex-col sm:flex-row items-center gap-2">
                  <Select value={options.method} onValueChange={handleMethodChange}>
                    <SelectTrigger className="w-32">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${selectedMethod.color}`} />
                          {options.method}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {HTTP_METHODS.map(method => (
                        <SelectItem key={method.value} value={method.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${method.color}`} />
                            {method.value}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    value={options.url}
                    onChange={e => handleUrlChange(e.target.value)}
                    placeholder="https://api.example.com/v1/resource"
                    className="flex-1 font-mono"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Quick presets:</span>
                  {Object.keys(REQUEST_PRESETS).map(preset => (
                    <Button
                      key={preset}
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(preset as keyof typeof REQUEST_PRESETS)}
                    >
                      <Lightbulb className="w-3 h-3 mr-1" />
                      {preset}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tabbed Interface */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full flex overflow-hidden">
                <TabsTrigger value="request">Request</TabsTrigger>
                <TabsTrigger value="auth">Auth</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                <TabsTrigger value="output">Output</TabsTrigger>
                <TabsTrigger value="history">Saved</TabsTrigger>
              </TabsList>

              <TabsContent value="request" className="space-y-4">
                {/* Query Parameters */}
                <Card>
                  <CardHeader 
                    className="pb-2 cursor-pointer"
                    onClick={() => toggleSection('query')}
                  >
                    <CardTitle className="text-base flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {expandedSections.query ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        Query Parameters
                        <Badge variant="outline">{options.query.length}</Badge>
                      </div>
                      <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); addQueryParam(); }}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  {expandedSections.query && (
                    <CardContent>
                      {options.query.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          No query parameters. Click + to add one.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {options.query.map((q, idx) => (
                            <div key={idx} className="flex gap-2">
                              <Input
                                value={q.key}
                                onChange={e => handleQueryChange(idx, e.target.value, q.value)}
                                placeholder="parameter"
                                className="font-mono"
                              />
                              <Input
                                value={q.value}
                                onChange={e => handleQueryChange(idx, q.key, e.target.value)}
                                placeholder="value"
                                className="font-mono"
                              />
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => removeQueryParam(idx)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>

                {/* Headers */}
                <Card>
                  <CardHeader 
                    className="pb-2 cursor-pointer"
                    onClick={() => toggleSection('headers')}
                  >
                    <CardTitle className="text-base flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {expandedSections.headers ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        Headers
                        <Badge variant="outline">{options.headers.length}</Badge>
                      </div>
                      <div className="flex gap-1">
                        <Select onValueChange={(value) => {
                          const header = COMMON_HEADERS.find(h => h.key === value);
                          if (header) addHeader({ key: header.key, value: header.value });
                        }}>
                          <SelectTrigger className="w-auto h-8">
                            <Plus className="w-4 h-4" />
                          </SelectTrigger>
                          <SelectContent>
                            {COMMON_HEADERS.map(header => (
                              <SelectItem key={header.key} value={header.key}>
                                <div>
                                  <div className="font-medium">{header.key}</div>
                                  <div className="text-xs text-muted-foreground">{header.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button size="sm" variant="ghost" onClick={() => addHeader()}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  {expandedSections.headers && (
                    <CardContent>
                      {options.headers.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          No custom headers. Click + to add one or select from common headers.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {options.headers.map((h, idx) => (
                            <div key={idx} className="flex gap-2">
                              <Input
                                value={h.key}
                                onChange={e => handleHeaderChange(idx, e.target.value, h.value)}
                                placeholder="Header-Name"
                                className="font-mono w-48"
                              />
                              <Input
                                value={h.value}
                                onChange={e => handleHeaderChange(idx, h.key, e.target.value)}
                                placeholder="header value"
                                className="font-mono"
                              />
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => removeHeader(idx)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>

                {/* Request Body */}
                <Card>
                  <CardHeader 
                    className="pb-2 cursor-pointer"
                    onClick={() => toggleSection('body')}
                  >
                    <CardTitle className="text-base flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {expandedSections.body ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        Request Body
                        <Badge variant="outline">{options.bodyType}</Badge>
                      </div>
                      {options.bodyType === 'json' && (
                        <Button size="sm" variant="ghost" onClick={formatBody}>
                          <Code className="w-4 h-4 mr-1" />
                          Format
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  {expandedSections.body && (
                    <CardContent className="space-y-4">
                      <Select value={options.bodyType} onValueChange={handleBodyTypeChange}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="form">Form Data</SelectItem>
                          <SelectItem value="raw">Raw Text</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {options.bodyType !== 'none' && (
                        <Textarea
                          value={options.body}
                          onChange={e => handleBodyChange(e.target.value)}
                          placeholder={
                            options.bodyType === 'json' 
                              ? '{\n  "key": "value",\n  "array": [1, 2, 3]\n}'
                              : options.bodyType === 'form'
                              ? 'key1=value1&key2=value2'
                              : 'Raw text content...'
                          }
                          className="font-mono text-sm min-h-[120px] resize-y"
                          spellCheck={false}
                        />
                      )}
                    </CardContent>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="auth">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Authentication
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Authorization Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select auth type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bearer">Bearer Token</SelectItem>
                            <SelectItem value="basic">Basic Auth</SelectItem>
                            <SelectItem value="apikey">API Key</SelectItem>
                            <SelectItem value="oauth">OAuth 2.0</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Token/Key</Label>
                        <Input 
                          type="password" 
                          placeholder="Enter your token or key"
                          className="font-mono"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Advanced Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Timeout */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Timeout (seconds)
                        </Label>
                        <Input
                          type="number"
                          min={1}
                          max={300}
                          value={options.timeout}
                          onChange={e => handleOptionChange('timeout', Number(e.target.value))}
                        />
                      </div>

                      {/* Max Redirects */}
                      <div className="space-y-2">
                        <Label>Max Redirects</Label>
                        <Input
                          type="number"
                          min={0}
                          max={20}
                          value={options.maxRedirects}
                          onChange={e => handleOptionChange('maxRedirects', Number(e.target.value))}
                          disabled={!options.followRedirects}
                        />
                      </div>

                      {/* HTTP Version */}
                      <div className="space-y-2">
                        <Label>HTTP Version</Label>
                        <Select 
                          value={options.httpVersion} 
                          onValueChange={value => handleOptionChange('httpVersion', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1.1">HTTP/1.1</SelectItem>
                            <SelectItem value="2">HTTP/2</SelectItem>
                            <SelectItem value="3">HTTP/3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* User Agent */}
                      <div className="space-y-2">
                        <Label>User Agent</Label>
                        <Input
                          value={options.userAgent}
                          onChange={e => handleOptionChange('userAgent', e.target.value)}
                          placeholder="DevHub cURL Builder/1.0"
                        />
                      </div>

                      {/* Proxy */}
                      <div className="space-y-2">
                        <Label>Proxy Server</Label>
                        <Input
                          value={options.proxy}
                          onChange={e => handleOptionChange('proxy', e.target.value)}
                          placeholder="http://proxy.example.com:8080"
                        />
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Checkboxes */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={options.followRedirects}
                          onChange={e => handleOptionChange('followRedirects', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Follow Redirects</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={options.verifySSL}
                          onChange={e => handleOptionChange('verifySSL', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Verify SSL</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={options.compress}
                          onChange={e => handleOptionChange('compress', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Enable Compression</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showPreview}
                          onChange={e => setShowPreview(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Live Preview</span>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="output">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex flex-wrap gap-4 items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-5 h-5" />
                        Generated cURL Command
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowPreview(!showPreview)}
                        >
                          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          {showPreview ? 'Hide' : 'Show'} Preview
                        </Button>
                        <Button size="sm" onClick={handleCopy} disabled={!curl}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {showPreview && (
                      <div className="space-y-4">
                        <Textarea
                          value={curl}
                          readOnly
                          className="font-mono text-xs bg-muted min-h-[120px] resize-y"
                          spellCheck={false}
                        />
                        
                        {error && (
                          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <AlertCircle className="w-4 h-4 text-destructive" />
                            <span className="text-sm text-destructive">{error}</span>
                          </div>
                        )}

                        {curl && !error && (
                          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-700">cURL command generated successfully</span>
                          </div>
                        )}

                        {/* Command breakdown */}
                        {curl && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Command Breakdown:</h4>
                            <div className="text-xs space-y-1 text-muted-foreground">
                              <div>• Method: <code className="bg-muted px-1 rounded">{options.method}</code></div>
                              <div>• URL: <code className="bg-muted px-1 rounded">{options.url || 'Not set'}</code></div>
                              <div>• Headers: <code className="bg-muted px-1 rounded">{options.headers.length} custom</code></div>
                              <div>• Body: <code className="bg-muted px-1 rounded">{options.bodyType}</code></div>
                              <div>• Timeout: <code className="bg-muted px-1 rounded">{options.timeout}s</code></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between flex-wrap">
                      <div className="flex items-center gap-2">
                        <History className="w-5 h-5" />
                        Saved Requests
                      </div>
                      <div className="flex gap-2 items-center mt-2">
                        <Input
                          value={currentRequestName}
                          onChange={e => setCurrentRequestName(e.target.value)}
                          placeholder="Request name..."
                          className="min-w-32 max-w-64"
                        />
                        <Button onClick={saveRequest} disabled={!currentRequestName.trim()}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {savedRequests.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No saved requests yet.</p>
                        <p className="text-sm">Save your current request to reuse it later.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {savedRequests
                          .sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0))
                          .map(request => (
                            <div 
                              key={request.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => toggleStar(request.id)}
                                  className="w-6 h-6"
                                >
                                  {request.starred ? 
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> : 
                                    <Star className="w-4 h-4" />
                                  }
                                </Button>
                                <div>
                                  <div className="font-medium">{request.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {request.options.method} • {request.createdAt.toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => loadRequest(request)}
                                >
                                  <FolderOpen className="w-4 h-4 mr-1" />
                                  Load
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteRequest(request.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-4">
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setOptions(prev => ({ ...prev, method: 'GET', bodyType: 'none' }));
                    toast.success('Set up for GET request');
                  }}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Quick GET
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setOptions(prev => ({ 
                      ...prev, 
                      method: 'POST', 
                      bodyType: 'json',
                      headers: [
                        ...prev.headers.filter(h => h.key !== 'Content-Type'),
                        { key: 'Content-Type', value: 'application/json' }
                      ]
                    }));
                    toast.success('Set up for JSON POST');
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Quick POST
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('auth')}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Add Auth
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('advanced')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Advanced
                </Button>
              </CardContent>
            </Card>

            {/* Request Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Request Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Method:</span>
                  <Badge variant="outline" className="text-xs">
                    <div className={`w-2 h-2 rounded-full ${selectedMethod.color} mr-1`} />
                    {options.method}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Query Params:</span>
                  <span>{options.query.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Headers:</span>
                  <span>{options.headers.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Body Type:</span>
                  <Badge variant="outline" className="text-xs">{options.bodyType}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Timeout:</span>
                  <span>{options.timeout}s</span>
                </div>
                
                <Separator />
                
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    {options.verifySSL ? 
                      <CheckCircle2 className="w-3 h-3 text-green-500" /> : 
                      <AlertCircle className="w-3 h-3 text-yellow-500" />
                    }
                    <span>SSL Verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {options.followRedirects ? 
                      <CheckCircle2 className="w-3 h-3 text-green-500" /> : 
                      <AlertCircle className="w-3 h-3 text-gray-400" />
                    }
                    <span>Follow Redirects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {options.compress ? 
                      <CheckCircle2 className="w-3 h-3 text-green-500" /> : 
                      <AlertCircle className="w-3 h-3 text-gray-400" />
                    }
                    <span>Compression</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Common Headers Quick Add */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Common Headers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {COMMON_HEADERS.slice(0, 4).map(header => (
                    <Button
                      key={header.key}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs h-auto py-2"
                      onClick={() => addHeader({ key: header.key, value: header.value })}
                    >
                      <Plus className="w-3 h-3 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">{header.key}</div>
                        <div className="text-muted-foreground text-xs truncate">
                          {header.description}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hidden file input for import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={importRequest}
          className="hidden"
        />
      </div>
    </TooltipProvider>
  );
}
