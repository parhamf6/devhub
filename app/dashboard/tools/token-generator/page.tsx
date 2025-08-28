'use client';
import { useEffect, useState, useRef } from 'react';
import type { TokenOptions } from '@/lib/tools/tool/token-generator';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, Info, RefreshCcw, Download, History, Settings, BarChart2, Shield, Clock } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import tokenGenerator from '@/lib/tools/tool/token-generator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LearnButton } from '@/features/dashboard/tools/components/learn-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const tool = tokenGenerator;

interface TokenHistoryItem {
    token: string;
    timestamp: Date;
    options: TokenOptions;
}

interface TokenMetadata {
    entropy: number;
    characterDistribution: Record<string, number>;
    estimatedCrackTime: string;
}

export default function TokenGeneratorPage() {
    const [options, setOptions] = useState<TokenOptions>({
        length: 16,
        useLower: true,
        useUpper: true,
        useNumber: true,
        useSymbol: false,
    });
    const [token, setToken] = useState('');
    const [tokenHistory, setTokenHistory] = useState<TokenHistoryItem[]>([]);
    const [customPattern, setCustomPattern] = useState('');
    const [useCustomPattern, setUseCustomPattern] = useState(false);
    const [customCharSet, setCustomCharSet] = useState('');
    const [useCustomCharSet, setUseCustomCharSet] = useState(false);
    const [bulkCount, setBulkCount] = useState(1);
    const [bulkTokens, setBulkTokens] = useState<string[]>([]);
    const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | null>(null);
    const [encoding, setEncoding] = useState<'none' | 'base64' | 'hex'>('none');
    const [expiration, setExpiration] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState('single');
    
    const tokenRef = useRef<HTMLDivElement>(null);

    const calculateTokenStrength = (token: string): number => {
        if (!token) return 0;
        
        let strength = 0;
        const hasLower = /[a-z]/.test(token);
        const hasUpper = /[A-Z]/.test(token);
        const hasNumber = /[0-9]/.test(token);
        const hasSymbol = /[^a-zA-Z0-9]/.test(token);
        
        // Character variety contributes to strength
        strength += hasLower ? 25 : 0;
        strength += hasUpper ? 25 : 0;
        strength += hasNumber ? 25 : 0;
        strength += hasSymbol ? 25 : 0;
        
        // Length also contributes
        strength = Math.min(100, strength + (token.length / 64) * 25);
        
        return strength;
    };

    const calculateTokenMetadata = (token: string): TokenMetadata => {
        // Calculate entropy (simplified)
        const charSetSize = 
            (options.useLower ? 26 : 0) +
            (options.useUpper ? 26 : 0) +
            (options.useNumber ? 10 : 0) +
            (options.useSymbol ? 32 : 0);
        
        const entropy = token.length * Math.log2(charSetSize);
        
        // Character distribution
        const charCount: Record<string, number> = {};
        for (const char of token) {
            charCount[char] = (charCount[char] || 0) + 1;
        }
        
        // Estimated crack time (very simplified)
        let estimatedCrackTime = "Instant";
        if (entropy > 40) estimatedCrackTime = "Seconds";
        if (entropy > 60) estimatedCrackTime = "Minutes";
        if (entropy > 80) estimatedCrackTime = "Hours";
        if (entropy > 100) estimatedCrackTime = "Days";
        if (entropy > 120) estimatedCrackTime = "Years";
        if (entropy > 140) estimatedCrackTime = "Centuries";
        
        return {
            entropy,
            characterDistribution: charCount,
            estimatedCrackTime
        };
    };

    const generate = () => {
        if (tool?.generate) {
            let result = tool.generate(options) as string;
            
            // Apply custom pattern if specified
            if (useCustomPattern && customPattern) {
                // Simple pattern replacement - X for random characters
                let patternResult = '';
                let charIndex = 0;
                
                for (const char of customPattern) {
                    if (char === 'X' && charIndex < result.length) {
                        patternResult += result[charIndex];
                        charIndex++;
                    } else {
                        patternResult += char;
                    }
                }
                
                result = patternResult;
            }
            
            // Apply encoding if specified
            if (encoding === 'base64') {
                result = btoa(result);
            } else if (encoding === 'hex') {
                result = Array.from(new TextEncoder().encode(result))
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('');
            }
            
            setToken(result);
            setTokenMetadata(calculateTokenMetadata(result));
            
            // Add to history
            const historyItem: TokenHistoryItem = {
                token: result,
                timestamp: new Date(),
                options: { ...options }
            };
            
            setTokenHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10
        }
    };

    const generateBulk = () => {
        const tokens: string[] = [];
        for (let i = 0; i < bulkCount; i++) {
            if (tool?.generate) {
                let result = tool.generate(options) as string;
                
                // Apply custom pattern if specified
                if (useCustomPattern && customPattern) {
                    let patternResult = '';
                    let charIndex = 0;
                    
                    for (const char of customPattern) {
                        if (char === 'X' && charIndex < result.length) {
                            patternResult += result[charIndex];
                            charIndex++;
                        } else {
                            patternResult += char;
                        }
                    }
                    
                    result = patternResult;
                }
                
                // Apply encoding if specified
                if (encoding === 'base64') {
                    result = btoa(result);
                } else if (encoding === 'hex') {
                    result = Array.from(new TextEncoder().encode(result))
                        .map(b => b.toString(16).padStart(2, '0'))
                        .join('');
                }
                
                tokens.push(result);
            }
        }
        
        setBulkTokens(tokens);
    };

    useEffect(() => {
        if (activeTab === 'single') {
            generate();
        }
    }, [options, customPattern, useCustomPattern, encoding, activeTab]);

    const handleCopy = () => {
        navigator.clipboard.writeText(token);
        toast.success('Token copied to clipboard!');
    };

    const handleCopyBulk = () => {
        const text = bulkTokens.join('\n');
        navigator.clipboard.writeText(text);
        toast.success('Bulk tokens copied to clipboard!');
    };

    const handleExport = (format: 'json' | 'csv' | 'txt') => {
        let content = '';
        let filename = '';
        let mimeType = '';
        
        if (format === 'json') {
            content = JSON.stringify({
                tokens: activeTab === 'single' ? [token] : bulkTokens,
                options,
                generatedAt: new Date().toISOString(),
                expiration: expiration ? new Date(Date.now() + expiration * 60000).toISOString() : null
            }, null, 2);
            filename = 'tokens.json';
            mimeType = 'application/json';
        } else if (format === 'csv') {
            const tokensToExport = activeTab === 'single' ? [token] : bulkTokens;
            content = 'Token,Generated At,Expires At\n';
            tokensToExport.forEach(t => {
                content += `"${t}",${new Date().toISOString()},${expiration ? new Date(Date.now() + expiration * 60000).toISOString() : 'Never'}\n`;
            });
            filename = 'tokens.csv';
            mimeType = 'text/csv';
        } else if (format === 'txt') {
            content = activeTab === 'single' ? token : bulkTokens.join('\n');
            filename = 'tokens.txt';
            mimeType = 'text/plain';
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
        
        toast.success(`Tokens exported as ${filename}`);
    };

    const handleUseHistoryToken = (historyToken: string) => {
        setToken(historyToken);
        setTokenMetadata(calculateTokenMetadata(historyToken));
        setActiveTab('single');
    };

    const getStrengthColor = (strength: number) => {
        if (strength < 30) return 'bg-red-500';
        if (strength < 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getStrengthLabel = (strength: number) => {
        if (strength < 30) return 'Weak';
        if (strength < 70) return 'Medium';
        return 'Strong';
    };

    return (
        <div className="flex flex-col justify-center mx-auto p-2 md:p-8 space-y-8">
            <div className="flex flex-col gap-4 justify-between">
                <div className='flex justify-between gap-4 flex-wrap'>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            {tool?.name}
                        </h1>
                    </div>
                    
                    <div className='flex gap-2 items-center'>
                        
                        
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="icon" variant="outline">
                                    <Settings className="w-4 h-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Advanced Settings</DialogTitle>
                                    <DialogDescription>
                                        Configure advanced options for token generation
                                    </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="customPattern"
                                            checked={useCustomPattern}
                                            onCheckedChange={(checked) => setUseCustomPattern(Boolean(checked))}
                                        />
                                        <Label htmlFor="customPattern">Use Custom Pattern</Label>
                                    </div>
                                    
                                    {useCustomPattern && (
                                        <div className="space-y-2">
                                            <Label htmlFor="patternInput">Pattern (use X for random characters)</Label>
                                            <Input
                                                id="patternInput"
                                                placeholder="XXXX-XXXX-XXXX"
                                                value={customPattern}
                                                onChange={(e) => setCustomPattern(e.target.value)}
                                            />
                                            <p className="text-sm text-muted-foreground">
                                                Example: XXXX-XXXX-XXXX will generate tokens like a1b2-c3d4-e5f6
                                            </p>
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="customCharSet"
                                            checked={useCustomCharSet}
                                            onCheckedChange={(checked) => setUseCustomCharSet(Boolean(checked))}
                                        />
                                        <Label htmlFor="customCharSet">Use Custom Character Set</Label>
                                    </div>
                                    
                                    {useCustomCharSet && (
                                        <div className="space-y-2">
                                            <Label htmlFor="charSetInput">Custom Character Set</Label>
                                            <Input
                                                id="charSetInput"
                                                placeholder="ABCDEF123456!@#$%"
                                                value={customCharSet}
                                                onChange={(e) => setCustomCharSet(e.target.value)}
                                            />
                                            <p className="text-sm text-muted-foreground">
                                                Enter characters to use for token generation. This will override the character type options.
                                            </p>
                                        </div>
                                    )}
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="encoding">Encoding</Label>
                                        <Select value={encoding} onValueChange={(value: 'none' | 'base64' | 'hex') => setEncoding(value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select encoding" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                <SelectItem value="base64">Base64</SelectItem>
                                                <SelectItem value="hex">Hexadecimal</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="expiration">Token Expiration (minutes)</Label>
                                        <Input
                                            id="expiration"
                                            type="number"
                                            placeholder="Leave empty for no expiration"
                                            value={expiration || ''}
                                            onChange={(e) => setExpiration(e.target.value ? parseInt(e.target.value) : null)}
                                        />
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                        
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="icon" variant="outline">
                                    <History className="w-4 h-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Token History</DialogTitle>
                                    <DialogDescription>
                                        Your recently generated tokens (only single generation)
                                    </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {tokenHistory.length === 0 ? (
                                        <p className="text-muted-foreground text-center py-4">No token history yet</p>
                                    ) : (
                                        tokenHistory.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                                                <div className="font-mono text-sm truncate max-w-[200px]">{item.token}</div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground">
                                                        {item.timestamp.toLocaleTimeString()}
                                                    </span>
                                                    <Button size="sm" variant="ghost" onClick={() => handleUseHistoryToken(item.token)}>
                                                        Use
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                        <LearnButton 
                            tool={{
                                name: tool?.name || '',
                                description: tool?.description || '',
                                slug: tool?.slug || 'token-generator',
                                category: tool?.category || 'Security',
                                tags: tool?.tags
                            }}
                            variant="secondary"
                            mdFilePath="content/learn/token-generator.md"
                        />
                    </div>
                </div>
                <div>
                    <p className="text-muted-foreground">{tool?.description}</p>
                </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="single">Single Token</TabsTrigger>
                    <TabsTrigger value="bulk">Bulk Generation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="single" className="space-y-4">
                    <div className='flex flex-col gap-4 mt-2'>
                        <div className="flex justify-between items-center">
                            <Label className="font-medium">Token Length: {options.length}</Label>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Strength:</span>
                                <Badge variant={calculateTokenStrength(token) < 70 ? "destructive" : "default"}>
                                    {getStrengthLabel(calculateTokenStrength(token))}
                                </Badge>
                            </div>
                        </div>
                        <Slider
                            min={4}
                            max={64}
                            step={1}
                            value={[options.length]}
                            className='mb-2'
                            onValueChange={([val]) => setOptions((prev) => ({ ...prev, length: val }))}
                        />
                        <Progress value={calculateTokenStrength(token)} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Lowercase (a-z)', key: 'useLower' },
                            { label: 'Uppercase (A-Z)', key: 'useUpper' },
                            { label: 'Numbers (0-9)', key: 'useNumber' },
                            { label: 'Symbols (!@#$%)', key: 'useSymbol' },
                        ].map(({ label, key }) => (
                            <div key={key} className="flex items-center gap-2 mt-2">
                                <Checkbox
                                    id={key}
                                    checked={options[key as keyof TokenOptions]}
                                    onCheckedChange={(checked) =>
                                        setOptions((prev) => ({
                                            ...prev,
                                            [key]: Boolean(checked),
                                        }))
                                    }
                                    disabled={useCustomCharSet}
                                />
                                <Label htmlFor={key} className={useCustomCharSet ? "text-muted-foreground" : ""}>{label}</Label>
                            </div>
                        ))}
                    </div>
                    
                    <Card className="relative w-full overflow-x-scroll sm:overflow-hidden flex items-center justify-between gap-2 p-4 font-mono text-sm">
                        <div className="flex gap-1 shrink-0">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size="icon" variant="ghost" onClick={generate}>
                                        <RefreshCcw className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Generate New Token</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size="icon" variant="ghost" onClick={handleCopy}>
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Copy Token</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size="icon" variant="ghost" onClick={() => handleExport('txt')}>
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Export Token</TooltipContent>
                            </Tooltip>
                        </div>
                        <div ref={tokenRef} className="break-words text-wrap">
                            {token || 'Please select at least one character type'}
                        </div>
                    </Card>
                    
                    {tokenMetadata && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <BarChart2 className="w-5 h-5" />
                                    Token Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Entropy</p>
                                        <p className="font-medium">{tokenMetadata.entropy.toFixed(2)} bits</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Character Count</p>
                                        <p className="font-medium">{token.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Estimated Crack Time</p>
                                        <p className="font-medium">{tokenMetadata.estimatedCrackTime}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Expires</p>
                                        <p className="font-medium">
                                            {expiration ? `${expiration} min` : 'Never'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
                
                <TabsContent value="bulk" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                        <div className='flex flex-col gap-2'>
                            <Label className="font-medium">Number of Tokens: {bulkCount}</Label>
                            <Slider
                                min={1}
                                max={100}
                                step={1}
                                value={[bulkCount]}
                                onValueChange={([val]) => setBulkCount(val)}
                            />
                        </div>
                        
                        <div className='flex flex-col gap-2'>
                            <Label className="font-medium">Token Length: {options.length}</Label>
                            <Slider
                                min={4}
                                max={64}
                                step={1}
                                value={[options.length]}
                                onValueChange={([val]) => setOptions((prev) => ({ ...prev, length: val }))}
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Lowercase (a-z)', key: 'useLower' },
                            { label: 'Uppercase (A-Z)', key: 'useUpper' },
                            { label: 'Numbers (0-9)', key: 'useNumber' },
                            { label: 'Symbols (!@#$%)', key: 'useSymbol' },
                        ].map(({ label, key }) => (
                            <div key={key} className="flex items-center gap-2 mt-2">
                                <Checkbox
                                    id={`bulk-${key}`}
                                    checked={options[key as keyof TokenOptions]}
                                    onCheckedChange={(checked) =>
                                        setOptions((prev) => ({
                                            ...prev,
                                            [key]: Boolean(checked),
                                        }))
                                    }
                                    disabled={useCustomCharSet}
                                />
                                <Label htmlFor={`bulk-${key}`} className={useCustomCharSet ? "text-muted-foreground" : ""}>{label}</Label>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 justify-between mt-8">
                        <Button onClick={generateBulk} className="flex items-center gap-2">
                            <RefreshCcw className="w-4 h-4" />
                            Generate {bulkCount} Tokens
                        </Button>
                        
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleCopyBulk} disabled={bulkTokens.length === 0}>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy All
                            </Button>
                            
                            <div className="flex gap-1">
                                <Button size="sm" variant="outline" onClick={() => handleExport('json')} disabled={bulkTokens.length === 0}>
                                    JSON
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleExport('csv')} disabled={bulkTokens.length === 0}>
                                    CSV
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleExport('txt')} disabled={bulkTokens.length === 0}>
                                    TXT
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    {bulkTokens.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Generated Tokens ({bulkTokens.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea 
                                    value={bulkTokens.join('\n')} 
                                    readOnly 
                                    className="min-h-[200px] font-mono text-sm"
                                />
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}