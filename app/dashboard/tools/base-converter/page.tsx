'use client';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Eye,
  EyeOff,
  Keyboard,
  Smartphone,
  Monitor,
  Zap,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Trash2,
  Save,
  Plus,
  Minus,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  GripVertical,
  Menu
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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

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
type BitOperation = 'AND' | 'OR' | 'XOR' | 'NOT' | 'LSHIFT' | 'RSHIFT';
type ArithmeticOperation = 'add' | 'subtract' | 'multiply' | 'divide' | 'modulo' | 'power';
type BitManipulation = 'set' | 'clear' | 'toggle' | 'test';
type ViewMode = 'grid' | 'list' | 'compact';

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
  autoCopy: boolean;
}

interface HistoryItem {
  id: string;
  values: BaseValues;
  timestamp: Date;
  label?: string;
}

interface FavoriteItem {
  id: string;
  label: string;
  values: BaseValues;
}

interface KeyboardShortcut {
  key: string;
  description: string;
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
    autoCopy: false,
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
  const [shiftAmount, setShiftAmount] = useState<number>(1);
  
  // State for operation inputs
  const [operandA, setOperandA] = useState<string>('');
  const [operandB, setOperandB] = useState<string>('');
  
  // State for operation results
  const [operationResult, setOperationResult] = useState<string>('');
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<string>('converter');
  
  // State for UI
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showNumberInfo, setShowNumberInfo] = useState<boolean>(true);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragItem, setDragItem] = useState<{id: string, index: number} | null>(null);
  const [dragOverItem, setDragOverItem] = useState<{id: string, index: number} | null>(null);
  
  // Refs
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRefs = useRef<Record<Base, HTMLInputElement | null>>({
    binary: null,
    octal: null,
    decimal: null,
    hexadecimal: null,
    custom: null,
  });
  
  // Keyboard shortcuts
  const keyboardShortcuts: KeyboardShortcut[] = [
    { key: 'Ctrl/Cmd + Enter', description: 'Process conversion' },
    { key: 'Ctrl/Cmd + C', description: 'Copy current field' },
    { key: 'Ctrl/Cmd + S', description: 'Add to favorites' },
    { key: 'Ctrl/Cmd + D', description: 'Clear all fields' },
    { key: 'Ctrl/Cmd + /', description: 'Show shortcuts' },
    { key: 'Esc', description: 'Close dialogs' },
  ];
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Load data from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('base-converter-history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      }
      
      const savedFavorites = localStorage.getItem('base-converter-favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
      
      const savedFormatOptions = localStorage.getItem('base-converter-format-options');
      if (savedFormatOptions) {
        setFormatOptions(JSON.parse(savedFormatOptions));
      }
    } catch (e) {
      console.error('Failed to load data from localStorage', e);
    }
  }, []);
  
  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('base-converter-history', JSON.stringify(history));
  }, [history]);
  
  useEffect(() => {
    localStorage.setItem('base-converter-favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  useEffect(() => {
    localStorage.setItem('base-converter-format-options', JSON.stringify(formatOptions));
  }, [formatOptions]);
  
  // Initialize from URL parameters
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
  
  // Focus the decimal input on mount and tab change
  useEffect(() => {
    if (activeTab === 'converter') {
      // Focus decimal input after a short delay to ensure it's rendered
      setTimeout(() => {
        if (inputRefs.current.decimal) {
          inputRefs.current.decimal?.focus();
        }
      }, 100);
    }
  }, [activeTab]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to process
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        // Find the active input and process it
        const activeElement = document.activeElement as HTMLInputElement;
        if (activeElement) {
          const base = Object.keys(inputRefs.current).find(
            key => inputRefs.current[key as Base] === activeElement
          ) as Base;
          if (base) {
            updateValues(base, activeElement.value);
          }
        }
      }
      
      // Ctrl/Cmd + C to copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        // Find the first non-empty value and copy it
        const firstNonEmpty = Object.entries(values).find(([_, value]) => value);
        if (firstNonEmpty) {
          handleCopy(firstNonEmpty[1]);
        }
      }
      
      // Ctrl/Cmd + S to add to favorites
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleAddToFavorites();
      }
      
      // Ctrl/Cmd + D to clear all
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        handleClearAll();
      }
      
      // Ctrl/Cmd + / to show shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsShortcutsOpen(true);
      }
      
      // Escape to close dialogs
      if (e.key === 'Escape') {
        setIsShortcutsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [values]);
  
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
        regex = /^-?[0-9]+$/;
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
      
      // Auto-copy if enabled
      if (formatOptions.autoCopy && newValue.trim()) {
        navigator.clipboard.writeText(newValue);
        toast.success('Copied to clipboard!');
      }
      
      // Add to history
      setHistory(prev => {
        const newHistory = [
          { id: Date.now().toString(), values: { ...values, [changedBase]: newValue }, timestamp: new Date() },
          ...prev.slice(0, 9) // Keep only last 10 items
        ];
        return newHistory;
      });
    }, 300);
  }, [validateInput, convertBase, customBase, values, formatOptions.autoCopy]);
  
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
    if (!operandA) {
      toast.error('Operand A is required');
      return;
    }
    
    if (bitOperation !== 'NOT' && !operandB) {
      toast.error('Operand B is required for this operation');
      return;
    }
    
    try {
      const a = BigInt(operandA);
      let result: bigint;
      
      switch (bitOperation) {
        case 'AND':
          result = a & BigInt(operandB);
          break;
        case 'OR':
          result = a | BigInt(operandB);
          break;
        case 'XOR':
          result = a ^ BigInt(operandB);
          break;
        case 'NOT':
          result = ~a;
          break;
        case 'LSHIFT':
          result = a << BigInt(shiftAmount);
          break;
        case 'RSHIFT':
          result = a >> BigInt(shiftAmount);
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
        case 'modulo':
          if (b === 0n) {
            toast.error('Modulo by zero');
            return;
          }
          result = a % b;
          break;
        case 'power':
          // Simple power implementation for small exponents
          if (b < 0n) {
            toast.error('Negative exponents not supported');
            return;
          }
          result = 1n;
          for (let i = 0; i < Number(b); i++) {
            result *= a;
          }
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
    
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
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
        unsignedInterpretation: decimalValue.toString(),
        binaryRepresentation: decimalValue.toString(2).padStart(bitLength, '0'),
        hexadecimalRepresentation: decimalValue.toString(16).toUpperCase(),
        octalRepresentation: decimalValue.toString(8)
      };
    } catch (error) {
      return null;
    }
  };
  
  // Drag and drop handlers for favorites
  const handleDragStart = (e: React.DragEvent, id: string, index: number) => {
    setIsDragging(true);
    setDragItem({ id, index });
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e: React.DragEvent, id: string, index: number) => {
    e.preventDefault();
    setDragOverItem({ id, index });
  };
  
  const handleDrop = (e: React.DragEvent, targetId: string, targetIndex: number) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!dragItem || dragItem.index === targetIndex) return;
    
    const newFavorites = [...favorites];
    const [draggedItem] = newFavorites.splice(dragItem.index, 1);
    newFavorites.splice(targetIndex, 0, draggedItem);
    
    setFavorites(newFavorites);
    setDragItem(null);
    setDragOverItem(null);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    setDragItem(null);
    setDragOverItem(null);
  };
  
  // Number info
  const numberInfo = getNumberInfo();
  
  // Effect to clean up debounce timeout
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);
  
  // Mobile-optimized input component
  const MobileInput = ({ base, label, icon }: { base: Base; label: string; icon: React.ReactNode }) => (
    <Card className="mb-3">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="relative">
          <Input
            ref={(el) => inputRefs.current[base] = el}
            value={values[base]}
            onChange={(e) => handleInputChange(base, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
            className={`font-mono text-sm ${errors[base] ? 'border-red-500' : ''}`}
            autoFocus={base === 'decimal'}
          />
          {errors[base] && (
            <p className="text-xs text-red-500 mt-1">{errors[base]}</p>
          )}
        </div>
        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(values[base])}
            disabled={!values[base]}
            className="h-8 px-2 text-xs"
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSwap(base, 'decimal')}
            disabled={!values[base] || !values.decimal}
            className="h-8 px-2 text-xs"
          >
            <ArrowLeftRight className="h-3 w-3 mr-1" />
            Swap
          </Button>
        </div>
      </CardContent>
    </Card>
  );
  
  // Desktop-optimized input component
  const DesktopInput = ({ base, label, icon }: { base: Base; label: string; icon: React.ReactNode }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <Input
            ref={(el) => inputRefs.current[base] = el}
            value={values[base]}
            onChange={(e) => handleInputChange(base, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
            className={`font-mono ${errors[base] ? 'border-red-500' : ''}`}
            autoFocus={base === 'decimal'}
          />
          {errors[base] && (
            <p className="text-sm text-red-500 mt-1">{errors[base]}</p>
          )}
        </div>
        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(values[base])}
            disabled={!values[base]}
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSwap(base, 'decimal')}
            disabled={!values[base] || !values.decimal}
          >
            <ArrowLeftRight className="h-4 w-4 mr-1" />
            Swap
          </Button>
        </div>
      </CardContent>
    </Card>
  );
  
  // Custom base input component
  const CustomBaseInput = () => (
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
            ref={(el) => inputRefs.current.custom = el}
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
  );
  
  // Number info panel component
  const NumberInfoPanel = () => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="h-5 w-5" />
          Number Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {numberInfo ? (
          <>
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
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-between p-0 h-auto">
                  <span>Advanced Details</span>
                  {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Binary:</Label>
                  <div className="text-xs font-mono break-all p-2 bg-muted rounded">
                    {formatWithGrouping(numberInfo.binaryRepresentation, 'binary')}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Hexadecimal:</Label>
                  <div className="text-xs font-mono break-all p-2 bg-muted rounded">
                    {formatWithGrouping(numberInfo.hexadecimalRepresentation, 'hexadecimal')}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Octal:</Label>
                  <div className="text-xs font-mono break-all p-2 bg-muted rounded">
                    {numberInfo.octalRepresentation}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </>
        ) : (
          <p className="text-muted-foreground text-sm">Enter a value to see number information</p>
        )}
      </CardContent>
    </Card>
  );
  
  // Keyboard shortcuts dialog
  const KeyboardShortcutsDialog = () => (
    <Dialog open={isShortcutsOpen} onOpenChange={setIsShortcutsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {keyboardShortcuts.map((shortcut, index) => (
            <div key={index} className="flex justify-between items-center">
              <span>{shortcut.description}</span>
              <Badge variant="outline">{shortcut.key}</Badge>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
  
  return (
    <div className="flex flex-col gap-4 md:gap-6 p-2 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:gap-4">
        <div className='flex justify-between items-start gap-2 flex-wrap'>
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              {baseConverterTool.name}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base mt-1">
              {baseConverterTool.description}
            </p>
          </div>
          <div className="flex gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsShortcutsOpen(true)}
              className="hidden md:flex"
            >
              <Keyboard className="w-4 h-4 mr-1" />
              Shortcuts
            </Button>
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
      </div>
      
      {/* Mobile View */}
      {isMobile && (
        <div className="md:hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Number Bases</h2>
            <div className="flex gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            <MobileInput base="binary" label="Binary" icon={<Binary className="h-4 w-4" />} />
            <MobileInput base="octal" label="Octal" icon={<Hash className="h-4 w-4" />} />
            <MobileInput base="decimal" label="Decimal" icon={<Calculator className="h-4 w-4" />} />
            <MobileInput base="hexadecimal" label="Hexadecimal" icon={<Hash className="h-4 w-4" />} />
            
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="custom-base-mobile" className="text-sm">Custom Base:</Label>
              <Input
                id="custom-base-mobile"
                type="number"
                min="2"
                max="36"
                value={customBase}
                onChange={(e) => setCustomBase(Math.min(36, Math.max(2, parseInt(e.target.value) || 16)))}
                className="w-16 h-8 text-sm"
              />
            </div>
            <MobileInput base="custom" label={`Base ${customBase}`} icon={<Hash className="h-4 w-4" />} />
            
            {showNumberInfo && <NumberInfoPanel />}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button onClick={handleClearAll} variant="outline" size="sm" className="flex-1">
              <RefreshCw className="h-4 w-4 mr-1" />
              Clear
            </Button>
            <Button onClick={handleAddToFavorites} variant="outline" size="sm" className="flex-1" disabled={!values.decimal}>
              <Star className="h-4 w-4 mr-1" />
              Favorite
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="h-4 w-4 mr-1" />
                  Options
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Format Options</SheetTitle>
                  <SheetDescription>
                    Customize how numbers are displayed
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="uppercase-hex-mobile"
                      checked={formatOptions.uppercaseHex}
                      onCheckedChange={(checked) => 
                        setFormatOptions(prev => ({ ...prev, uppercaseHex: !!checked }))
                      }
                    />
                    <Label htmlFor="uppercase-hex-mobile">Uppercase hexadecimal letters</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-prefixes-mobile"
                      checked={formatOptions.showPrefixes}
                      onCheckedChange={(checked) => 
                        setFormatOptions(prev => ({ ...prev, showPrefixes: !!checked }))
                      }
                    />
                    <Label htmlFor="show-prefixes-mobile">Show prefixes (0b, 0o, 0x)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="auto-copy-mobile"
                      checked={formatOptions.autoCopy}
                      onCheckedChange={(checked) => 
                        setFormatOptions(prev => ({ ...prev, autoCopy: !!checked }))
                      }
                    />
                    <Label htmlFor="auto-copy-mobile">Auto-copy on conversion</Label>
                  </div>
                  
                  <div className='flex flex-col gap-2'>
                    <Label htmlFor="bit-grouping-mobile">Bit Grouping</Label>
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
                        <SelectItem value="32">32 bits (dword)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-info-mobile"
                      checked={showNumberInfo}
                      onCheckedChange={setShowNumberInfo}
                    />
                    <Label htmlFor="show-info-mobile">Show number information</Label>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      )}
      
      {/* Desktop View */}
      {!isMobile && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="converter">Converter</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="history">History & Favorites</TabsTrigger>
          </TabsList>
          
          {/* Converter Tab */}
          <TabsContent value="converter" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4 mr-1" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4 mr-1" />
                  List
                </Button>
                <Button
                  variant={viewMode === 'compact' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('compact')}
                >
                  <Minimize2 className="w-4 h-4 mr-1" />
                  Compact
                </Button>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Format Options
                  </Button>
                </DialogTrigger>
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
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="auto-copy"
                        checked={formatOptions.autoCopy}
                        onCheckedChange={(checked) => 
                          setFormatOptions(prev => ({ ...prev, autoCopy: !!checked }))
                        }
                      />
                      <Label htmlFor="auto-copy">Auto-copy on conversion</Label>
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
                          <SelectItem value="32">32 bits (dword)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DesktopInput base="binary" label="Binary (Base 2)" icon={<Binary className="h-5 w-5" />} />
                <DesktopInput base="octal" label="Octal (Base 8)" icon={<Hash className="h-5 w-5" />} />
                <DesktopInput base="decimal" label="Decimal (Base 10)" icon={<Calculator className="h-5 w-5" />} />
                <DesktopInput base="hexadecimal" label="Hexadecimal (Base 16)" icon={<Hash className="h-5 w-5" />} />
                <CustomBaseInput />
                {showNumberInfo && <NumberInfoPanel />}
              </div>
            )}
            
            {viewMode === 'list' && (
              <div className="space-y-4">
                <DesktopInput base="binary" label="Binary (Base 2)" icon={<Binary className="h-5 w-5" />} />
                <DesktopInput base="octal" label="Octal (Base 8)" icon={<Hash className="h-5 w-5" />} />
                <DesktopInput base="decimal" label="Decimal (Base 10)" icon={<Calculator className="h-5 w-5" />} />
                <DesktopInput base="hexadecimal" label="Hexadecimal (Base 16)" icon={<Hash className="h-5 w-5" />} />
                <CustomBaseInput />
                {showNumberInfo && <NumberInfoPanel />}
              </div>
            )}
            
            {viewMode === 'compact' && (
              <Card>
                <CardHeader>
                  <CardTitle>Number Base Converter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="compact-base">Base</Label>
                      <Select
                        value="decimal"
                        onValueChange={(value) => {
                          // In a real implementation, this would switch the active input
                          // For now, we'll just keep it as decimal
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="binary">Binary (Base 2)</SelectItem>
                          <SelectItem value="octal">Octal (Base 8)</SelectItem>
                          <SelectItem value="decimal">Decimal (Base 10)</SelectItem>
                          <SelectItem value="hexadecimal">Hexadecimal (Base 16)</SelectItem>
                          <SelectItem value="custom">Custom Base</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="compact-value">Value</Label>
                      <Input
                        id="compact-value"
                        value={values.decimal}
                        onChange={(e) => handleInputChange('decimal', e.target.value)}
                        placeholder="Enter value"
                        className="font-mono"
                        autoFocus
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Binary</Label>
                      <div className="p-2 bg-muted rounded font-mono text-sm break-all">
                        {formatWithGrouping(values.binary, 'binary') || '-'}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Octal</Label>
                      <div className="p-2 bg-muted rounded font-mono text-sm break-all">
                        {values.octal || '-'}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Hexadecimal</Label>
                      <div className="p-2 bg-muted rounded font-mono text-sm break-all">
                        {formatWithGrouping(values.hexadecimal, 'hexadecimal') || '-'}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Custom ({customBase})</Label>
                      <div className="p-2 bg-muted rounded font-mono text-sm break-all">
                        {values.custom || '-'}
                      </div>
                    </div>
                  </div>
                  
                  {showNumberInfo && numberInfo && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">Number Information</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowNumberInfo(!showNumberInfo)}
                        >
                          {showNumberInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div className="p-2 bg-muted rounded">
                          <div className="text-muted-foreground">Bit Length</div>
                          <div>{numberInfo.bitLength} bits</div>
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <div className="text-muted-foreground">Byte Size</div>
                          <div>{numberInfo.byteSize} bytes</div>
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <div className="text-muted-foreground">Signed</div>
                          <div>{numberInfo.signedInterpretation}</div>
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <div className="text-muted-foreground">Unsigned</div>
                          <div>{numberInfo.unsignedInterpretation}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
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
              <Button onClick={handleShare} variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
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
                    
                    {(bitOperation === 'LSHIFT' || bitOperation === 'RSHIFT') && (
                      <div>
                        <Label htmlFor="shift-amount">Shift Amount</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            value={[shiftAmount]}
                            onValueChange={(value) => setShiftAmount(value[0])}
                            max={64}
                            min={1}
                            step={1}
                            className="flex-1"
                          />
                          <Input
                            id="shift-amount"
                            type="number"
                            min="1"
                            max={64}
                            value={shiftAmount}
                            onChange={(e) => setShiftAmount(parseInt(e.target.value) || 1)}
                            className="w-16"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {(['AND', 'OR', 'XOR', 'NOT', 'LSHIFT', 'RSHIFT'] as BitOperation[]).map(op => (
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
                      {(['add', 'subtract', 'multiply', 'divide', 'modulo', 'power'] as ArithmeticOperation[]).map(op => (
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
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[bitPosition]}
                          onValueChange={(value) => setBitPosition(value[0])}
                          max={63}
                          min={0}
                          step={1}
                          className="flex-1"
                        />
                        <Input
                          id="bit-position"
                          type="number"
                          min="0"
                          max={63}
                          value={bitPosition}
                          onChange={(e) => setBitPosition(parseInt(e.target.value) || 0)}
                          className="w-16"
                        />
                      </div>
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
                  <ScrollArea className="h-96">
                  {history.length === 0 ? (
                    <p className="text-muted-foreground">No conversion history yet</p>
                  ) : (
                    
                      <div className="space-y-3">
                        {history.map((item, index) => (
                          <div 
                            key={item.id} 
                            className="p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => handleRestore(item)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm text-muted-foreground">
                                {item.timestamp.toLocaleString()}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setHistory(prev => prev.filter((_, i) => i !== index));
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
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
                  </ScrollArea>
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
                    <ScrollArea className="max-h-96">
                      <div className="space-y-3">
                        {favorites.map((item, index) => (
                          <div 
                            key={item.id}
                            className={`p-3 border rounded-md transition-colors ${
                              dragOverItem?.index === index ? 'bg-muted/50' : ''
                            }`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item.id, index)}
                            onDragOver={(e) => handleDragOver(e, item.id, index)}
                            onDrop={(e) => handleDrop(e, item.id, index)}
                            onDragEnd={handleDragEnd}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                                <span className="font-medium">{item.label}</span>
                              </div>
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
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog />
    </div>
  );
}

// Grid icon component (missing in the original code)
function Grid(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

// List icon component (missing in the original code)
function List(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}