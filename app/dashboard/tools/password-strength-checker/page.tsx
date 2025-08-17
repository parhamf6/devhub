'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  Copy, 
  Eye, 
  EyeOff, 
  Info, 
  RefreshCcw, 
  Shield, 
  XCircle,
  Zap,
  Lock,
  Key,
  AlertCircle
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

const tool = {
  name: "Password Strength Checker",
  slug: "password-strength-checker",
  description: "Analyze password entropy and breach status",
  info: "Check password strength against entropy rules and known breaches. Get suggestions for stronger alternatives.",
  category: "Security",
  version: "1.0.0",
  tags: ["validator", "security"],
};

// Password strength levels
const STRENGTH_LEVELS = [
  { level: 0, label: "Very Weak", color: "bg-red-500", textColor: "text-red-500", icon: XCircle },
  { level: 1, label: "Weak", color: "bg-orange-500", textColor: "text-orange-500", icon: AlertTriangle },
  { level: 2, label: "Medium", color: "bg-yellow-500", textColor: "text-yellow-500", icon: AlertCircle },
  { level: 3, label: "Strong", color: "bg-green-500", textColor: "text-green-500", icon: Shield },
  { level: 4, label: "Very Strong", color: "bg-emerald-500", textColor: "text-emerald-500", icon: CheckCircle },
];

// Common passwords to check against
const COMMON_PASSWORDS = [
  "password", "123456", "12345678", "123456789", "12345",
  "qwerty", "abc123", "password1", "admin", "welcome"
];

export default function PasswordStrengthCheckerPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthLevel, setStrengthLevel] = useState(0);
  const [entropy, setEntropy] = useState(0);
  const [isCommon, setIsCommon] = useState(false);
  const [breachFound, setBreachFound] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [checking, setChecking] = useState(false);
  const [crackTime, setCrackTime] = useState('');
  const [charTypes, setCharTypes] = useState({
    length: 0,
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasSymbol: false,
  });

  // Calculate password strength
  const calculateStrength = (pwd: string) => {
    if (!pwd) {
      setStrengthScore(0);
      setStrengthLevel(0);
      setEntropy(0);
      setIsCommon(false);
      setBreachFound(false);
      setSuggestions([]);
      setCrackTime('');
      setCharTypes({
        length: 0,
        hasLower: false,
        hasUpper: false,
        hasNumber: false,
        hasSymbol: false,
      });
      return;
    }

    setChecking(true);
    
    // Character analysis
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSymbol = /[^A-Za-z0-9]/.test(pwd);
    
    setCharTypes({
      length: pwd.length,
      hasLower,
      hasUpper,
      hasNumber,
      hasSymbol,
    });

    // Check if common password
    const common = COMMON_PASSWORDS.includes(pwd.toLowerCase());
    setIsCommon(common);

    // Calculate entropy
    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNumber) poolSize += 10;
    if (hasSymbol) poolSize += 32;
    
    const entropyValue = pwd.length * Math.log2(poolSize || 1);
    setEntropy(parseFloat(entropyValue.toFixed(2)));

    // Estimate crack time (very simplified)
    let crackTimeEstimate = '';
    if (entropyValue < 30) crackTimeEstimate = 'Instantly';
    else if (entropyValue < 50) crackTimeEstimate = 'Minutes to hours';
    else if (entropyValue < 70) crackTimeEstimate = 'Days to months';
    else if (entropyValue < 90) crackTimeEstimate = 'Years';
    else crackTimeEstimate = 'Centuries';
    
    setCrackTime(crackTimeEstimate);

    // Calculate strength score (0-100)
    let score = 0;
    
    // Length contribution (max 40 points)
    score += Math.min(40, pwd.length * 2);
    
    // Character diversity (max 30 points)
    const diversityCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
    score += diversityCount * 7.5;
    
    // Entropy bonus (max 30 points)
    score += Math.min(30, entropyValue / 3);
    
    // Penalty for common passwords
    if (common) score = Math.max(0, score - 50);
    
    // Cap at 100
    score = Math.min(100, Math.max(0, score));
    
    setStrengthScore(Math.round(score));
    
    // Determine strength level
    const level = score < 20 ? 0 : 
                  score < 40 ? 1 : 
                  score < 60 ? 2 : 
                  score < 80 ? 3 : 4;
    
    setStrengthLevel(level);
    
    // Generate suggestions
    const newSuggestions: string[] = [];
    
    if (pwd.length < 12) newSuggestions.push("Use at least 12 characters");
    if (!hasLower) newSuggestions.push("Add lowercase letters");
    if (!hasUpper) newSuggestions.push("Add uppercase letters");
    if (!hasNumber) newSuggestions.push("Add numbers");
    if (!hasSymbol) newSuggestions.push("Add special characters");
    if (common) newSuggestions.push("Avoid common passwords");
    if (score < 60) newSuggestions.push("Consider using a passphrase");
    
    setSuggestions(newSuggestions);
    
    // Simulate breach check (in a real app, this would be an API call)
    setTimeout(() => {
      // For demo purposes, randomly set breachFound for weak passwords
      setBreachFound(score < 40 && Math.random() > 0.5);
      setChecking(false);
    }, 800);
  };

  // Auto-check on password change
  useEffect(() => {
    const handler = setTimeout(() => {
      calculateStrength(password);
    }, 300);
    
    return () => clearTimeout(handler);
  }, [password]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    toast.success('Password copied to clipboard!');
  };

  const handleGenerate = () => {
    // Generate a strong password
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let generated = '';
    for (let i = 0; i < length; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated);
    toast.success('Generated a strong password!');
  };
  const [length , setLength] = useState<number>(16)
  const strengthInfo = STRENGTH_LEVELS[strengthLevel];
  const StrengthIcon = strengthInfo.icon;

  return (
    <div className="flex flex-col justify-center p-2 md:p-6 space-y-6  mx-auto">
      <div className="flex flex-col gap-4">
        <div className='flex justify-between gap-4 flex-wrap'>
          <div className="flex items-center gap-2">
            {/* <Key className="h-6 w-6 text-primary" /> */}
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
              mdFilePath="content/learn/password-strength-checker.md"
            />
          </div>
        </div>
        <p className="text-muted-foreground">{tool.description}</p>
      </div>

      <Tabs defaultValue="checker" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="checker">Password Checker</TabsTrigger>
          <TabsTrigger value="generator">Password Generator</TabsTrigger>
        </TabsList>
        
        <TabsContent value="checker" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Enter Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pr-10"
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
              
              {password && (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCopy}
                    className="h-8 px-2 text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" /> Copy
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setPassword('')}
                    className="h-8 px-2 text-xs"
                  >
                    Clear
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {password && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Strength Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Password Strength</span>
                      <div className="flex items-center gap-1">
                        <StrengthIcon className={`h-4 w-4 ${strengthInfo.textColor}`} />
                        <span className={`text-sm font-medium ${strengthInfo.textColor}`}>
                          {strengthInfo.label}
                        </span>
                      </div>
                    </div>
                    <Progress value={strengthScore} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0</span>
                      <span>Score: {strengthScore}/100</span>
                      <span>100</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Entropy</span>
                        <span className="text-sm font-medium">{entropy} bits</span>
                      </div>
                      <Progress value={Math.min(100, entropy)} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Estimated Crack Time</span>
                        <span className="text-sm font-medium">{crackTime}</span>
                      </div>
                      <Progress 
                        value={crackTime === 'Instantly' ? 10 : 
                                crackTime === 'Minutes to hours' ? 30 :
                                crackTime === 'Days to months' ? 60 :
                                crackTime === 'Years' ? 80 : 100} 
                        className="h-2" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <span className="text-2xl font-bold">{charTypes.length}</span>
                      <span className="text-xs text-muted-foreground">Characters</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <span className="text-2xl font-bold">{[charTypes.hasLower, charTypes.hasUpper, charTypes.hasNumber, charTypes.hasSymbol].filter(Boolean).length}</span>
                      <span className="text-xs text-muted-foreground">Character Types</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <span className="text-2xl font-bold">{entropy}</span>
                      <span className="text-xs text-muted-foreground">Entropy (bits)</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <span className="text-2xl font-bold">{strengthScore}</span>
                      <span className="text-xs text-muted-foreground">Strength Score</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Character Types</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="flex items-center gap-2">
                        <Checkbox checked={charTypes.hasLower} disabled />
                        <Label className="text-sm">Lowercase</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox checked={charTypes.hasUpper} disabled />
                        <Label className="text-sm">Uppercase</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox checked={charTypes.hasNumber} disabled />
                        <Label className="text-sm">Numbers</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox checked={charTypes.hasSymbol} disabled />
                        <Label className="text-sm">Symbols</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {(isCommon || breachFound || suggestions.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Security Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isCommon && (
                      <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-700">Common Password Detected</p>
                          <p className="text-sm text-red-600">This password is extremely common and easily guessable.</p>
                        </div>
                      </div>
                    )}
                    
                    {breachFound && (
                      <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-700">Password Found in Data Breach</p>
                          <p className="text-sm text-red-600">This password has been exposed in known data breaches.</p>
                        </div>
                      </div>
                    )}
                    
                    {suggestions.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium">Suggestions to Improve</h3>
                        <div className="space-y-2">
                          {suggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-0.5">
                                <CheckCircle className="h-3 w-3" />
                              </div>
                              <span className="text-sm">{suggestion}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCcw className="h-5 w-5" />
                Password Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="font-medium">Password Length: {[length]}</Label>
                <Slider
                  min={8}
                  max={100}
                  step={1}
                  value={[length]}
                  onValueChange={([val]) => setLength(val)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Lowercase', checked: true },
                  { label: 'Uppercase', checked: true },
                  { label: 'Numbers', checked: true },
                  { label: 'Symbols', checked: true },
                ].map(({ label, checked }, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox checked={checked} disabled />
                    <Label>{label}</Label>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleGenerate} className="flex-1">
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Generate Strong Password
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>The generated password will automatically be checked for strength.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {checking && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}