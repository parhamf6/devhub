'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { 
  Copy, 
  RefreshCw, 
  ArrowLeftRight,
  History, 
  Star, 
  Settings, 
  Download, 
  Share,
  Info,
  Calculator,
  Binary,
  Hash,
  X,
} from 'lucide-react';
import { LearnButton } from '@/features/dashboard/tools/components/learn-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Tool definition
const baseConverterTool = {
  name: 'Base Converter',
  description: 'Convert numbers between binary, octal, decimal, hexadecimal, and custom bases (2-36).',
  slug: 'base-converter',
  category: 'Converter',
  tags: ['conversion', 'binary', 'hex', 'decimal'],
};

// Type definitions
type Base = 'binary' | 'octal' | 'decimal' | 'hexadecimal' | 'custom';
type BitOperation = 'AND' | 'OR' | 'XOR' | 'NOT';
type ArithmeticOperation = 'add' | 'subtract' | 'multiply' | 'divide';
type BitManipulation = 'set' | 'clear' | 'toggle' | 'test';

interface BaseValues {
  binary: string;
  octal: string;
  decimal: string;
  hexadecimal: string;
  custom: string;
}

interface FormatOptions {
  uppercaseHex: boolean;
  bitGrouping: number | null;
  showPrefixes: boolean;
}

interface HistoryItem {
  id: string;
  values: BaseValues;
  timestamp: Date;
}

interface FavoriteItem {
  id: string;
  label: string;
  values: BaseValues;
}

export default function BaseConverterPage() {
  // State for input values
  const [values, setValues] = useState<BaseValues>({
    binary: '',
    octal: '',
    decimal: '',
    hexadecimal: '',
    custom: '',
  });

  // State for custom base
  const [customBase, setCustomBase] = useState<number>(16);

  // State for validation errors
  const [errors, setErrors] = useState<Partial<BaseValues>>({});

  // State for format options
  const [formatOptions, setFormatOptions] = useState<FormatOptions>({
    uppercaseHex: true,
    bitGrouping: 4,
    showPrefixes: true,
  });

  // State for history
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // State for favorites
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // State for active operations
  const [bitOperation, setBitOperation] = useState<BitOperation>('AND');
  const [arithmeticOperation, setArithmeticOperation] = useState<ArithmeticOperation>('add');
  const [bitManipulation, setBitManipulation] = useState<BitManipulation>('set');
  const [bitPosition, setBitPosition] = useState<number>(0);

  // State for operation inputs
  const [operandA, setOperandA] = useState<string>('');
  const [operandB, setOperandB] = useState<string>('');

  // State for operation results
  const [operationResult, setOperationResult] = useState<string>('');

  // State for active tab
  const [activeTab, setActiveTab] = useState<string>('converter');

  // Ref for debounce timeout
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Function to convert between bases
  const convertBase = useCallback((value: string, fromBase: number, toBase: number): string => {
    if (!value.trim()) return '';
    
    try {
      // Handle empty string
      if (value === '') return '';
      
      // Convert to decimal first
      let decimalValue: bigint;
      
      if (fromBase === 10) {
        decimalValue = BigInt(value);
      } else {
        // Remove prefix if present
        const cleanValue = value.replace(/^(0b|0o|0x)/i, '');
        decimalValue = BigInt(`0${fromBase === 16 ? 'x' : fromBase === 8 ? 'o' : fromBase === 2 ? 'b' : ''}${cleanValue}`);
      }
      
      // Convert from decimal to target base
      if (toBase === 10) {
        return decimalValue.toString();
      }
      
      let result = '';
      let num = decimalValue;
      
      if (num === 0n) return '0';
      
      const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
      
      while (num > 0n) {
        const remainder = Number(num % BigInt(toBase));
        result = chars[remainder] + result;
        num = num / BigInt(toBase);
      }
      
      // Apply formatting options
      if (toBase === 16 && formatOptions.uppercaseHex) {
        result = result.toUpperCase();
      }
      
      if (formatOptions.showPrefixes) {
        if (toBase === 2) result = `0b${result}`;
        if (toBase === 8) result = `0o${result}`;
        if (toBase === 16) result = `0x${result}`;
      }
      
      return result;
    } catch (error) {
      console.error('Conversion error:', error);
      return '';
    }
  }, [formatOptions]);

  // Function to validate input for a specific base
  const validateInput = useCallback((value: string, base: Base): boolean => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, [base]: undefined }));
      return true;
    }
    
    // Remove prefix if present
    const cleanValue = value.replace(/^(0b|0o|0x)/i, '');
    
    let regex: RegExp;
    let baseNum: number;
    
    switch (base) {
      case 'binary':
        regex = /^[01]+$/;
        baseNum = 2;
        break;
      case 'octal':
        regex = /^[0-7]+$/;
        baseNum = 8;
        break;
      case 'decimal':
        regex = /^[0-9]+$/;
        baseNum = 10;
        break;
      case 'hexadecimal':
        regex = /^[0-9a-f]+$/i;
        baseNum = 16;
        break;
      case 'custom':
        baseNum = customBase;
        const chars = '0123456789abcdefghijklmnopqrstuvwxyz'.slice(0, customBase);
        regex = new RegExp(`^[${chars}]+$`, 'i');
        break;
      default:
        return false;
    }
    
    const isValid = regex.test(cleanValue);
    
    if (!isValid) {
      setErrors(prev => ({ 
        ...prev, 
        [base]: `Invalid characters for base ${baseNum}` 
      }));
      return false;
    }
    
    setErrors(prev => ({ ...prev, [base]: undefined }));
    return true;
  }, [customBase]);

  // Function to update all values when one changes
  const updateValues = useCallback((changedBase: Base, newValue: string) => {
    if (!validateInput(newValue, changedBase)) return;
    
    // Clear any existing debounce timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    // Set new debounce timeout
    debounceTimeout.current = setTimeout(() => {
      setValues(prev => {
        const newValues = { ...prev, [changedBase]: newValue };
        
        // Get the base number for conversion
        let fromBase: number;
        switch (changedBase) {
          case 'binary': fromBase = 2; break;
          case 'octal': fromBase = 8; break;
          case 'decimal': fromBase = 10; break;
          case 'hexadecimal': fromBase = 16; break;
          case 'custom': fromBase = customBase; break;
          default: fromBase = 10;
        }
        
        // Convert to all other bases
        if (newValue.trim()) {
          if (changedBase !== 'binary') {
            newValues.binary = convertBase(newValue, fromBase, 2);
          }
          if (changedBase !== 'octal') {
            newValues.octal = convertBase(newValue, fromBase, 8);
          }
          if (changedBase !== 'decimal') {
            newValues.decimal = convertBase(newValue, fromBase, 10);
          }
          if (changedBase !== 'hexadecimal') {
            newValues.hexadecimal = convertBase(newValue, fromBase, 16);
          }
          if (changedBase !== 'custom') {
            newValues.custom = convertBase(newValue, fromBase, customBase);
          }
        } else {
          // If input is empty, clear all fields
          Object.keys(newValues).forEach(key => {
            if (key !== changedBase) {
              newValues[key as Base] = '';
            }
          });
        }
        
        return newValues;
      });
      
      // Add to history
      setHistory(prev => {
        const newHistory = [
          { id: Date.now().toString(), values: { ...values, [changedBase]: newValue }, timestamp: new Date() },
          ...prev.slice(0, 4) // Keep only last 5 items
        ];
        return newHistory;
      });
    }, 300);
  }, [validateInput, convertBase, customBase, values]);

  // Function to handle input change
  const handleInputChange = (base: Base, value: string) => {
    setValues(prev => ({ ...prev, [base]: value }));
    updateValues(base, value);
  };

  // Function to copy value to clipboard
  const handleCopy = (value: string) => {
    if (!value) return;
    
    navigator.clipboard.writeText(value);
    toast.success('Copied to clipboard!');
  };

  // Function to clear all fields
  const handleClearAll = () => {
    setValues({
      binary: '',
      octal: '',
      decimal: '',
      hexadecimal: '',
      custom: '',
    });
    setErrors({});
    toast.success('All fields cleared');
  };

  // Function to swap two bases
  const handleSwap = (baseA: Base, baseB: Base) => {
    setValues(prev => {
      const newValues = { ...prev };
      const temp = newValues[baseA];
      newValues[baseA] = newValues[baseB];
      newValues[baseB] = temp;
      return newValues;
    });
    toast.success(`Swapped ${baseA} and ${baseB}`);
  };

  // Function to add to favorites
  const handleAddToFavorites = () => {
    if (!values.decimal) {
      toast.error('Cannot add empty value to favorites');
      return;
    }
    
    const label = prompt('Enter a label for this favorite:');
    if (!label) return;
    
    const newFavorite: FavoriteItem = {
      id: Date.now().toString(),
      label,
      values: { ...values }
    };
    
    setFavorites(prev => [...prev, newFavorite]);
    toast.success('Added to favorites');
  };

  // Function to restore from history or favorites
  const handleRestore = (item: HistoryItem | FavoriteItem) => {
    setValues(item.values);
    toast.success('Restored values');
  };

  // Function to perform bit operations
  const performBitOperation = () => {
    if (!operandA || !operandB) {
      toast.error('Both operands are required');
      return;
    }
    
    try {
      const a = BigInt(operandA);
      const b = BigInt(operandB);
      let result: bigint;
      
      switch (bitOperation) {
        case 'AND':
          result = a & b;
          break;
        case 'OR':
          result = a | b;
          break;
        case 'XOR':
          result = a ^ b;
          break;
        case 'NOT':
          result = ~a;
          break;
        default:
          return;
      }
      
      setOperationResult(result.toString());
    } catch (error) {
      toast.error('Invalid operands for bit operation');
    }
  };

  // Function to perform arithmetic operations
  const performArithmeticOperation = () => {
    if (!operandA || !operandB) {
      toast.error('Both operands are required');
      return;
    }
    
    try {
      const a = BigInt(operandA);
      const b = BigInt(operandB);
      let result: bigint;
      
      switch (arithmeticOperation) {
        case 'add':
          result = a + b;
          break;
        case 'subtract':
          result = a - b;
          break;
        case 'multiply':
          result = a * b;
          break;
        case 'divide':
          if (b === 0n) {
            toast.error('Division by zero');
            return;
          }
          result = a / b;
          break;
        default:
          return;
      }
      
      setOperationResult(result.toString());
    } catch (error) {
      toast.error('Invalid operands for arithmetic operation');
    }
  };

  // Function to perform bit manipulation
  const performBitManipulation = () => {
    if (!operandA) {
      toast.error('Operand is required');
      return;
    }
    
    try {
      const a = BigInt(operandA);
      const mask = 1n << BigInt(bitPosition);
      let result: bigint;
      
      switch (bitManipulation) {
        case 'set':
          result = a | mask;
          break;
        case 'clear':
          result = a & ~mask;
          break;
        case 'toggle':
          result = a ^ mask;
          break;
        case 'test':
          result = (a & mask) === 0n ? 0n : 1n;
          break;
        default:
          return;
      }
      
      setOperationResult(result.toString());
    } catch (error) {
      toast.error('Invalid operand for bit manipulation');
    }
  };

  // Function to export data
  const handleExport = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const data = {
        values,
        customBase,
        formatOptions,
        timestamp: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'base-converter-export.json';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // CSV format
      const headers = ['Base', 'Value'];
      const rows = [
        ['Binary', values.binary],
        ['Octal', values.octal],
        ['Decimal', values.decimal],
        ['Hexadecimal', values.hexadecimal],
        ['Custom', values.custom]
      ];
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'base-converter-export.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
    
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  // Function to generate shareable URL
  const handleShare = () => {
    const params = new URLSearchParams();
    params.append('decimal', values.decimal);
    params.append('customBase', customBase.toString());
    
    const url = `${window.location.origin}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    toast.success('Shareable URL copied to clipboard!');
  };

  // Function to format value with bit grouping
  const formatWithGrouping = (value: string, base: Base): string => {
    if (!value || !formatOptions.bitGrouping) return value;
    
    // Remove prefix if present
    const prefix = value.match(/^(0b|0o|0x)/i)?.[0] || '';
    const cleanValue = value.replace(/^(0b|0o|0x)/i, '');
    
    if (cleanValue.length <= formatOptions.bitGrouping) return value;
    
    // Group from right to left
    const regex = new RegExp(`.{1,${formatOptions.bitGrouping}}`, 'g');
    const grouped = cleanValue.split('').reverse().join('').match(regex)?.join(' ').split('').reverse().join('') || cleanValue;
    
    return prefix + grouped;
  };

  // Function to get number info
  const getNumberInfo = () => {
    if (!values.decimal) return null;
    
    try {
      const decimalValue = BigInt(values.decimal);
      const bitLength = decimalValue.toString(2).length;
      const byteSize = Math.ceil(bitLength / 8);
      
      return {
        bitLength,
        byteSize,
        signedInterpretation: decimalValue > (1n << BigInt(bitLength - 1)) - 1n 
          ? `-${(1n << BigInt(bitLength)) - decimalValue}` 
          : decimalValue.toString(),
        unsignedInterpretation: decimalValue.toString()
      };
    } catch (error) {
      return null;
    }
  };

  // Effect to initialize from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const decimalParam = params.get('decimal');
    const customBaseParam = params.get('customBase');
    
    if (decimalParam) {
      handleInputChange('decimal', decimalParam);
    }
    
    if (customBaseParam) {
      const base = parseInt(customBaseParam);
      if (!isNaN(base) && base >= 2 && base <= 36) {
        setCustomBase(base);
      }
    }
  }, []);

  // Effect to clean up debounce timeout
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  // Number info
  const numberInfo = getNumberInfo();

  return (
    <div className="flex flex-col gap-6 p-2 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">{baseConverterTool.name}</h1>
          </div>
          <div>
            <LearnButton 
              tool={{
                name: baseConverterTool.name,
                description: baseConverterTool.description,
                slug: baseConverterTool.slug,
                category: baseConverterTool.category,
                tags: baseConverterTool.tags
              }}
              variant="secondary"
              mdFilePath="content/learn/base-converter.md"
            />
          </div>
            
        </div>
        <div className='flex items-center justify-between flex-wrap gap-4'>
            <p className="text-muted-foreground">{baseConverterTool.description}</p>
        <Dialog>
                <DialogTrigger><Settings/></DialogTrigger>
                <DialogContent>
                    <DialogTitle className='flex gap-4 items-center mb-4'>
                        <Settings className="h-5 w-5" />
                        Format Options
                    </DialogTitle>
                        <div className='flex flex-col gap-4'>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                id="uppercase-hex"
                                checked={formatOptions.uppercaseHex}
                                onCheckedChange={(checked) => 
                                    setFormatOptions(prev => ({ ...prev, uppercaseHex: !!checked }))
                                }
                                />
                                <Label htmlFor="uppercase-hex">Uppercase hexadecimal letters</Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                id="show-prefixes"
                                checked={formatOptions.showPrefixes}
                                onCheckedChange={(checked) => 
                                    setFormatOptions(prev => ({ ...prev, showPrefixes: !!checked }))
                                }
                                />
                                <Label htmlFor="show-prefixes">Show prefixes (0b, 0o, 0x)</Label>
                            </div>
                            
                            <div className='flex flex-col gap-4 mt-4'>
                                <Label htmlFor="bit-grouping">Bit Grouping</Label>
                                <Select
                                value={formatOptions.bitGrouping?.toString() || 'none'}
                                onValueChange={(value) => 
                                    setFormatOptions(prev => ({ 
                                    ...prev, 
                                    bitGrouping: value === 'none' ? null : parseInt(value) 
                                    }))
                                }
                                >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select grouping" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="4">4 bits (nibble)</SelectItem>
                                    <SelectItem value="8">8 bits (byte)</SelectItem>
                                    <SelectItem value="16">16 bits (word)</SelectItem>
                                </SelectContent>
                                </Select>
                            </div>
                        </div>
                </DialogContent>
            </Dialog>
        
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex w-full">
          <TabsTrigger value="converter">Converter</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="history">History & Favorites</TabsTrigger>
        </TabsList>

        {/* Converter Tab */}
        <TabsContent value="converter" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Binary Input */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Binary className="h-5 w-5" />
                  Binary (Base 2)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Input
                    value={values.binary}
                    onChange={(e) => handleInputChange('binary', e.target.value)}
                    placeholder="Enter binary value"
                    className={`font-mono ${errors.binary ? 'border-red-500' : ''}`}
                  />
                  {errors.binary && (
                    <p className="text-sm text-red-500 mt-1">{errors.binary}</p>
                  )}
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(values.binary)}
                    disabled={!values.binary}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSwap('binary', 'decimal')}
                    disabled={!values.binary || !values.decimal}
                  >
                    <ArrowLeftRight className="h-4 w-4 mr-1" />
                    Swap
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Octal Input */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Octal (Base 8)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Input
                    value={values.octal}
                    onChange={(e) => handleInputChange('octal', e.target.value)}
                    placeholder="Enter octal value"
                    className={`font-mono ${errors.octal ? 'border-red-500' : ''}`}
                  />
                  {errors.octal && (
                    <p className="text-sm text-red-500 mt-1">{errors.octal}</p>
                  )}
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(values.octal)}
                    disabled={!values.octal}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSwap('octal', 'decimal')}
                    disabled={!values.octal || !values.decimal}
                  >
                    <ArrowLeftRight className="h-4 w-4 mr-1" />
                    Swap
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Decimal Input */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Decimal (Base 10)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Input
                    value={values.decimal}
                    onChange={(e) => handleInputChange('decimal', e.target.value)}
                    placeholder="Enter decimal value"
                    className={`font-mono ${errors.decimal ? 'border-red-500' : ''}`}
                  />
                  {errors.decimal && (
                    <p className="text-sm text-red-500 mt-1">{errors.decimal}</p>
                  )}
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(values.decimal)}
                    disabled={!values.decimal}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSwap('decimal', 'hexadecimal')}
                    disabled={!values.decimal || !values.hexadecimal}
                  >
                    <ArrowLeftRight className="h-4 w-4 mr-1" />
                    Swap
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Hexadecimal Input */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Hexadecimal (Base 16)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Input
                    value={values.hexadecimal}
                    onChange={(e) => handleInputChange('hexadecimal', e.target.value)}
                    placeholder="Enter hex value"
                    className={`font-mono ${errors.hexadecimal ? 'border-red-500' : ''}`}
                  />
                  {errors.hexadecimal && (
                    <p className="text-sm text-red-500 mt-1">{errors.hexadecimal}</p>
                  )}
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(values.hexadecimal)}
                    disabled={!values.hexadecimal}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSwap('hexadecimal', 'decimal')}
                    disabled={!values.hexadecimal || !values.decimal}
                  >
                    <ArrowLeftRight className="h-4 w-4 mr-1" />
                    Swap
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Custom Base Input */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Custom Base (2-36)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="custom-base">Base:</Label>
                  <Input
                    id="custom-base"
                    type="number"
                    min="2"
                    max="36"
                    value={customBase}
                    onChange={(e) => setCustomBase(Math.min(36, Math.max(2, parseInt(e.target.value) || 16)))}
                    className="w-20"
                  />
                </div>
                <div className="relative">
                  <Input
                    value={values.custom}
                    onChange={(e) => handleInputChange('custom', e.target.value)}
                    placeholder={`Enter base ${customBase} value`}
                    className={`font-mono ${errors.custom ? 'border-red-500' : ''}`}
                  />
                  {errors.custom && (
                    <p className="text-sm text-red-500 mt-1">{errors.custom}</p>
                  )}
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(values.custom)}
                    disabled={!values.custom}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSwap('custom', 'decimal')}
                    disabled={!values.custom || !values.decimal}
                  >
                    <ArrowLeftRight className="h-4 w-4 mr-1" />
                    Swap
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Number Info Panel */}
            {numberInfo && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Number Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Bit Length:</span>
                    <Badge variant="secondary">{numberInfo.bitLength} bits</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Byte Size:</span>
                    <Badge variant="secondary">{numberInfo.byteSize} bytes</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Signed:</span>
                    <Badge variant="secondary">{numberInfo.signedInterpretation}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Unsigned:</span>
                    <Badge variant="secondary">{numberInfo.unsignedInterpretation}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleClearAll} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <Button onClick={handleAddToFavorites} variant="outline" disabled={!values.decimal}>
              <Star className="h-4 w-4 mr-2" />
              Add to Favorites
            </Button>
            <Button onClick={() => handleExport('json')} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <Button onClick={() => handleExport('csv')} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            {/* <Button onClick={handleShare} variant="outline">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button> */}
          </div>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-6">
          <Tabs defaultValue="bit">
            <TabsList className="w-full flex">
              <TabsTrigger value="bit">Bit Operations</TabsTrigger>
              <TabsTrigger value="arithmetic">Arithmetic</TabsTrigger>
              <TabsTrigger value="manipulation">Bit Manipulation</TabsTrigger>
            </TabsList>

            {/* Bit Operations */}
            <TabsContent value="bit" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bitwise Operations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="operand-a">Operand A (Decimal)</Label>
                      <Input
                        id="operand-a"
                        value={operandA}
                        onChange={(e) => setOperandA(e.target.value)}
                        placeholder="Enter first operand"
                        className="font-mono"
                      />
                    </div>
                    <div>
                      <Label htmlFor="operand-b">Operand B (Decimal)</Label>
                      <Input
                        id="operand-b"
                        value={operandB}
                        onChange={(e) => setOperandB(e.target.value)}
                        placeholder="Enter second operand"
                        className="font-mono"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {(['AND', 'OR', 'XOR', 'NOT'] as BitOperation[]).map(op => (
                      <Button
                        key={op}
                        variant={bitOperation === op ? "default" : "outline"}
                        onClick={() => setBitOperation(op)}
                      >
                        {op}
                      </Button>
                    ))}
                  </div>
                  
                  <Button onClick={performBitOperation} className="w-full">
                    Calculate
                  </Button>
                  
                  {operationResult && (
                    <div className="mt-4">
                      <Label>Result (Decimal)</Label>
                      <div className="p-3 bg-muted rounded-md font-mono">
                        {operationResult}
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(operationResult)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Arithmetic Operations */}
            <TabsContent value="arithmetic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Arithmetic Operations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="arithmetic-a">Operand A (Decimal)</Label>
                      <Input
                        id="arithmetic-a"
                        value={operandA}
                        onChange={(e) => setOperandA(e.target.value)}
                        placeholder="Enter first operand"
                        className="font-mono"
                      />
                    </div>
                    <div>
                      <Label htmlFor="arithmetic-b">Operand B (Decimal)</Label>
                      <Input
                        id="arithmetic-b"
                        value={operandB}
                        onChange={(e) => setOperandB(e.target.value)}
                        placeholder="Enter second operand"
                        className="font-mono"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {(['add', 'subtract', 'multiply', 'divide'] as ArithmeticOperation[]).map(op => (
                      <Button
                        key={op}
                        variant={arithmeticOperation === op ? "default" : "outline"}
                        onClick={() => setArithmeticOperation(op)}
                      >
                        {op.charAt(0).toUpperCase() + op.slice(1)}
                      </Button>
                    ))}
                  </div>
                  
                  <Button onClick={performArithmeticOperation} className="w-full">
                    Calculate
                  </Button>
                  
                  {operationResult && (
                    <div className="mt-4">
                      <Label>Result (Decimal)</Label>
                      <div className="p-3 bg-muted rounded-md font-mono">
                        {operationResult}
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(operationResult)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bit Manipulation */}
            <TabsContent value="manipulation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bit Manipulation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="manipulation-value">Value (Decimal)</Label>
                    <Input
                      id="manipulation-value"
                      value={operandA}
                      onChange={(e) => setOperandA(e.target.value)}
                      placeholder="Enter value"
                      className="font-mono"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bit-position">Bit Position (0-based)</Label>
                    <Input
                      id="bit-position"
                      type="number"
                      min="0"
                      value={bitPosition}
                      onChange={(e) => setBitPosition(parseInt(e.target.value) || 0)}
                      className="w-32"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {(['set', 'clear', 'toggle', 'test'] as BitManipulation[]).map(op => (
                      <Button
                        key={op}
                        variant={bitManipulation === op ? "default" : "outline"}
                        onClick={() => setBitManipulation(op)}
                      >
                        {op.charAt(0).toUpperCase() + op.slice(1)}
                      </Button>
                    ))}
                  </div>
                  
                  <Button onClick={performBitManipulation} className="w-full">
                    Execute
                  </Button>
                  
                  {operationResult !== '' && (
                    <div className="mt-4">
                      <Label>Result</Label>
                      <div className="p-3 bg-muted rounded-md font-mono">
                        {operationResult}
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(operationResult)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* History & Favorites Tab */}
        <TabsContent value="history" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Conversion History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <p className="text-muted-foreground">No conversion history yet</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {history.map((item) => (
                      <div key={item.id} className="p-3 border rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm text-muted-foreground">
                            {item.timestamp.toLocaleString()}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRestore(item)}
                          >
                            Restore
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Binary: <span className="font-mono">{formatWithGrouping(item.values.binary, 'binary')}</span></div>
                          <div>Decimal: <span className="font-mono">{item.values.decimal}</span></div>
                          <div>Hex: <span className="font-mono">{formatWithGrouping(item.values.hexadecimal, 'hexadecimal')}</span></div>
                          <div>Octal: <span className="font-mono">{item.values.octal}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Favorites */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Favorites
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favorites.length === 0 ? (
                  <p className="text-muted-foreground">No favorites yet</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {favorites.map((item) => (
                      <div key={item.id} className="p-3 border rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{item.label}</span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRestore(item)}
                            >
                              Restore
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFavorites(prev => prev.filter(fav => fav.id !== item.id))}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Binary: <span className="font-mono">{formatWithGrouping(item.values.binary, 'binary')}</span></div>
                          <div>Decimal: <span className="font-mono">{item.values.decimal}</span></div>
                          <div>Hex: <span className="font-mono">{formatWithGrouping(item.values.hexadecimal, 'hexadecimal')}</span></div>
                          <div>Octal: <span className="font-mono">{item.values.octal}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}