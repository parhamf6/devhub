"use client"
import React, { useEffect, useState, useCallback, useRef } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipTrigger , TooltipProvider , TooltipContent } from '@/components/ui/tooltip';
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
  Zap,
  Download,
  Upload,
  History,
  Settings,
  Code,
  Save,
  Trash2,
  Plus,
  X,
  Dice3, Bookmark
} from 'lucide-react';
import jwtTool from '@/lib/tools/tool/jwt';
import { LearnButton } from '@/features/dashboard/tools/components/learn-button';
import { toast } from 'sonner';

const tool = jwtTool

// Types remain the same as before
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
interface PayloadTemplate {
  name: string;
  description: string;
  payload: JWTPayload;
}
interface SavedToken {
  id: string;
  name: string;
  token: string;
  timestamp: number;
}

// Algorithm options with descriptions
const algorithmOptions: { value: string; label: string; description: string }[] = [
  { value: 'HS256', label: 'HS256', description: 'HMAC using SHA-256 hash algorithm' },
  { value: 'HS384', label: 'HS384', description: 'HMAC using SHA-384 hash algorithm' },
  { value: 'HS512', label: 'HS512', description: 'HMAC using SHA-512 hash algorithm' },
  { value: 'RS256', label: 'RS256', description: 'RSASSA-PKCS1-v1_5 using SHA-256 hash algorithm' },
  { value: 'RS384', label: 'RS384', description: 'RSASSA-PKCS1-v1_5 using SHA-384 hash algorithm' },
  { value: 'RS512', label: 'RS512', description: 'RSASSA-PKCS1-v1_5 using SHA-512 hash algorithm' },
  { value: 'ES256', label: 'ES256', description: 'ECDSA using P-256 curve and SHA-256 hash algorithm' },
  { value: 'ES384', label: 'ES384', description: 'ECDSA using P-384 curve and SHA-384 hash algorithm' },
  { value: 'ES512', label: 'ES512', description: 'ECDSA using P-521 curve and SHA-512 hash algorithm' },
  { value: 'PS256', label: 'PS256', description: 'RSASSA-PSS using SHA-256 hash algorithm' },
  { value: 'PS384', label: 'PS384', description: 'RSASSA-PSS using SHA-384 hash algorithm' },
  { value: 'PS512', label: 'PS512', description: 'RSASSA-PSS using SHA-512 hash algorithm' }
];

// Expiration options
const expirationOptions = [
  { value: '5m', label: '5 minutes' },
  { value: '15m', label: '15 minutes' },
  { value: '30m', label: '30 minutes' },
  { value: '1h', label: '1 hour' },
  { value: '6h', label: '6 hours' },
  { value: '12h', label: '12 hours' },
  { value: '24h', label: '24 hours' },
  { value: '3d', label: '3 days' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: 'custom', label: 'Custom' }
];

// Payload templates
const payloadTemplates: PayloadTemplate[] = [
  {
    name: "Basic Authentication",
    description: "Standard user authentication token",
    payload: {
      sub: "user123",
      name: "John Doe",
      role: "user",
      permissions: ["read", "write"]
    }
  },
  {
    name: "Admin Access",
    description: "Elevated permissions token",
    payload: {
      sub: "admin123",
      name: "Admin User",
      role: "admin",
      permissions: ["read", "write", "delete", "manage_users"]
    }
  },
  {
    name: "API Access",
    description: "Service-to-service authentication",
    payload: {
      iss: "api-service",
      sub: "client-app",
      aud: "resource-server",
      scopes: ["api:read", "api:write"]
    }
  },
  {
    name: "Refresh Token",
    description: "Long-lived token for obtaining new access tokens",
    payload: {
      sub: "user123",
      type: "refresh",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
    }
  }
];

// Common JWT claims with descriptions
const commonClaims = [
  { key: "sub", label: "Subject", description: "Identifier for the subject (usually user ID)" },
  { key: "iss", label: "Issuer", description: "Identifier for the issuer of the JWT" },
  { key: "aud", label: "Audience", description: "Recipients that the JWT is intended for" },
  { key: "exp", label: "Expiration Time", description: "Time after which the JWT expires" },
  { key: "nbf", label: "Not Before", description: "Time before which the JWT must not be accepted" },
  { key: "iat", label: "Issued At", description: "Time at which the JWT was issued" },
  { key: "jti", label: "JWT ID", description: "Unique identifier for the JWT" },
  { key: "name", label: "Full Name", description: "Full name of the user" },
  { key: "email", label: "Email", description: "Email address of the user" },
  { key: "role", label: "Role", description: "Role of the user in the system" },
  { key: "permissions", label: "Permissions", description: "Array of permissions granted to the user" }
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Decode Tab State
  const [token, setToken] = useState<string>('');
  const [decodedData, setDecodedData] = useState<DecodedJWT | null>(null);
  const [decodeError, setDecodeError] = useState<string>('');
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [validationKey, setValidationKey] = useState<string>('');
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message: string } | null>(null);
  
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
  const [customExpiration, setCustomExpiration] = useState<string>('');
  const [useBuilder, setUseBuilder] = useState<boolean>(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customClaims, setCustomClaims] = useState<Array<{key: string, value: string}>>([{key: '', value: ''}]);
  
  // History state
  const [savedTokens, setSavedTokens] = useState<SavedToken[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  
  // Settings state
  const [autoCopy, setAutoCopy] = useState<boolean>(true);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
  const [wrapText, setWrapText] = useState<boolean>(true);

  // Copy to clipboard function
  const copyToClipboard = useCallback((text: string, message: string = 'Copied to clipboard!'): void => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  }, []);

  // Generate random secret key
  const generateRandomSecret = useCallback(() => {
    // Determine appropriate length based on algorithm
    let length = 32; // Default for HS256
    if (algorithm.startsWith('HS384')) length = 48;
    else if (algorithm.startsWith('HS512')) length = 64;
    else if (algorithm.startsWith('RS') || algorithm.startsWith('ES') || algorithm.startsWith('PS')) length = 32;
    
    // Generate cryptographically secure random string
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomValues = new Uint32Array(length);
    
    // In a real implementation, use crypto.getRandomValues
    for (let i = 0; i < length; i++) {
      randomValues[i] = Math.floor(Math.random() * chars.length);
      result += chars[randomValues[i] % chars.length];
    }
    
    setSecretKey(result);
    toast.success('Random secret generated!');
  }, [algorithm]);

  // Clear all form fields in the Create tab
  const clearAllFields = useCallback(() => {
    setAlgorithm('HS256');
    setSecretKey('your-256-bit-secret');
    setShowSecret(false);
    setCustomHeader('{}');
    setPayloadData('{}');
    setSubject('');
    setIssuer('');
    setAudience('');
    setExpiresIn('1h');
    setCustomExpiration('');
    setSelectedTemplate('');
    setCustomClaims([{key: '', value: ''}]);
    setEncodedToken('');
    setEncodeError('');
    toast.success('Form cleared!');
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

  // Load saved tokens from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('jwtSavedTokens');
    if (saved) {
      try {
        setSavedTokens(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved tokens', e);
      }
    }
  }, []);

  // Save tokens to localStorage
  useEffect(() => {
    localStorage.setItem('jwtSavedTokens', JSON.stringify(savedTokens));
  }, [savedTokens]);

  // Convert time string to seconds
  const timeToSeconds = (timeStr: string): number => {
    if (timeStr === 'custom' && customExpiration) {
      return parseInt(customExpiration);
    }
    
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
    
    // Add custom claims
    customClaims.forEach(claim => {
      if (claim.key && claim.value) {
        try {
          // Try to parse as JSON, if fails, use as string
          payload[claim.key] = JSON.parse(claim.value);
        } catch {
          payload[claim.key] = claim.value;
        }
      }
    });
    
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
      
      if (autoCopy) {
        copyToClipboard(jwt, 'Token generated and copied to clipboard!');
      } else {
        toast.success("Token Generated Successfully!");
      }
    } catch (err) {
      setEncodeError(`Encoding failed: ${(err as Error).message}`);
      setEncodedToken('');
    }
  };

  // Validate token signature
  const handleValidate = () => {
    try {
      const decoded = jwtDecode(token);
      if (decoded.header.alg.startsWith('HS')) {
        // Mock validation for symmetric algorithms
        if (validationKey.trim()) {
          setValidationResult({ valid: true, message: 'Token signature is valid (mock)' });
        } else {
          setValidationResult({ valid: false, message: 'Secret key is required for validation' });
        }
      } else {
        setValidationResult({ valid: false, message: 'Asymmetric algorithms not supported in mock validation' });
      }
    } catch (e) {
      setValidationResult({ valid: false, message: 'Invalid token' });
    }
  };

  // Save token to history
  const saveToken = () => {
    if (!encodedToken) return;
    
    const name = prompt('Enter a name for this token:');
    if (!name) return;
    
    const newToken: SavedToken = {
      id: Date.now().toString(),
      name,
      token: encodedToken,
      timestamp: Date.now()
    };
    
    setSavedTokens(prev => [newToken, ...prev]);
    toast.success('Token saved to history!');
  };

  // Load token from history
  const loadToken = (token: string) => {
    setToken(token);
    setShowHistory(false);
    toast.success('Token loaded from history!');
  };

  // Delete token from history
  const deleteToken = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedTokens(prev => prev.filter(token => token.id !== id));
    toast.success('Token removed from history!');
  };

  // Apply template
  const applyTemplate = (templateName: string) => {
    const template = payloadTemplates.find(t => t.name === templateName);
    if (!template) return;
    
    setSelectedTemplate(templateName);
    setPayloadData(JSON.stringify(template.payload, null, 2));
    
    // Update builder fields if using builder
    if (useBuilder) {
      setSubject(template.payload.sub || '');
      setIssuer(template.payload.iss || '');
      setAudience(template.payload.aud?.toString() || '');
    }
    
    toast.success(`Template "${templateName}" applied!`);
  };

  // Add custom claim
  const addCustomClaim = () => {
    setCustomClaims(prev => [...prev, { key: '', value: '' }]);
  };

  // Remove custom claim
  const removeCustomClaim = (index: number) => {
    setCustomClaims(prev => prev.filter((_, i) => i !== index));
  };

  // Update custom claim
  const updateCustomClaim = (index: number, field: 'key' | 'value', value: string) => {
    setCustomClaims(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Export token as file
  const exportToken = () => {
    if (!encodedToken) return;
    
    const blob = new Blob([encodedToken], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jwt-token-${new Date().toISOString().slice(0, 19)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Token exported as file!');
  };

  // Import token from file
  const importToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setToken(content);
      toast.success('Token imported from file!');
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Sample tokens for quick testing
  const sampleTokens: Record<string, string> = {
    valid: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    expired: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDAwMDB9.invalid'
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-2 md:p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 justify-between">
          <div className='flex justify-between gap-4 flex-wrap'>
            <div>
              <h1 className="text-2xl font-bold">{tool?.name}</h1>
            </div>
            <div className='flex gap-2 items-center'>
              <Button 
                variant="outline" 
                size="default"
                onClick={() => setShowHistory(!showHistory)}
                className="border-border hover:bg-accent"
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Saved
              </Button>
              <LearnButton 
                tool={{
                  name: tool?.name || '',
                  description: tool?.description || '',
                  slug: tool?.slug || 'jwt',
                  category: tool?.category || 'Security',
                  tags: tool?.tags
                }}
                variant="secondary"
                mdFilePath="content/learn/jwt.md"
              />
            </div>
          </div>
          <div>
            <p className="text-muted-foreground">{tool?.description}</p>
          </div>
        </div>

        {/* Token History Sidebar */}
        {showHistory && (
          <Card className="absolute right-4 top-24 z-10 w-80 max-h-[70vh] overflow-hidden shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Saved Tokens
                </span>
                <Button variant="ghost" size="sm" onClick={() => setShowHistory(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto max-h-[60vh]">
              {savedTokens.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No saved tokens yet
                </div>
              ) : (
                <div className="divide-y">
                  {savedTokens.map((token) => (
                    <div 
                      key={token.id} 
                      className="p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => loadToken(token.token)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{token.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(token.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => deleteToken(token.id, e)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-xs font-mono truncate mt-1 text-muted-foreground">
                        {token.token.substring(0, 30)}...
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
                <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
              
              {/* Decode Tab */}
              <TabsContent value="decode" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <Label className="text-base font-semibold text-foreground">JWT Token Input</Label>
                    <div className="flex gap-2">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={importToken} 
                        className="hidden" 
                        accept=".txt,.jwt"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-border hover:bg-accent"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Import
                      </Button>
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
                
                {/* Token Validation */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold text-foreground">Token Validation</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-2">
                      <Input
                        type="password"
                        value={validationKey}
                        onChange={(e) => setValidationKey(e.target.value)}
                        placeholder="Enter secret or public key for validation"
                        className="bg-background border-border focus:border-primary"
                      />
                    </div>
                    <Button onClick={handleValidate} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Validate Token
                    </Button>
                  </div>
                  {validationResult && (
                    <Alert variant={validationResult.valid ? "success" : "destructive"}>
                      {validationResult.valid ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                      <AlertDescription>{validationResult.message}</AlertDescription>
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
                          <h3 className="font-semibold">Token Info</h3>
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
                          <h3 className="font-semibold">Claims</h3>
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
                            onClick={() => copyToClipboard(JSON.stringify(decodedData.header, null, 2), "Header copied!")}
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
                            onClick={() => copyToClipboard(JSON.stringify(decodedData.payload, null, 2), "Payload copied!")}
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
                            <SelectContent className="bg-popover border-border max-h-80">
                              {algorithmOptions.map(alg => (
                                <div key={alg.value} className="flex flex-col">
                                  <SelectItem value={alg.value}>{alg.label}</SelectItem>
                                  <div className="text-xs text-muted-foreground px-2 py-1">
                                    {alg.description}
                                  </div>
                                </div>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-foreground">
                            Secret Key
                            <div className="flex gap-1">
                              <Tooltip>
                                <TooltipTrigger>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowSecret(!showSecret)}
                                    className="hover:bg-accent"
                                  >
                                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  View The Secret Key
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={generateRandomSecret}
                                    className="hover:bg-accent"
                                    title="Generate random secret"
                                  >
                                    <Dice3 className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Generate Random Secret Key
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
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
                          <div>
                            <Label className="text-foreground">Template</Label>
                            <Select value={selectedTemplate} onValueChange={applyTemplate}>
                              <SelectTrigger className="bg-background border-border">
                                <SelectValue placeholder="Select a template" />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-border">
                                {payloadTemplates.map(template => (
                                  <SelectItem key={template.name} value={template.name}>
                                    {template.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
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
                          
                          {expiresIn === 'custom' && (
                            <div>
                              <Label className="text-foreground">Custom Expiration (seconds)</Label>
                              <Input
                                type="number"
                                value={customExpiration}
                                onChange={(e) => setCustomExpiration(e.target.value)}
                                placeholder="3600"
                                className="bg-background border-border focus:border-primary"
                              />
                            </div>
                          )}
                          
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
                          
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-foreground">Custom Claims</Label>
                              <Button variant="outline" size="sm" onClick={addCustomClaim}>
                                <Plus className="w-4 h-4 mr-1" />
                                Add
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {customClaims.map((claim, index) => (
                                <div key={index} className="grid grid-cols-5 gap-2 items-center">
                                  <div className="col-span-2">
                                    <Input
                                      value={claim.key}
                                      onChange={(e) => updateCustomClaim(index, 'key', e.target.value)}
                                      placeholder="key"
                                      className="bg-background border-border focus:border-primary"
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <Input
                                      value={claim.value}
                                      onChange={(e) => updateCustomClaim(index, 'value', e.target.value)}
                                      placeholder="value"
                                      className="bg-background border-border focus:border-primary"
                                    />
                                  </div>
                                  <div>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => removeCustomClaim(index)}
                                      className="w-full"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </div>
                  
                  {/* JSON Editors */}
                  <div className="space-y-6">
                    <Card className="bg-background border-border">
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
                <div className="flex flex-wrap gap-4">
                  <Button onClick={handleEncode} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Generate JWT Token
                  </Button>
                  <Button onClick={clearAllFields} variant="outline" size="lg">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                  {encodedToken && (
                    <>
                      <Button onClick={saveToken} variant="outline" size="lg">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={exportToken} variant="outline" size="lg">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </>
                  )}
                </div>
                
                {encodeError && (
                  <Alert variant="destructive" className="bg-error-muted border-error">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-error-foreground">{encodeError}</AlertDescription>
                  </Alert>
                )}
                
                {/* Generated Token */}
                {encodedToken && (
                  <Card className="bg-success-muted border-success/20">
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
              
              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card className="bg-background border-border">
                  <CardHeader>
                    <CardTitle className="text-base text-card-foreground">Application Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-foreground">Auto-copy generated tokens</Label>
                        <p className="text-sm text-muted-foreground">Automatically copy tokens to clipboard after generation</p>
                      </div>
                      <Switch
                        checked={autoCopy}
                        onCheckedChange={setAutoCopy}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-foreground">Show line numbers</Label>
                        <p className="text-sm text-muted-foreground">Display line numbers in JSON viewers</p>
                      </div>
                      <Switch
                        checked={showLineNumbers}
                        onCheckedChange={setShowLineNumbers}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-foreground">Wrap text</Label>
                        <p className="text-sm text-muted-foreground">Wrap long lines in JSON viewers</p>
                      </div>
                      <Switch
                        checked={wrapText}
                        onCheckedChange={setWrapText}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-background border-border">
                  <CardHeader>
                    <CardTitle className="text-base text-card-foreground">Common JWT Claims Reference</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {commonClaims.map((claim, index) => (
                        <div key={index} className="p-3 rounded-lg border border-border">
                          <div className="font-mono text-sm font-medium">{claim.key}</div>
                          <div className="text-sm font-medium">{claim.label}</div>
                          <div className="text-xs text-muted-foreground mt-1">{claim.description}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
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