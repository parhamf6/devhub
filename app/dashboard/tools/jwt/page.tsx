"use client"
import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Copy, 
  RefreshCcw, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Clock, 
  User, 
  Shield,
  Key,
  FileText,
  Calendar,
  Zap
} from 'lucide-react';
import jwtTool from '@/lib/tools/tool/jwt';
import { LearnButton } from '@/features/dashboard/tools/components/learn-button';
import { toast } from 'sonner';
const tool = jwtTool

// Types
interface JWTHeader {
  alg: string;
  typ: string;
  kid?: string;
  [key: string]: any;
}

interface JWTPayload {
  sub?: string;
  iss?: string;
  aud?: string | string[];
  exp?: number;
  iat?: number;
  nbf?: number;
  jti?: string;
  [key: string]: any;
}

interface DecodedJWT {
  header: JWTHeader;
  payload: JWTPayload;
}

interface TokenInfo {
  algorithm: string;
  type: string;
  expiration: ExpirationInfo | null;
  issuedAt: string | null;
  subject?: string;
  issuer?: string;
  audience?: string | string[];
}

interface ExpirationInfo {
  date: Date;
  isExpired: boolean;
  timeLeft: number;
  formatted: string;
}

interface JSONViewerProps {
  data: Record<string, any>;
  title: string;
}

// Algorithm options
const algorithms: string[] = [
  'HS256', 'HS384', 'HS512',
  'RS256', 'RS384', 'RS512',
  'ES256', 'ES384', 'ES512',
  'PS256', 'PS384', 'PS512'
];

// Expiration options
const expirationOptions = [
  { value: '15m', label: '15 minutes' },
  { value: '1h', label: '1 hour' },
  { value: '24h', label: '24 hours' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' }
];

// Mock implementations for the required functions
const jwtDecode = (token: string): DecodedJWT => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token structure');
    
    const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'))) as JWTHeader;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))) as JWTPayload;
    
    return { header, payload };
  } catch (e) {
    throw new Error('Invalid JWT token');
  }
};

const createJWT = async (header: JWTHeader, payload: JWTPayload, secret: string): Promise<string> => {
  // Mock JWT creation - in real implementation you'd use a proper library
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  // Mock signature (in real implementation, use crypto libraries)
  const signature = btoa(`${secret}-signature`).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  return `${headerB64}.${payloadB64}.${signature}`;
};

const JSONViewer: React.FC<JSONViewerProps> = ({ data, title }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">{title}</Label>
    <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-auto max-h-64 border">
      <pre className="whitespace-pre-wrap text-muted-foreground">{JSON.stringify(data, null, 2)}</pre>
    </div>
  </div>
);

export default function AdvancedJWTTool(): JSX.Element {
  // Decode Tab State
  const [token, setToken] = useState<string>('');
  const [decodedData, setDecodedData] = useState<DecodedJWT | null>(null);
  const [decodeError, setDecodeError] = useState<string>('');
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);

  // Encode Tab State  
  const [algorithm, setAlgorithm] = useState<string>('HS256');
  const [secretKey, setSecretKey] = useState<string>('your-256-bit-secret');
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [customHeader, setCustomHeader] = useState<string>('{}');
  const [payloadData, setPayloadData] = useState<string>('{}');
  const [encodedToken, setEncodedToken] = useState<string>('');
  const [encodeError, setEncodeError] = useState<string>('');
  
  // Payload builder state
  const [subject, setSubject] = useState<string>('');
  const [issuer, setIssuer] = useState<string>('');
  const [audience, setAudience] = useState<string>('');
  const [expiresIn, setExpiresIn] = useState<string>('1h');
  const [useBuilder, setUseBuilder] = useState<boolean>(true);

  // Copy to clipboard function
  const copyToClipboard = useCallback((text: string, message: string = 'Copied to clipboard!'): void => {
    navigator.clipboard.writeText(text);
    // In a real app, you'd show a toast notification here
    console.log(message);
    toast.success("Token Copied Successfully!")
  }, []);

  // Validate JSON
  const validateJSON = (jsonString: string): { valid: boolean; error: string | null } => {
    try {
      JSON.parse(jsonString);
      return { valid: true, error: null };
    } catch (e) {
      return { valid: false, error: (e as Error).message };
    }
  };

  // Calculate token expiration info
  const getExpirationInfo = (exp?: number): ExpirationInfo | null => {
    if (!exp) return null;
    
    const expDate = new Date(exp * 1000);
    const now = new Date();
    const isExpired = now > expDate;
    const timeLeft = expDate.getTime() - now.getTime();
    
    return {
      date: expDate,
      isExpired,
      timeLeft: isExpired ? 0 : timeLeft,
      formatted: expDate.toLocaleString()
    };
  };

  // Format time duration
  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  // Decode JWT token
  useEffect(() => {
    if (!token.trim()) {
      setDecodedData(null);
      setDecodeError('');
      setTokenInfo(null);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setDecodedData(decoded);
      setDecodeError('');
      
      // Calculate token info
      const exp = decoded.payload.exp;
      const iat = decoded.payload.iat;
      const expInfo = getExpirationInfo(exp);
      
      setTokenInfo({
        algorithm: decoded.header.alg || 'Unknown',
        type: decoded.header.typ || 'JWT',
        expiration: expInfo,
        issuedAt: iat ? new Date(iat * 1000).toLocaleString() : null,
        subject: decoded.payload.sub,
        issuer: decoded.payload.iss,
        audience: decoded.payload.aud
      });
    } catch (err) {
      setDecodedData(null);
      setDecodeError((err as Error).message);
      setTokenInfo(null);
    }
  }, [token]);

  // Convert time string to seconds
  const timeToSeconds = (timeStr: string): number => {
    const unit = timeStr.slice(-1);
    const value = parseInt(timeStr.slice(0, -1));
    
    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 3600;
      case 'd': return value * 86400;
      default: return 3600; // default 1 hour
    }
  };

  // Build payload from form inputs
  const buildPayload = (): JWTPayload => {
    const now = Math.floor(Date.now() / 1000);
    const payload: JWTPayload = {
      iat: now,
      exp: now + timeToSeconds(expiresIn)
    };
    
    if (subject) payload.sub = subject;
    if (issuer) payload.iss = issuer;
    if (audience) payload.aud = audience;
    
    return payload;
  };

  // Encode JWT
  const handleEncode = async (): Promise<void> => {
    try {
      let header: JWTHeader = { alg: algorithm, typ: 'JWT' };
      let payload: JWTPayload = {};

      // Merge custom header
      if (customHeader.trim()) {
        const customHeaderObj = JSON.parse(customHeader) as Partial<JWTHeader>;
        header = { ...header, ...customHeaderObj };
      }

      // Build payload
      if (useBuilder) {
        payload = buildPayload();
        if (payloadData.trim() && payloadData !== '{}') {
          const customPayload = JSON.parse(payloadData) as Partial<JWTPayload>;
          payload = { ...payload, ...customPayload };
        }
      } else {
        payload = JSON.parse(payloadData) as JWTPayload;
      }

      const jwt = await createJWT(header, payload, secretKey);
      setEncodedToken(jwt);
      setEncodeError('');
    } catch (err) {
      setEncodeError(`Encoding failed: ${(err as Error).message}`);
      setEncodedToken('');
    }
    toast.success("Token Generated Successfully!")
  };

  // Sample tokens for quick testing
  const sampleTokens: Record<string, string> = {
    valid: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    expired: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDAwMDB9.invalid'
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        {/* <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              {tool.name}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {tool.description}
          </p>
        </div> */}
        <div className="flex flex-col gap-4 justify-between">
            <div className='flex justify-between  gap-4 flex-wrap'>
                <div>
                    <h1 className="text-2xl font-bold">{tool?.name}</h1>
                </div>
                            
                <div className=''>
                    <LearnButton 
                        tool={{
                            name: tool?.name || '',
                            description: tool?.description || '',
                            slug: tool?.slug || 'jwt',
                            category: tool?.category || 'Secuirty',
                            // icon: tool?.icon,
                            // version: tool?.version,
                            // rating: tool?.rating,
                            tags: tool?.tags
                        }}
                        variant="secondary"
                        mdFilePath="content/learn/jwt.md"  // ← Manual path
                    />
                </div>
            </div>
            <div>
                <p className="text-muted-foreground">{tool?.description}</p>
            </div>
        </div>

        {/* Main Tool */}
        <Card className="shadow-lg bg-card border-border">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Key className="w-5 h-5 text-primary" />
              JWT Processor
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="decode" className="space-y-16">
              <TabsList className="flex gap-4 flex-wrap w-full h-12 bg-background">
                <TabsTrigger value="decode" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <Eye className="w-4 h-4" />
                  Decode & Verify
                </TabsTrigger>
                <TabsTrigger value="encode" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <Zap className="w-4 h-4" />
                  Create & Sign
                </TabsTrigger>
              </TabsList>

              {/* Decode Tab */}
              <TabsContent value="decode" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <Label className="text-base font-semibold text-foreground">JWT Token Input</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setToken(sampleTokens.valid)}
                        className="border-border hover:bg-accent"
                      >
                        Load Sample
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setToken('')}
                        className="border-border hover:bg-accent"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                  
                  <Textarea
                    placeholder="Paste your JWT token here (eyJ...)..."
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="min-h-[120px] font-mono text-sm bg-background border-border focus:border-primary"
                  />

                  {decodeError && (
                    <Alert variant="destructive" className="bg-error-muted border-error">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-error-foreground">{decodeError}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Token Analysis */}
                {tokenInfo && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Card className="bg-info-muted border-info/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Info className="w-4 h-4 text-info" />
                          <h3 className="font-semibold ">Token Info</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Algorithm:</span>
                            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                              {tokenInfo.algorithm}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-mono text-foreground">{tokenInfo.type}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className={`${tokenInfo.expiration?.isExpired ? 'bg-error-muted border-error/20' : 'bg-success-muted border-success/20'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4" />
                          <h3 className="font-semibold">Expiration</h3>
                        </div>
                        {tokenInfo.expiration ? (
                          <div className="space-y-2 text-sm">
                            <Badge variant={tokenInfo.expiration.isExpired ? "destructive" : "default"}>
                              {tokenInfo.expiration.isExpired ? 'Expired' : 'Valid'}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {tokenInfo.expiration.formatted}
                            </div>
                            {!tokenInfo.expiration.isExpired && (
                              <div className="text-xs font-mono text-success">
                                {formatDuration(tokenInfo.expiration.timeLeft)} remaining
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">No expiration set</div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="bg-violet-muted border-violet/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <User className="w-4 h-4 text-violet" />
                          <h3 className="font-semibold ">Claims</h3>
                        </div>
                        <div className="space-y-1 text-sm">
                          {tokenInfo.subject && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Subject:</span>
                              <span className="font-mono text-xs text-foreground">{tokenInfo.subject}</span>
                            </div>
                          )}
                          {tokenInfo.issuer && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Issuer:</span>
                              <span className="font-mono text-xs text-foreground">{tokenInfo.issuer}</span>
                            </div>
                          )}
                          {tokenInfo.issuedAt && (
                            <div className="text-xs text-muted-foreground">
                              Issued: {tokenInfo.issuedAt}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Decoded Content */}
                {decodedData && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-background border-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between text-base text-card-foreground">
                          <span className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Header
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(JSON.stringify(decodedData.header, null, 2))}
                            className="hover:bg-accent"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <JSONViewer data={decodedData.header} title="" />
                      </CardContent>
                    </Card>

                    <Card className="bg-background border-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between text-base text-card-foreground">
                          <span className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Payload
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(JSON.stringify(decodedData.payload, null, 2))}
                            className="hover:bg-accent"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <JSONViewer data={decodedData.payload} title="" />
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              {/* Encode Tab */}
              <TabsContent value="encode" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Configuration Panel */}
                  <div className="space-y-6">
                    <Card className="bg-background border-border">
                      <CardHeader>
                        <CardTitle className="text-base text-card-foreground">Algorithm & Secret</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-foreground">Algorithm</Label>
                          <Select value={algorithm} onValueChange={setAlgorithm}>
                            <SelectTrigger className="bg-background border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              {algorithms.map(alg => (
                                <SelectItem key={alg} value={alg}>{alg}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="flex items-center justify-between text-foreground">
                            Secret Key
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowSecret(!showSecret)}
                              className="hover:bg-accent"
                            >
                              {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </Label>
                          <Input
                            type={showSecret ? "text" : "password"}
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                            placeholder="Enter your secret key"
                            className="bg-background border-border focus:border-primary"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-background border-border">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center justify-between text-card-foreground">
                          Payload Builder
                          <div className="flex items-center gap-2">
                            <Label htmlFor="use-builder" className="text-sm font-normal text-muted-foreground">Use Builder</Label>
                            <Switch
                              id="use-builder"
                              checked={useBuilder}
                              onCheckedChange={setUseBuilder}
                            />
                          </div>
                        </CardTitle>
                      </CardHeader>
                      {useBuilder && (
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-foreground">Subject (sub)</Label>
                              <Input
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="user123"
                                className="bg-background border-border focus:border-primary"
                              />
                            </div>
                            <div>
                              <Label className="text-foreground">Expires In</Label>
                              <Select value={expiresIn} onValueChange={setExpiresIn}>
                                <SelectTrigger className="bg-background border-border">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                  {expirationOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label className="text-foreground">Issuer (iss)</Label>
                            <Input
                              value={issuer}
                              onChange={(e) => setIssuer(e.target.value)}
                              placeholder="https://your-domain.com"
                              className="bg-background border-border focus:border-primary"
                            />
                          </div>
                          <div>
                            <Label className="text-foreground">Audience (aud)</Label>
                            <Input
                              value={audience}
                              onChange={(e) => setAudience(e.target.value)}
                              placeholder="your-api"
                              className="bg-background border-border focus:border-primary"
                            />
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </div>

                  {/* JSON Editors */}
                  <div className="space-y-6">
                    <Card className="bg-background border-border">
                      {/* add place holder to text area or add some tooltip excample */}
                      <CardHeader>
                        <CardTitle className="text-base text-card-foreground">Custom Header (Optional)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={customHeader}
                          onChange={(e) => setCustomHeader(e.target.value)}
                          placeholder='{"kid": "key-id"}'
                          className="font-mono text-sm bg-background border-border focus:border-primary"
                          rows={4}
                        />
                      </CardContent>
                    </Card>

                    <Card className="bg-background border-border">
                      {/* add place holder to text area or add some tooltip excample */}
                      <CardHeader>
                        <CardTitle className="text-base text-card-foreground">
                          {useBuilder ? 'Additional Payload Claims' : 'Payload JSON'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={payloadData}
                          onChange={(e) => setPayloadData(e.target.value)}
                          placeholder={useBuilder ? '{"role": "admin", "permissions": ["read", "write"]}' : '{"sub": "1234567890", "name": "John Doe", "iat": 1516239022}'}
                          className="font-mono text-sm bg-background border-border focus:border-primary"
                          rows={6}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="flex gap-4">
                  <Button onClick={handleEncode} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Generate JWT Token
                  </Button>
                </div>

                {encodeError && (
                  <Alert variant="destructive" className="bg-error-muted border-error">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-error-foreground">{encodeError}</AlertDescription>
                  </Alert>
                )}

                {/* Generated Token */}
                {encodedToken && (
                  <Card className="bg-success-muted  border-success/20">
                    <CardHeader>
                      <CardTitle className="flex flex-wrap gap-4 items-center justify-between text-base">
                        <span className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          Generated JWT Token
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(encodedToken, 'JWT token copied!')}
                          className="border-success hover:bg-success/10"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Token
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={encodedToken}
                        readOnly
                        className="font-mono text-sm bg-background border-border"
                        rows={4}
                      />
                      <div className="mt-4 p-3 bg-info-muted rounded-lg border border-info/20">
                        <p className="text-sm">
                          💡 <strong>Tip:</strong> Copy this token and paste it in the Decode tab to verify its contents.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        {/* Security Guidelines */}
        <Card className="bg-coral border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center text-background gap-2">
              <Shield className="w-5 h-5" />
              Security Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• <strong>Never expose secret keys</strong> in client-side applications or public repositories</p>
            <p>• <strong>Use HTTPS only</strong> when transmitting JWT tokens</p>
            <p>• <strong>Set appropriate expiration times</strong> - shorter is generally better for security</p>
            <p>• <strong>Store tokens securely</strong> and implement proper token refresh mechanisms</p>
            <p>• <strong>Validate all claims</strong> on the server side, never trust client-side validation alone</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}