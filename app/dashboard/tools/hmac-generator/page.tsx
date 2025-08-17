'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Eye, 
  EyeOff, 
  Info, 
  RefreshCcw, 
  Shield, 
  Key,
  Hash,
  FileText,
  Lock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LearnButton } from '@/features/dashboard/tools/components/learn-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';

const tool = {
  name: "HMAC Generator",
  slug: "hmac-generator",
  description: "Generate HMAC signatures for API auth",
  info: "Generate HMAC signatures using SHA-256 or other algorithms. Ideal for securing webhook payloads.",
  category: "Security",
  version: "1.0.0",
  tags: ["signature", "authentication", "cryptography"],
};

// Supported algorithms
const ALGORITHMS = [
  { value: 'SHA-1', label: 'SHA-1', color: 'bg-yellow-500', deprecated: true },
  { value: 'SHA-256', label: 'SHA-256', color: 'bg-green-500', recommended: true },
  { value: 'SHA-384', label: 'SHA-384', color: 'bg-blue-500' },
  { value: 'SHA-512', label: 'SHA-512', color: 'bg-purple-500' },
];

// Example payloads for quick testing
const EXAMPLE_PAYLOADS = [
  { name: 'Webhook', value: '{"event":"user.created","data":{"id":123,"email":"user@example.com"}}' },
  { name: 'API Request', value: 'GET /api/users HTTP/1.1\nHost: example.com\nX-Request-ID: abc123' },
  { name: 'Simple Text', value: 'This is a test message for HMAC generation' },
];

// Convert ArrayBuffer to different encodings
function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function arrayBufferToBinary(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(2).padStart(8, '0'))
    .join('');
}

export default function HMACGeneratorPage() {
  const [message, setMessage] = useState('');
  const [secret, setSecret] = useState('');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [hmac, setHmac] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [encoding, setEncoding] = useState('hex');
  const [timestamp, setTimestamp] = useState('');
  const [nonce, setNonce] = useState('');

  // Generate a random nonce
  const generateNonce = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  // Initialize nonce and timestamp
  useEffect(() => {
    setNonce(generateNonce());
    setTimestamp(new Date().toISOString());
  }, []);

  // Generate HMAC using Web Crypto API
  const generateHMAC = async () => {
    if (!message || !secret) {
      toast.error('Message and secret key are required');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Encode message and secret as Uint8Array
      const encoder = new TextEncoder();
      const messageData = encoder.encode(message);
      const secretData = encoder.encode(secret);

      // Import the secret key
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        secretData,
        { name: 'HMAC', hash: algorithm },
        false,
        ['sign']
      );

      // Generate the signature
      const signature = await crypto.subtle.sign(
        'HMAC',
        cryptoKey,
        messageData
      );

      // Convert to desired encoding
      let result = '';
      if (encoding === 'hex') {
        result = arrayBufferToHex(signature);
      } else if (encoding === 'base64') {
        result = arrayBufferToBase64(signature);
      } else if (encoding === 'binary') {
        result = arrayBufferToBinary(signature);
      }

      setHmac(result);
      toast.success('HMAC generated successfully!');
    } catch (error) {
      console.error('Error generating HMAC:', error);
      toast.error('Failed to generate HMAC: ' + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-generate when inputs change
  useEffect(() => {
    const handler = setTimeout(() => {
      if (message && secret) {
        generateHMAC();
      }
    }, 500);
    
    return () => clearTimeout(handler);
  }, [message, secret, algorithm, encoding]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleClear = () => {
    setMessage('');
    setSecret('');
    setHmac('');
    setNonce(generateNonce());
    setTimestamp(new Date().toISOString());
  };

  const loadExample = (example: string) => {
    setMessage(example);
  };

  const selectedAlgorithm = ALGORITHMS.find(a => a.value === algorithm);

  return (
    <div className="flex flex-col justify-center p-2 md:p-6 space-y-6 mx-auto">
      <div className="flex flex-col gap-4">
        <div className='flex justify-between gap-4 flex-wrap'>
          <div className="flex items-center gap-2">
            {/* <Hash className="h-6 w-6 text-primary" /> */}
            <h1 className="text-2xl font-bold">{tool.name}</h1>
          </div>
          
          <div className='flex gap-2'>
            <LearnButton 
              tool={{
                name: tool.name,
                description: tool.description,
                slug: tool.slug,
                category: tool.category,
                tags: tool.tags
              }}
              variant="secondary"
              mdFilePath="content/learn/hmac-generator.md"
            />
          </div>
        </div>
        <p className="text-muted-foreground">{tool.description}</p>
      </div>

      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator">HMAC Generator</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inputs Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter the message to sign"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secret">Secret Key</Label>
                  <div className="relative">
                    <Input
                      id="secret"
                      type={showSecret ? "text" : "password"}
                      value={secret}
                      onChange={(e) => setSecret(e.target.value)}
                      placeholder="Enter your secret key"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowSecret(!showSecret)}
                    >
                      {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap md:gap-8 sm:gap-4">
                  <div className="space-y-2">
                    <Label>Algorithm</Label>
                    <Select value={algorithm} onValueChange={setAlgorithm}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ALGORITHMS.map((algo) => (
                          <SelectItem key={algo.value} value={algo.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${algo.color}`}></div>
                              <span>{algo.label}</span>
                              {algo.recommended && (
                                <Badge variant="outline" className="text-xs">Recommended</Badge>
                              )}
                              {algo.deprecated && (
                                <Badge variant="destructive" className="text-xs">Deprecated</Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Output Encoding</Label>
                    <Select value={encoding} onValueChange={setEncoding}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hex">Hexadecimal</SelectItem>
                        <SelectItem value="base64">Base64</SelectItem>
                        <SelectItem value="binary">Binary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex flex-wrap md:gap-8 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timestamp">Timestamp (Optional)</Label>
                    <Input
                      id="timestamp"
                      value={timestamp}
                      onChange={(e) => setTimestamp(e.target.value)}
                      placeholder="ISO timestamp"
                      className='pr-16'
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nonce">Nonce (Optional)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="nonce"
                        value={nonce}
                        onChange={(e) => setNonce(e.target.value)}
                        placeholder="Unique value"
                      />
                      <Button 
                        size="icon" 
                        variant="outline"
                        onClick={() => setNonce(generateNonce())}
                        title="Generate new nonce"
                      >
                        <RefreshCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={generateHMAC} 
                    className="flex-1"
                    disabled={isGenerating || !message || !secret}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Generate HMAC
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Output Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  HMAC Signature
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hmac ? (
                  <>
                    <div className="relative">
                      <Textarea
                        value={hmac}
                        readOnly
                        rows={6}
                        className="font-mono text-sm"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => handleCopy(hmac, 'HMAC Signature')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col p-3 bg-muted rounded-lg">
                        <span className="text-xs text-muted-foreground">Algorithm</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-3 h-3 rounded-full ${selectedAlgorithm?.color}`}></div>
                          <span className="font-medium">{selectedAlgorithm?.label}</span>
                          {selectedAlgorithm?.recommended && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          {selectedAlgorithm?.deprecated && (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col p-3 bg-muted rounded-lg">
                        <span className="text-xs text-muted-foreground">Encoding</span>
                        <span className="font-medium mt-1">{encoding.toUpperCase()}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Additional Parameters</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col p-3 bg-muted rounded-lg">
                          <span className="text-xs text-muted-foreground">Timestamp</span>
                          <span className="text-xs font-mono mt-1 truncate">
                            {timestamp || 'Not provided'}
                          </span>
                        </div>
                        
                        <div className="flex flex-col p-3 bg-muted rounded-lg">
                          <span className="text-xs text-muted-foreground">Nonce</span>
                          <span className="text-xs font-mono mt-1 truncate">
                            {nonce || 'Not provided'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCopy(
                          `HMAC ${algorithm}:\n${hmac}\n\nMessage: ${message}\nSecret: ${secret}`,
                          'Full HMAC Details'
                        )}
                      >
                        <Copy className="mr-1 h-3 w-3" />
                        Copy All
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const curlCommand = `curl -X POST https://api.example.com/webhook \\
  -H "Content-Type: application/json" \\
  -H "X-HMAC-Signature: ${hmac}" \\
  -H "X-Timestamp: ${timestamp}" \\
  -H "X-Nonce: ${nonce}" \\
  -d '${message}'`;
                          handleCopy(curlCommand, 'cURL Command');
                        }}
                      >
                        <FileText className="mr-1 h-3 w-3" />
                        Copy cURL
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <Shield className="h-12 w-12 mb-4 opacity-50" />
                    <p>Enter message and secret key to generate HMAC</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Example Payloads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click on any example below to load it into the generator. These are common use cases for HMAC signatures.
              </p>
              
              <div className="space-y-4">
                {EXAMPLE_PAYLOADS.map((example, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{example.name}</h3>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => loadExample(example.value)}
                      >
                        Load Example
                      </Button>
                    </div>
                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                      {example.value}
                    </pre>
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Security Best Practices</h4>
                <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
                  <li>Use a strong, randomly generated secret key</li>
                  <li>Prefer SHA-256 or stronger algorithms</li>
                  <li>Include a timestamp and nonce to prevent replay attacks</li>
                  <li>Store secrets securely, never in client-side code</li>
                  <li>Rotate secrets periodically</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}