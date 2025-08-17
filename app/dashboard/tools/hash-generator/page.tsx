'use client';
import React, { useState, useCallback, useRef } from 'react';
import { Copy, Download, Hash, FileText, Upload, Check, AlertCircle, Trash2, Clock, QrCode, Info, ChevronDown, ChevronUp } from 'lucide-react';
import hashGenerator, { HashAlgorithm, InputFormat, OutputFormat, Encoding, HashResult, ComparisonResult } from '@/lib/tools/tool/hash-generator';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectItem, SelectContent } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogTrigger, DialogDescription, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LearnButton } from '@/features/dashboard/tools/components/learn-button';
import { toast } from 'sonner';

const POPULAR_ALGORITHMS: HashAlgorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512'];
const MORE_ALGORITHMS: HashAlgorithm[] = ['SHA-384', 'SHA3-256', 'SHA3-512', 'BLAKE2b', 'RIPEMD-160'];

const inputFormats: InputFormat[] = ['plaintext', 'hex', 'base64'];
const outputFormats: OutputFormat[] = ['lowercase', 'uppercase', 'spaced'];
const encodings: Encoding[] = ['UTF-8', 'ASCII', 'Latin1'];

const tool = {
  name: "Hash Generator",
  description: "Advanced hash generator with multiple algorithms, formats, and security features.",
  slug: "hash-generator",
  category: "Security",
  tags: ["Security", "Hash", "Cryptography", "HMAC", "Comparison"]
};

const HashGenerator = () => {
  const [input, setInput] = useState('');
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<HashAlgorithm[]>(['SHA-256']);
  const [results, setResults] = useState<HashResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputFormat, setInputFormat] = useState<InputFormat>('plaintext');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('lowercase');
  const [encoding, setEncoding] = useState<Encoding>('UTF-8');
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [salt, setSalt] = useState('');
  const [hmacKey, setHmacKey] = useState('');
  const [showHmac, setShowHmac] = useState(false);
  const [showSalt, setShowSalt] = useState(false);
  const [showMoreAlgos, setShowMoreAlgos] = useState(false);
  const [showQr, setShowQr] = useState<{ [alg: string]: boolean }>({});
  const [compareA, setCompareA] = useState('');
  const [compareB, setCompareB] = useState('');
  const [compareResult, setCompareResult] = useState<ComparisonResult | null>(null);
  const [showLearn, setShowLearn] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate hashes
  const generateAllHashes = useCallback(async () => {
    if (!input.trim() || selectedAlgorithms.length === 0) {
      setResults([]);
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const hashResults: HashResult[] = [];
      for (const algorithm of selectedAlgorithms) {
        const result = await hashGenerator.generate({
          input,
          algorithm,
          inputFormat,
          outputFormat,
          encoding,
          salt: salt || undefined,
          hmacKey: hmacKey || undefined,
          autoGenerate,
        });
        hashResults.push(result);
      }
      setResults(hashResults);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate hashes');
    } finally {
      setIsGenerating(false);
    }
  }, [input, selectedAlgorithms, inputFormat, outputFormat, encoding, salt, hmacKey, autoGenerate]);

  // Auto-generate on input change
  React.useEffect(() => {
    if (autoGenerate) generateAllHashes();
    // eslint-disable-next-line
  }, [input, selectedAlgorithms, inputFormat, outputFormat, encoding, salt, hmacKey, autoGenerate]);

  // Manual generate
  const handleManualGenerate = () => {
    generateAllHashes();
    toast.success("Hash generated succesfully")
  };

  // File upload
  const handleFileRead = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
      if (autoGenerate) generateAllHashes();
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsText(file);
    toast.success("file readed succesfully")
  }, [autoGenerate, generateAllHashes]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) handleFileRead(files[0]);
    toast.success("file dropped succesfully")
  }, [handleFileRead]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) handleFileRead(files[0]);
  };

  // Copy
  const copyToClipboard = async (text: string, algorithm: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHash(`${algorithm}-${text}`);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch {
      setError('Failed to copy to clipboard');
    }
    toast.success("copied succesfully")
  };

  // Download
  const downloadHash = (hash: string, algorithm: string) => {
    const blob = new Blob([hash], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${algorithm.toLowerCase()}_hash.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("file start to download")
  };

  const downloadAllHashes = () => {
    const content = results.map(result =>
      `${result.algorithm}: ${result.hash}`
    ).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all_hashes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("all hashes file start to download")
  };

  // Clear
  const clearAll = () => {
    setInput('');
    setResults([]);
    setError(null);
    setSalt('');
    setHmacKey('');
    setCompareA('');
    setCompareB('');
    setCompareResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Algorithm selection
  const toggleAlgorithm = (alg: HashAlgorithm) => {
    setSelectedAlgorithms(prev =>
      prev.includes(alg)
        ? prev.length === 1 ? prev : prev.filter(a => a !== alg)
        : [...prev, alg]
    );
  };

  // Compare hashes
  const handleCompare = () => {
    if (!compareA || !compareB) {
      setCompareResult(null);
      return;
    }
    setCompareResult(hashGenerator.compare(compareA, compareB));
  };

  // Detect hash algorithm for pasted input
  const handlePasteDetect = (e: React.ClipboardEvent<HTMLTextAreaElement>, set: (v: string) => void) => {
    const value = e.clipboardData.getData('Text');
    set(value);
    const detected = hashGenerator.detectAlgorithm(value);
    if (detected) setSelectedAlgorithms([detected]);
  };

  // QR code toggle
  const toggleQr = (alg: string) => {
    setShowQr(prev => ({ ...prev, [alg]: !prev[alg] }));
    toast.success("qr code generated successfully")
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-2 md:p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 justify-between">
          <div className="flex justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold">{tool.name}</h1>
            </div>
            <div>
              <LearnButton
                tool={{
                  name: tool.name,
                  description: tool.description,
                  slug: tool.slug,
                  category: tool.category,
                  tags: tool.tags
                }}
                variant="secondary"
                mdFilePath="content/learn/hash-generator.md"
              />
            </div>
          </div>
          <div>
            <p className="text-muted-foreground">{tool.description}</p>
          </div>
        </div>

        {/* Main Tool */}
        <Card className="shadow-lg bg-background border-border">
          {/* <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Hash className="h-6 w-6 text-primary" />
              Hash Generator
            </CardTitle>
          </CardHeader> */}
          <CardContent className="pr-4 pl-4  space-y-6">
            {/* Algorithm Selection */}
            <div className=" rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">Algorithms:</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>Select one or more algorithms to hash with</TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_ALGORITHMS.map(alg => (
                  <Button
                    key={alg}
                    variant={selectedAlgorithms.includes(alg) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleAlgorithm(alg)}
                    className={cn(selectedAlgorithms.includes(alg) && 'ring-2 ring-primary')}
                  >
                    {alg}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMoreAlgos(v => !v)}
                  aria-label="Show more algorithms"
                >
                  {showMoreAlgos ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
              {showMoreAlgos && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {MORE_ALGORITHMS.map(alg => (
                    <Button
                      key={alg}
                      variant={selectedAlgorithms.includes(alg) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleAlgorithm(alg)}
                      className={cn(selectedAlgorithms.includes(alg) && 'ring-2 ring-primary')}
                    >
                      {alg}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            {/* Input Section */}
            <div className="bg-card rounded-lg border shadow-sm p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-card-foreground">Input</h2>
                <div className="flex gap-2">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload File
                  </Button>
                  {input && (
                    <Button
                      onClick={clearAll}
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept=".txt,.json,.xml,.csv,.log"
              />
              <div
                className={cn(
                  "relative border-2 border-dashed rounded-lg p-4 transition-colors",
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Enter text to hash or drag & drop a file here..."
                  className="w-full h-32 resize-none bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground"
                  autoFocus
                />
                {dragActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/5 rounded-lg">
                    <div className="text-primary text-sm font-medium">Drop file here</div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {input.length} characters
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date().toLocaleTimeString()}
                </span>
                <span className="flex items-center gap-1">
                  <span>Input Format:</span>
                  <Select value={inputFormat} onValueChange={v => setInputFormat(v as InputFormat)}>
                    {inputFormats.map(f => (
                      <SelectContent>
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      </SelectContent>
                    ))}
                  </Select>
                </span>
                <span className="flex items-center gap-1">
                  <span>Encoding:</span>
                  <Select value={encoding} onValueChange={v => setEncoding(v as Encoding)}>
                    {encodings.map(e => (
                      <SelectContent>
                        <SelectItem key={e} value={e}>{e}</SelectItem>
                      </SelectContent>
                    ))}
                  </Select>
                </span>
                <span className="flex items-center gap-1">
                  <span>Output:</span>
                  <Select value={outputFormat} onValueChange={v => setOutputFormat(v as OutputFormat)}>
                    {outputFormats.map(f => (
                      <SelectContent>
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      </SelectContent>
                      
                    ))}
                  </Select>
                </span>
                <span className="flex items-center gap-1">
                  <Switch checked={autoGenerate} onCheckedChange={setAutoGenerate} id="auto-generate" />
                  <label htmlFor="auto-generate">Auto-generate</label>
                </span>
                {!autoGenerate && (
                  <Button onClick={handleManualGenerate} size="sm" className="ml-2">
                    Generate
                  </Button>
                )}
              </div>
            </div>

            

            {/* Advanced Options */}
            <div className="bg-muted/30 rounded-lg p-4 flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Button
                  variant={showSalt ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowSalt(v => !v)}
                >
                  Salt
                </Button>
                {showSalt && (
                  <Input
                    value={salt}
                    onChange={e => setSalt(e.target.value)}
                    placeholder="Enter salt"
                    className="w-32"
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={showHmac ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowHmac(v => !v)}
                >
                  HMAC
                </Button>
                {showHmac && (
                  <Input
                    value={hmacKey}
                    onChange={e => setHmacKey(e.target.value)}
                    placeholder="Secret key"
                    className="w-32"
                    type="password"
                  />
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Results Section */}
            {(results.length > 0 || isGenerating) && (
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-card-foreground">Hash Results</h2>
                  {results.length > 0 && (
                    <Button
                      onClick={downloadAllHashes}
                      variant="secondary"
                      size="sm"
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download All
                    </Button>
                  )}
                </div>
                {isGenerating ? (
                  <div className="space-y-3">
                    {selectedAlgorithms.map(algorithm => (
                      <div key={algorithm} className="animate-pulse">
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-muted rounded w-20"></div>
                            <div className="h-8 bg-muted rounded w-full"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {results.map(result => {
                      const isCopied = copiedHash === `${result.algorithm}-${result.hash}`;
                      return (
                        <div key={result.algorithm} className="group">
                          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors gap-2">
                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex items-center gap-2">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className={cn(
                                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                    getAlgorithmColor(result.algorithm)
                                  )}>
                                    {result.algorithm}
                                  </span>
                                  </TooltipTrigger>
                                  <TooltipContent>{getAlgorithmTooltip(result.algorithm)}</TooltipContent>
                                </Tooltip>
                                <span className="text-xs text-muted-foreground">
                                  {result.length} chars
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {result.executionTime?.toFixed(2)} ms
                                </span>
                                {result.salt && (
                                  <span className="text-xs text-blue-700">Salted</span>
                                )}
                                {result.hmacKey && (
                                  <span className="text-xs text-orange-700">HMAC</span>
                                )}
                              </div>
                              <div>
                                <div className="font-mono text-sm bg-background rounded p-2 border break-all select-all">
                                  {result.hash}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-0 md:ml-4">
                              <Tooltip >
                                <TooltipTrigger asChild>
                                  <Button
                                  onClick={() => copyToClipboard(result.hash, result.algorithm)}
                                  variant="secondary"
                                  size="icon"
                                  className="opacity-80 group-hover:opacity-100"
                                >
                                  {isCopied ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                                </TooltipTrigger>
                                <TooltipContent>Copy hash</TooltipContent>
                              </Tooltip>
                              <Tooltip >
                                <TooltipTrigger asChild>
                                  <Button
                                  onClick={() => downloadHash(result.hash, result.algorithm)}
                                  variant="secondary"
                                  size="icon"
                                  className="opacity-80 group-hover:opacity-100"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                </TooltipTrigger>
                                <TooltipContent>Download hash</TooltipContent>
                              </Tooltip>
                              <Tooltip >
                                <TooltipTrigger asChild>
                                  <Button
                                  onClick={() => toggleQr(result.algorithm)}
                                  variant="secondary"
                                  size="icon"
                                  className="opacity-80 group-hover:opacity-100"
                                >
                                  <QrCode className="h-4 w-4" />
                                </Button>
                                </TooltipTrigger>
                                <TooltipContent>Show QR code</TooltipContent>
                              </Tooltip>
                            </div>
                            {showQr[result.algorithm] && (
                              <div className="mt-2 md:mt-0 md:ml-4">
                                <QRCodeSVG value={result.hash} size={96} />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Hash Comparison Tool */}
            <div className="bg-muted/30 rounded-lg p-6 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">Compare Hashes</span>
                <Tooltip>
                  <TooltipTrigger asChild >
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>Paste two hashes to check if they match and auto-detect algorithm</TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  value={compareA}
                  onChange={e => setCompareA(e.target.value)}
                  onPaste={e => handlePasteDetect(e, setCompareA)}
                  placeholder="Hash #1"
                  className="font-mono"
                />
                <Input
                  value={compareB}
                  onChange={e => setCompareB(e.target.value)}
                  onPaste={e => handlePasteDetect(e, setCompareB)}
                  placeholder="Hash #2"
                  className="font-mono"
                />
                <Button onClick={handleCompare} size="sm" className="self-start">
                  Compare
                </Button>
              </div>
              {compareResult && (
                <div className={cn(
                  "rounded p-2 mt-2 text-sm flex items-center gap-2",
                  compareResult.match ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                )}>
                  {compareResult.match ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  {compareResult.match ? "Hashes match!" : "Hashes do not match."}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {compareResult.detectedAlgorithm1 && `#1: ${compareResult.detectedAlgorithm1}`}
                    {compareResult.detectedAlgorithm2 && `, #2: ${compareResult.detectedAlgorithm2}`}
                  </span>
                </div>
              )}
            </div>

            
            
          </CardContent>
        </Card>

        
        {/* Info Section */}
        <Card>
          <CardHeader>
            <CardTitle>
              <h3 className="font-semibold text-foreground">Hash Algorithms</h3>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 rounded-lg p-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-red-700 mb-1">MD5 (128-bit)</div>
                  <div className="text-muted-foreground">Fast but cryptographically broken. Use only for checksums.</div>
                </div>
                <div>
                  <div className="font-medium text-orange-700 mb-1">SHA-1 (160-bit)</div>
                  <div className="text-muted-foreground">Deprecated for security. Avoid for new applications.</div>
                </div>
                <div>
                  <div className="font-medium text-blue-700 mb-1">SHA-256 (256-bit)</div>
                  <div className="text-muted-foreground">Secure and widely recommended for most applications.</div>
                </div>
                <div>
                  <div className="font-medium text-purple-700 mb-1">SHA-512 (512-bit)</div>
                  <div className="text-muted-foreground">Most secure option with highest computational requirements.</div>
                </div>
                <div>
                  <div className="font-medium text-green-700 mb-1">SHA-384, SHA3, BLAKE2b, RIPEMD-160</div>
                  <div className="text-muted-foreground">Advanced and alternative hashes for special use cases.</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Security Guidelines */}
        <Card className="bg-coral border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center text-background gap-2">
              <Hash className="w-5 h-5" />
              Security Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• <strong>Never store passwords as plain hashes</strong>. Use salted hashes or key derivation (bcrypt, scrypt, Argon2).</p>
            <p>• <strong>Use salts and HMAC</strong> for sensitive data.</p>
            <p>• <strong>MD5/SHA-1 are insecure</strong> for cryptography, use only for checksums.</p>
            <p>• <strong>Always verify hash integrity</strong> on the server side.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper: Algorithm color
function getAlgorithmColor(algorithm: HashAlgorithm) {
  const colors = {
    'MD5': 'bg-red-100 text-red-800 border-red-200',
    'SHA-1': 'bg-orange-100 text-orange-800 border-orange-200',
    'SHA-256': 'bg-blue-100 text-blue-800 border-blue-200',
    'SHA-512': 'bg-purple-100 text-purple-800 border-purple-200',
    'SHA-384': 'bg-green-100 text-green-800 border-green-200',
    'SHA3-256': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'SHA3-512': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'BLAKE2b': 'bg-pink-100 text-pink-800 border-pink-200',
    'RIPEMD-160': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };
  return colors[algorithm] || 'bg-muted text-foreground border-muted-foreground';
}

// Helper: Algorithm tooltip
function getAlgorithmTooltip(algorithm: HashAlgorithm) {
  switch (algorithm) {
    case 'MD5': return 'Fast, but insecure. Use only for checksums.';
    case 'SHA-1': return 'Deprecated for security. Avoid for new applications.';
    case 'SHA-256': return 'Secure and widely recommended for most applications.';
    case 'SHA-512': return 'Most secure, but slower and longer output.';
    case 'SHA-384': return 'Shorter SHA-512 variant, secure for most uses.';
    case 'SHA3-256': return 'SHA-3 family, modern and secure.';
    case 'SHA3-512': return 'SHA-3 family, modern and secure.';
    case 'BLAKE2b': return 'Very fast, secure, modern hash function.';
    case 'RIPEMD-160': return 'Legacy, used in Bitcoin addresses.';
    default: return '';
  }
}

export default HashGenerator;