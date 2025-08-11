'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Copy, Download, Shield, Check, AlertCircle, Trash2, Clock, Info, Eye, EyeOff, RefreshCw, Lock, Unlock, Hash, Settings } from 'lucide-react';
import bcrypt from 'bcryptjs';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LearnButton } from '@/features/dashboard/tools/components/learn-button';
import { toast } from 'sonner';

const tool = {
  name: "Bcrypt Generator",
  description: "Advanced bcrypt password hashing and verification tool with customizable security levels.",
  slug: "bcrypt-generator",
  category: "Security",
  tags: ["Security", "Password", "Hashing", "Bcrypt", "Authentication"]
};

const BcryptGenerator = () => {
  const [activeTab, setActiveTab] = useState('generate');
  
  // Generate states
  const [password, setPassword] = useState('');
  const [rounds, setRounds] = useState(10);
  const [salt, setSalt] = useState('');
  const [hash, setHash] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(false);
  
  // Verify states
  const [verifyPassword, setVerifyPassword] = useState('');
  const [verifyHash, setVerifyHash] = useState('');
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  
  // Common states
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Generate bcrypt hash
  const generateHash = useCallback(async () => {
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Generate salt if not provided
      const saltToUse = salt || await bcrypt.genSalt(rounds);
      const hashedPassword = await bcrypt.hash(password, saltToUse);
      setHash(hashedPassword);
      toast.success("Hash generated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate hash');
    } finally {
      setIsGenerating(false);
    }
  }, [password, rounds, salt]);

  // Verify password against hash
  const verifyPasswordHash = useCallback(async () => {
    if (!verifyPassword.trim() || !verifyHash.trim()) {
      setError('Both password and hash are required for verification');
      return;
    }
    
    setIsVerifying(true);
    setError(null);
    
    try {
      const result = await bcrypt.compare(verifyPassword, verifyHash);
      setVerifyResult(result);
      toast.success(result ? "Password matches!" : "Password does not match!");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify password');
    } finally {
      setIsVerifying(false);
    }
  }, [verifyPassword, verifyHash]);

  // Generate random salt
  const generateRandomSalt = useCallback(async () => {
    try {
      const newSalt = await bcrypt.genSalt(rounds);
      setSalt(newSalt);
      toast.success("Random salt generated");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate salt');
    }
  }, [rounds]);

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard");
    } catch {
      setError('Failed to copy to clipboard');
    }
  };

  // Download hash
  const downloadHash = () => {
    const blob = new Blob([hash], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bcrypt_hash.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Hash file downloaded");
  };

  // Clear all
  const clearAll = () => {
    setPassword('');
    setHash('');
    setVerifyPassword('');
    setVerifyHash('');
    setVerifyResult(null);
    setError(null);
    setSalt('');
  };

  // Auto-generate on input change
  useEffect(() => {
    if (autoGenerate && password) {
      const timer = setTimeout(() => {
        generateHash();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [password, rounds, salt, autoGenerate, generateHash]);

  // Security level based on rounds
  const getSecurityLevel = () => {
    if (rounds < 8) return { level: 'Low', color: 'text-red-600', description: 'Not recommended for production' };
    if (rounds < 10) return { level: 'Medium', color: 'text-orange-500', description: 'Minimum acceptable for low-security applications' };
    if (rounds < 12) return { level: 'Good', color: 'text-yellow-500', description: 'Recommended for most applications' };
    if (rounds < 14) return { level: 'Strong', color: 'text-green-500', description: 'High security, recommended for sensitive data' };
    return { level: 'Very Strong', color: 'text-emerald-600', description: 'Maximum security, may impact performance' };
  };

  const securityLevel = getSecurityLevel();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6 space-y-8">
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
                mdFilePath="content/learn/bcrypt-generator.md"
              />
            </div>
          </div>
          <div>
            <p className="text-muted-foreground">{tool.description}</p>
          </div>
        </div>

        {/* Main Tool */}
        <Card className="shadow-lg bg-background border-border">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="generate" className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Generate Hash
                </TabsTrigger>
                <TabsTrigger value="verify" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Verify Password
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="generate" className="space-y-6">
                {/* Password Input */}
                <div className="bg-card rounded-lg border shadow-sm p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold text-card-foreground">Password</h2>
                    <div className="flex gap-2">
                      {password && (
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
                  
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password to hash"
                      className="pr-10"
                      autoComplete="off"
                      autoFocus
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Lock className="h-4 w-4" />
                      {password.length} characters
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date().toLocaleTimeString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={autoGenerate}
                        onChange={(e) => setAutoGenerate(e.target.checked)}
                        id="auto-generate"
                        className="mr-1"
                      />
                      <label htmlFor="auto-generate">Auto-generate</label>
                    </span>
                    {!autoGenerate && (
                      <Button onClick={generateHash} size="sm" disabled={isGenerating}>
                        {isGenerating ? 'Generating...' : 'Generate Hash'}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Security Settings */}
                <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    <h2 className="text-lg font-semibold text-card-foreground">Security Settings</h2>
                  </div>
                  
                  {/* Rounds Slider */}
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Rounds (Cost Factor)</span>
                      <span className={cn("text-sm font-medium", securityLevel.color)}>
                        {securityLevel.level}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="4"
                        max="16"
                        value={rounds}
                        onChange={(e) => setRounds(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>4 (Fast)</span>
                        <span>10 (Recommended)</span>
                        <span>16 (Slow)</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {securityLevel.description}
                    </div>
                  </div>
                  
                  {/* Salt Input */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Salt</span>
                      <Button 
                        onClick={generateRandomSalt} 
                        variant="outline" 
                        size="sm"
                        className="gap-1"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Generate Random
                      </Button>
                    </div>
                    
                    <Input
                      value={salt}
                      onChange={(e) => setSalt(e.target.value)}
                      placeholder="Auto-generated if empty"
                      className="font-mono text-sm"
                    />
                    <div className="text-xs text-muted-foreground">
                      Leave empty to auto-generate a unique salt for each password
                    </div>
                  </div>
                </div>

                {/* Generated Hash */}
                {hash && (
                  <div className="bg-card rounded-lg border shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-card-foreground">Generated Hash</h2>
                      <Button
                        onClick={downloadHash}
                        variant="secondary"
                        size="sm"
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm bg-background rounded p-3 border break-all select-all">
                          {hash}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Rounds: {rounds}</span>
                          <span>Length: {hash.length} chars</span>
                          <span>Algorithm: bcrypt</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => copyToClipboard(hash)}
                              variant="secondary"
                              size="icon"
                            >
                              {copied ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy hash</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="verify" className="space-y-6">
                <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <h2 className="text-lg font-semibold text-card-foreground">Verify Password</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <label className="text-sm font-medium mb-2 block">Password</label>
                      <Input
                        type={showVerifyPassword ? "text" : "password"}
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                        placeholder="Enter password to verify"
                        className="pr-10"
                        autoComplete="off"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-8 h-full px-3"
                        onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                      >
                        {showVerifyPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Bcrypt Hash</label>
                      <Input
                        value={verifyHash}
                        onChange={(e) => setVerifyHash(e.target.value)}
                        placeholder="Enter bcrypt hash to verify against"
                        className="font-mono"
                      />
                    </div>
                    
                    <Button 
                      onClick={verifyPasswordHash} 
                      disabled={isVerifying} 
                      className="w-full"
                    >
                      {isVerifying ? 'Verifying...' : 'Verify Password'}
                    </Button>
                    
                    {verifyResult !== null && (
                      <div className={cn(
                        "rounded p-4 text-sm flex items-center gap-2",
                        verifyResult ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      )}>
                        {verifyResult ? 
                          <><Check className="h-4 w-4" /> Password matches the hash!</> : 
                          <><AlertCircle className="h-4 w-4" /> Password does not match the hash.</>
                        }
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Error Display */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        <Card>
          <CardHeader>
            <CardTitle>
              <h3 className="font-semibold text-foreground">About Bcrypt</h3>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 rounded-lg p-4 space-y-4">
              <p className="text-sm">
                Bcrypt is a password hashing function designed to be slow and computationally expensive, 
                making it resistant to brute-force attacks. It incorporates a salt to protect against 
                rainbow table attacks and allows you to adjust the cost factor (rounds) to increase 
                security as computing power improves.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-blue-700 mb-1">Security Benefits</div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Adaptive cost factor</li>
                    <li>Built-in salt protection</li>
                    <li>Resistant to GPU attacks</li>
                    <li>Widely vetted and trusted</li>
                  </ul>
                </div>
                <div>
                  <div className="font-medium text-purple-700 mb-1">Best Practices</div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use at least 10 rounds</li>
                    <li>Never store plaintext passwords</li>
                    <li>Use unique salts for each password</li>
                    <li>Combine with other security measures</li>
                  </ul>
                </div>
              </div>
            </div>
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
            <p>• <strong>Always use bcrypt</strong> for password hashing, not fast hashes like MD5 or SHA.</p>
            <p>• <strong>Use sufficient rounds</strong> - start with 10 and adjust based on your server performance.</p>
            <p>• <strong>Never expose plaintext passwords</strong> in logs, error messages, or client-side code.</p>
            <p>• <strong>Implement rate limiting</strong> on authentication endpoints to prevent brute-force attacks.</p>
            <p>• <strong>Combine with multi-factor authentication</strong> for enhanced security.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BcryptGenerator;