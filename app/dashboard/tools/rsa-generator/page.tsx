'use client';

import React, { useState, useRef, useCallback } from 'react';
import { rsaGenerator, generateRSAKeyPair, RSAKeyPair, RSAKeyOptions, RSAHistoryItem, validateKeySize, formatKeyForDisplay, getKeyStrengthRating } from '@/lib/tools/tool/rsa-generator';
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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Copy, Plus, Trash2, Upload, Download, Save, FolderOpen, 
  Settings, Zap, Code, Eye, EyeOff, History, Star, 
  Globe, Lock, Unlock, Clock, FileText, 
  RefreshCw, PlayCircle, Bookmark, BookmarkCheck,
  ChevronDown, ChevronRight, AlertCircle, CheckCircle2,
  Lightbulb, Terminal, FileCode, Import, Shield, Key,
  Fingerprint, BarChart2, Info
} from 'lucide-react';
import { LearnButton } from '@/features/dashboard/tools/components/learn-button';

const KEY_SIZES = [
  { value: 1024, label: '1024 bits', description: 'Legacy - Not recommended' },
  { value: 2048, label: '2048 bits', description: 'Standard - Good security' },
  { value: 3072, label: '3072 bits', description: 'Strong - Better security' },
  { value: 4096, label: '4096 bits', description: 'Excellent - Maximum security' }
];

const DEFAULT_OPTIONS: RSAKeyOptions = {
  keySize: 2048,
  format: 'PEM',
  passphrase: '',
  comment: 'user@hostname'
};

const SECURITY_LEVELS = [
  { 
    level: 'Basic', 
    description: 'Suitable for development environments',
    minKeySize: 1024,
    color: 'bg-blue-500'
  },
  { 
    level: 'Standard', 
    description: 'Recommended for most applications',
    minKeySize: 2048,
    color: 'bg-green-500'
  },
  { 
    level: 'High', 
    description: 'For sensitive data and production systems',
    minKeySize: 3072,
    color: 'bg-yellow-500'
  },
  { 
    level: 'Maximum', 
    description: 'For critical infrastructure and long-term security',
    minKeySize: 4096,
    color: 'bg-red-500'
  }
];

export default function RSAGeneratorPage() {
  const [options, setOptions] = useState<RSAKeyOptions>(DEFAULT_OPTIONS);
  const [keyPair, setKeyPair] = useState<RSAKeyPair | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showPublicKey, setShowPublicKey] = useState(true);
  const [showSSHKey, setShowSSHKey] = useState(true);
  const [activeTab, setActiveTab] = useState('generate');
  const [savedKeys, setSavedKeys] = useState<RSAHistoryItem[]>([]);
  const [currentKeyName, setCurrentKeyName] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    options: true,
    privateKey: false,
    publicKey: true,
    sshKey: true,
    fingerprint: true
  });

  // Generate RSA key pair
  const handleGenerate = useCallback(async () => {
    if (!validateKeySize(options.keySize)) {
      toast.error('Invalid key size selected');
      return;
    }

    setIsGenerating(true);
    try {
      const generatedKeyPair = await generateRSAKeyPair(options);
      setKeyPair(generatedKeyPair);
      toast.success('RSA key pair generated successfully');
    } catch (error) {
      toast.error('Failed to generate RSA key pair');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }, [options]);

  // Copy to clipboard
  const handleCopy = useCallback((text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  }, []);

  // Save key pair
  const saveKeyPair = useCallback(() => {
    if (!keyPair || !currentKeyName.trim()) {
      toast.error('Please enter a name for the key pair');
      return;
    }

    const newSavedKey: RSAHistoryItem = {
      id: generateKeyId(),
      name: currentKeyName,
      keyPair: { ...keyPair },
      createdAt: new Date(),
      starred: false
    };

    setSavedKeys(prev => [...prev, newSavedKey]);
    setCurrentKeyName('');
    toast.success('Key pair saved successfully');
  }, [keyPair, currentKeyName]);

  // Load saved key pair
  const loadKeyPair = useCallback((savedKey: RSAHistoryItem) => {
    setKeyPair(savedKey.keyPair);
    setOptions(prev => ({ ...prev, keySize: savedKey.keyPair.keySize }));
    toast.success(`Loaded key pair: ${savedKey.name}`);
  }, []);

  // Delete saved key pair
  const deleteKeyPair = useCallback((id: string) => {
    setSavedKeys(prev => prev.filter(key => key.id !== id));
    toast.success('Key pair deleted');
  }, []);

  // Toggle star status
  const toggleStar = useCallback((id: string) => {
    setSavedKeys(prev => 
      prev.map(key => 
        key.id === id ? { ...key, starred: !key.starred } : key
      )
    );
  }, []);

  // Export key pair
  const exportKeyPair = useCallback(() => {
    if (!keyPair) return;

    const data = JSON.stringify({
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey,
      publicKeySSH: keyPair.publicKeySSH,
      keySize: keyPair.keySize
    }, null, 2);

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rsa-key-pair.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Key pair exported');
  }, [keyPair]);

  // Import key pair
  const importKeyPair = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (imported.privateKey && imported.publicKey && imported.keySize) {
          setKeyPair({
            privateKey: imported.privateKey,
            publicKey: imported.publicKey,
            publicKeySSH: imported.publicKeySSH || '',
            fingerprint: imported.fingerprint || '',
            keySize: imported.keySize
          });
          setOptions(prev => ({ ...prev, keySize: imported.keySize }));
          toast.success('Key pair imported successfully');
        } else {
          toast.error('Invalid key pair file');
        }
      } catch (error) {
        toast.error('Failed to import key pair');
        console.error(error);
      }
    };
    reader.readAsText(file);
  }, []);

  // Reset form
  const handleReset = useCallback(() => {
    setOptions(DEFAULT_OPTIONS);
    setKeyPair(null);
    setCurrentKeyName('');
    toast.success('Form reset');
  }, []);

  // Toggle section visibility
  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  // Handle option change
  const handleOptionChange = useCallback((key: keyof RSAKeyOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  }, []);

  const keyStrength = keyPair ? getKeyStrengthRating(keyPair.keySize) : null;

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col flex-wrap gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">{rsaGenerator.name}</h1>
              <p className="text-muted-foreground">{rsaGenerator.description}</p>
            </div>
            <LearnButton
              tool={{
                name: rsaGenerator.name,
                description: rsaGenerator.description,
                slug: rsaGenerator.slug,
                category: rsaGenerator.category,
                tags: rsaGenerator.tags,
              }}
              variant="secondary"
              mdFilePath="content/learn/rsa-generator.md"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" onClick={exportKeyPair} disabled={!keyPair}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={() => document.getElementById('import-file')?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="generate">Generate</TabsTrigger>
                <TabsTrigger value="keys">Keys</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="generate" className="space-y-4">
                {/* Key Generation Options */}
                <Card>
                  <CardHeader 
                    className="pb-2 cursor-pointer"
                    onClick={() => toggleSection('options')}
                  >
                    <CardTitle className="text-base flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {expandedSections.options ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        Key Generation Options
                      </div>
                    </CardTitle>
                  </CardHeader>
                  {expandedSections.options && (
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Key Size</Label>
                          <Select 
                            value={options.keySize.toString()} 
                            onValueChange={(value) => handleOptionChange('keySize', parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {KEY_SIZES.map(size => (
                                <SelectItem key={size.value} value={size.value.toString()}>
                                  <div>
                                    <div className="font-medium">{size.label}</div>
                                    <div className="text-xs text-muted-foreground">{size.description}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Key Format</Label>
                          <Select 
                            value={options.format} 
                            onValueChange={(value) => handleOptionChange('format', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PEM">PEM Format</SelectItem>
                              <SelectItem value="DER">DER Format</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Passphrase (Optional)</Label>
                          <Input
                            type="password"
                            value={options.passphrase}
                            onChange={(e) => handleOptionChange('passphrase', e.target.value)}
                            placeholder="Enter passphrase for private key"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>SSH Key Comment</Label>
                          <Input
                            value={options.comment}
                            onChange={(e) => handleOptionChange('comment', e.target.value)}
                            placeholder="user@hostname"
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          onClick={handleGenerate} 
                          disabled={isGenerating}
                          className="w-full"
                        >
                          {isGenerating ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Key className="w-4 h-4 mr-2" />
                              Generate RSA Key Pair
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
                
                {/* Security Levels */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Security Levels
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {SECURITY_LEVELS.map((level, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-3 h-3 rounded-full ${level.color}`} />
                            <span className="font-medium">{level.level}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{level.description}</p>
                          <Badge variant="outline" className="text-xs">
                            Min: {level.minKeySize} bits
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
              </TabsContent>
              
              <TabsContent value="keys" className="space-y-4">
                {keyPair ? (
                  <>
                    {/* Key Strength Indicator */}
                    {keyStrength && (
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Key Strength:</span>
                                <Badge className={`${keyStrength.color} text-white`}>
                                  {keyStrength.rating}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {keyStrength.description}
                              </p>
                            </div>
                            <div className="text-2xl font-bold">
                              {keyPair.keySize} bits
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {/* Private Key */}
                    <Card>
                      <CardHeader 
                        className="pb-2 cursor-pointer"
                        onClick={() => toggleSection('privateKey')}
                      >
                        <CardTitle className="text-base flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {expandedSections.privateKey ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            Private Key
                            <Lock className="w-4 h-4 text-red-500" />
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={(e) => { e.stopPropagation(); setShowPrivateKey(!showPrivateKey); }}
                            >
                              {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={(e) => { e.stopPropagation(); handleCopy(keyPair.privateKey, 'Private Key'); }}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      {expandedSections.privateKey && (
                        <CardContent>
                          {showPrivateKey ? (
                            <Textarea
                              value={formatKeyForDisplay(keyPair.privateKey, true)}
                              readOnly
                              className="font-mono text-xs min-h-[200px] resize-y"
                              spellCheck={false}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-40 bg-muted/50 rounded-lg">
                              <div className="text-center">
                                <Lock className="w-8 h-8 mx-auto text-muted-foreground" />
                                <p className="text-sm text-muted-foreground mt-2">Private key is hidden for security</p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                    
                    {/* Public Key */}
                    <Card>
                      <CardHeader 
                        className="pb-2 cursor-pointer"
                        onClick={() => toggleSection('publicKey')}
                      >
                        <CardTitle className="text-base flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {expandedSections.publicKey ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            Public Key (PEM)
                            <Unlock className="w-4 h-4 text-green-500" />
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={(e) => { e.stopPropagation(); setShowPublicKey(!showPublicKey); }}
                            >
                              {showPublicKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={(e) => { e.stopPropagation(); handleCopy(keyPair.publicKey, 'Public Key'); }}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      {expandedSections.publicKey && (
                        <CardContent>
                          {showPublicKey ? (
                            <Textarea
                              value={formatKeyForDisplay(keyPair.publicKey)}
                              readOnly
                              className="font-mono text-xs min-h-[150px] resize-y"
                              spellCheck={false}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-32 bg-muted/50 rounded-lg">
                              <div className="text-center">
                                <Unlock className="w-8 h-8 mx-auto text-muted-foreground" />
                                <p className="text-sm text-muted-foreground mt-2">Public key is hidden</p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                    
                    {/* SSH Public Key */}
                    <Card>
                      <CardHeader 
                        className="pb-2 cursor-pointer"
                        onClick={() => toggleSection('sshKey')}
                      >
                        <CardTitle className="text-base flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {expandedSections.sshKey ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            Public Key (SSH Format)
                            <Terminal className="w-4 h-4 text-blue-500" />
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={(e) => { e.stopPropagation(); setShowSSHKey(!showSSHKey); }}
                            >
                              {showSSHKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={(e) => { e.stopPropagation(); handleCopy(keyPair.publicKeySSH, 'SSH Public Key'); }}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      {expandedSections.sshKey && (
                        <CardContent>
                          {showSSHKey ? (
                            <Textarea
                              value={keyPair.publicKeySSH}
                              readOnly
                              className="font-mono text-xs min-h-[80px] resize-y"
                              spellCheck={false}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-24 bg-muted/50 rounded-lg">
                              <div className="text-center">
                                <Terminal className="w-8 h-8 mx-auto text-muted-foreground" />
                                <p className="text-sm text-muted-foreground mt-2">SSH key is hidden</p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                    
                    {/* Fingerprint */}
                    <Card>
                      <CardHeader 
                        className="pb-2 cursor-pointer"
                        onClick={() => toggleSection('fingerprint')}
                      >
                        <CardTitle className="text-base flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {expandedSections.fingerprint ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            Key Fingerprint
                            <Fingerprint className="w-4 h-4 text-purple-500" />
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={(e) => { e.stopPropagation(); handleCopy(keyPair.fingerprint, 'Fingerprint'); }}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      {expandedSections.fingerprint && (
                        <CardContent>
                          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                            <Fingerprint className="w-8 h-8 text-purple-500" />
                            <div>
                              <div className="font-mono text-sm">{keyPair.fingerprint}</div>
                              <p className="text-xs text-muted-foreground mt-1">
                                SHA256 fingerprint of the public key
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <Key className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Key Generated Yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Generate an RSA key pair to view and manage your keys
                        </p>
                        <Button onClick={() => setActiveTab('generate')}>
                          Generate Key Pair
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="advanced">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Advanced Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Key Usage</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch id="signing" />
                          <Label htmlFor="signing">Digital Signing</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="encryption" />
                          <Label htmlFor="encryption">Data Encryption</Label>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label>Key Expiration</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select expiration period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Expiration</SelectItem>
                          <SelectItem value="30">30 Days</SelectItem>
                          <SelectItem value="90">90 Days</SelectItem>
                          <SelectItem value="180">180 Days</SelectItem>
                          <SelectItem value="365">1 Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label>Additional Security</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch id="backup" />
                          <Label htmlFor="backup">Create Backup</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="recovery" />
                          <Label htmlFor="recovery">Recovery Key</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-4">
            {/* Key Information */}
            {keyPair && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Key Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Key Size:</span>
                    <span>{keyPair.keySize} bits</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Algorithm:</span>
                    <span>RSA</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Format:</span>
                    <span>{options.format}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      <span>Private key generated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      <span>Public key generated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      <span>SSH format available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      <span>Fingerprint calculated</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Security Best Practices */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Security Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">1</div>
                  <p>Use at least 2048-bit keys for production systems</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">2</div>
                  <p>Always protect your private key with a strong passphrase</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">3</div>
                  <p>Store private keys securely and never share them</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">4</div>
                  <p>Rotate keys periodically for enhanced security</p>
                </div>
              </CardContent>
            </Card>
            
            
          </div>
        </div>
        
        {/* Hidden file input for import */}
        <input
          id="import-file"
          type="file"
          accept=".json"
          onChange={importKeyPair}
          className="hidden"
        />
      </div>
    </TooltipProvider>
  );
}

// Helper function to generate key ID
function generateKeyId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}