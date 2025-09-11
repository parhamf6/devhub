'use client';
import { useEffect, useState, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, Info, RefreshCcw, Download, History, Settings, BarChart2, Ruler, Type, Monitor, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LearnButton } from '@/features/dashboard/tools/components/learn-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const tool = {
    name: "CSS Unit Converter",
    slug: "css-unit-converter",
    description: "Convert between CSS units: px, em, rem, %, vw, vh",
    info: "Convert CSS measurements with customizable base font sizes and viewport dimensions.",
    category: "Design",
    version: "1.0.0",
    tags: ["css", "unit", "convert", "responsive"],
    type: "tool"
};

interface ConversionSettings {
    baseFontSize: number; // in px
    rootFontSize: number; // in px
    viewportWidth: number; // in px
    viewportHeight: number; // in px
    parentFontSize: number; // in px, for em calculations
}

interface ConversionHistoryItem {
    fromValue: number;
    fromUnit: string;
    toValue: number;
    toUnit: string;
    timestamp: Date;
    settings: ConversionSettings;
}

interface ConversionPreset {
    name: string;
    settings: ConversionSettings;
}

export default function CssUnitConverterPage() {
    // Default settings
    const defaultSettings: ConversionSettings = {
        baseFontSize: 16,
        rootFontSize: 16,
        viewportWidth: 1920,
        viewportHeight: 1080,
        parentFontSize: 16
    };

    // State
    const [settings, setSettings] = useState<ConversionSettings>(defaultSettings);
    const [fromValue, setFromValue] = useState<string>('16');
    const [fromUnit, setFromUnit] = useState<string>('px');
    const [toUnit, setToUnit] = useState<string>('rem');
    const [result, setResult] = useState<string>('1');
    const [conversionHistory, setConversionHistory] = useState<ConversionHistoryItem[]>([]);
    const [batchInput, setBatchInput] = useState<string>('');
    const [batchResults, setBatchResults] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState('single');
    const [presets, setPresets] = useState<ConversionPreset[]>([
        { name: "Default", settings: defaultSettings },
        { name: "Mobile First", settings: { ...defaultSettings, viewportWidth: 375, viewportHeight: 667 } },
        { name: "Large Desktop", settings: { ...defaultSettings, viewportWidth: 2560, viewportHeight: 1440 } },
        { name: "Typography Scale", settings: { ...defaultSettings, baseFontSize: 18, rootFontSize: 18 } }
    ]);
    const [activePreset, setActivePreset] = useState<string>("Default");

    // Available CSS units
    const cssUnits = [
        { value: 'px', label: 'Pixels (px)' },
        { value: 'em', label: 'Em (em)' },
        { value: 'rem', label: 'Root Em (rem)' },
        { value: '%', label: 'Percent (%)' },
        { value: 'vw', label: 'Viewport Width (vw)' },
        { value: 'vh', label: 'Viewport Height (vh)' },
        { value: 'vmin', label: 'Viewport Min (vmin)' },
        { value: 'vmax', label: 'Viewport Max (vmax)' },
        { value: 'pt', label: 'Points (pt)' },
        { value: 'pc', label: 'Picas (pc)' },
        { value: 'in', label: 'Inches (in)' },
        { value: 'cm', label: 'Centimeters (cm)' },
        { value: 'mm', label: 'Millimeters (mm)' }
    ];

    // Conversion factors to pixels
    const unitToPxFactors: Record<string, number> = {
        'px': 1,
        'em': 0, // Will be calculated dynamically
        'rem': 0, // Will be calculated dynamically
        '%': 0, // Will be calculated dynamically
        'vw': 0, // Will be calculated dynamically
        'vh': 0, // Will be calculated dynamically
        'vmin': 0, // Will be calculated dynamically
        'vmax': 0, // Will be calculated dynamically
        'pt': 1.333,
        'pc': 16,
        'in': 96,
        'cm': 37.8,
        'mm': 3.78
    };

    // Convert any unit to pixels
    const convertToPx = (value: number, unit: string): number => {
        switch (unit) {
            case 'px':
                return value;
            case 'em':
                return value * settings.parentFontSize;
            case 'rem':
                return value * settings.rootFontSize;
            case '%':
                return (value * settings.parentFontSize) / 100;
            case 'vw':
                return (value * settings.viewportWidth) / 100;
            case 'vh':
                return (value * settings.viewportHeight) / 100;
            case 'vmin':
                return (value * Math.min(settings.viewportWidth, settings.viewportHeight)) / 100;
            case 'vmax':
                return (value * Math.max(settings.viewportWidth, settings.viewportHeight)) / 100;
            default:
                return value * unitToPxFactors[unit];
        }
    };

    // Convert from pixels to any unit
    const convertFromPx = (pxValue: number, unit: string): number => {
        switch (unit) {
            case 'px':
                return pxValue;
            case 'em':
                return pxValue / settings.parentFontSize;
            case 'rem':
                return pxValue / settings.rootFontSize;
            case '%':
                return (pxValue * 100) / settings.parentFontSize;
            case 'vw':
                return (pxValue * 100) / settings.viewportWidth;
            case 'vh':
                return (pxValue * 100) / settings.viewportHeight;
            case 'vmin':
                return (pxValue * 100) / Math.min(settings.viewportWidth, settings.viewportHeight);
            case 'vmax':
                return (pxValue * 100) / Math.max(settings.viewportWidth, settings.viewportHeight);
            default:
                return pxValue / unitToPxFactors[unit];
        }
    };

    // Perform conversion
    const convert = () => {
        const value = parseFloat(fromValue);
        if (isNaN(value)) {
            setResult('Invalid input');
            return;
        }

        // Convert from source unit to pixels
        const pxValue = convertToPx(value, fromUnit);
        
        // Convert from pixels to target unit
        const convertedValue = convertFromPx(pxValue, toUnit);
        
        // Format result
        const formattedResult = formatResult(convertedValue);
        setResult(formattedResult);
        
        // Add to history
        const historyItem: ConversionHistoryItem = {
            fromValue: value,
            fromUnit,
            toValue: convertedValue,
            toUnit,
            timestamp: new Date(),
            settings: { ...settings }
        };
        
        setConversionHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10
    };

    // Format result with appropriate precision
    const formatResult = (value: number): string => {
        if (Math.abs(value) < 0.01) return value.toExponential(2);
        if (Math.abs(value) >= 1000) return value.toFixed(0);
        if (Math.abs(value) >= 100) return value.toFixed(1);
        if (Math.abs(value) >= 10) return value.toFixed(2);
        return value.toFixed(3);
    };

    // Batch conversion
    const convertBatch = () => {
        const lines = batchInput.split('\n').filter(line => line.trim() !== '');
        const results: string[] = [];
        
        lines.forEach(line => {
            const match = line.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z%]+)$/);
            if (match) {
                const value = parseFloat(match[1]);
                const unit = match[2];
                
                if (cssUnits.some(u => u.value === unit)) {
                    const pxValue = convertToPx(value, unit);
                    const convertedValue = convertFromPx(pxValue, toUnit);
                    results.push(`${value}${unit} = ${formatResult(convertedValue)}${toUnit}`);
                } else {
                    results.push(`${line} = Invalid unit`);
                }
            } else {
                results.push(`${line} = Invalid format`);
            }
        });
        
        setBatchResults(results);
    };

    // Swap units
    const swapUnits = () => {
        const tempUnit = fromUnit;
        setFromUnit(toUnit);
        setToUnit(tempUnit);
    };

    // Copy result to clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(result);
        toast.success('Result copied to clipboard!');
    };

    // Copy batch results to clipboard
    const handleCopyBatch = () => {
        const text = batchResults.join('\n');
        navigator.clipboard.writeText(text);
        toast.success('Batch results copied to clipboard!');
    };

    // Export results
    const handleExport = (format: 'json' | 'csv' | 'css') => {
        let content = '';
        let filename = '';
        let mimeType = '';
        
        if (format === 'json') {
            const data = {
                conversions: activeTab === 'single' 
                    ? [{ from: `${fromValue}${fromUnit}`, to: `${result}${toUnit}` }] 
                    : batchResults.map(r => {
                        const parts = r.split(' = ');
                        return { from: parts[0], to: parts[1] };
                    }),
                settings,
                exportedAt: new Date().toISOString()
            };
            content = JSON.stringify(data, null, 2);
            filename = 'css-unit-conversions.json';
            mimeType = 'application/json';
        } else if (format === 'csv') {
            if (activeTab === 'single') {
                content = 'From,To\n';
                content += `${fromValue}${fromUnit},${result}${toUnit}\n`;
            } else {
                content = 'From,To\n';
                batchResults.forEach(r => {
                    const parts = r.split(' = ');
                    content += `${parts[0]},${parts[1]}\n`;
                });
            }
            filename = 'css-unit-conversions.csv';
            mimeType = 'text/csv';
        } else if (format === 'css') {
            if (activeTab === 'single') {
                content = `/* CSS Unit Conversion */\n`;
                content += `/* ${fromValue}${fromUnit} = ${result}${toUnit} */\n\n`;
                content += `.element {\n`;
                content += `  property: ${result}${toUnit};\n`;
                content += `}\n`;
            } else {
                content = `/* CSS Unit Conversions */\n\n`;
                batchResults.forEach(r => {
                    const parts = r.split(' = ');
                    content += `/* ${parts[0]} = ${parts[1]} */\n`;
                });
                content += `\n.element {\n`;
                content += `  property: ${result}${toUnit};\n`;
                content += `}\n`;
            }
            filename = 'css-unit-conversions.css';
            mimeType = 'text/css';
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
        
        toast.success(`Results exported as ${filename}`);
    };

    // Use history item
    const useHistoryItem = (item: ConversionHistoryItem) => {
        setFromValue(item.fromValue.toString());
        setFromUnit(item.fromUnit);
        setToUnit(item.toUnit);
        setResult(formatResult(item.toValue));
        setSettings(item.settings);
        setActiveTab('single');
    };

    // Apply preset
    const applyPreset = (presetName: string) => {
        const preset = presets.find(p => p.name === presetName);
        if (preset) {
            setSettings(preset.settings);
            setActivePreset(presetName);
            toast.success(`Applied preset: ${presetName}`);
        }
    };

    // Save current settings as a new preset
    const saveAsPreset = () => {
        const name = prompt('Enter a name for the new preset:');
        if (name && !presets.some(p => p.name === name)) {
            const newPreset: ConversionPreset = {
                name,
                settings: { ...settings }
            };
            setPresets(prev => [...prev, newPreset]);
            setActivePreset(name);
            toast.success(`Saved new preset: ${name}`);
        } else if (presets.some(p => p.name === name)) {
            toast.error('A preset with this name already exists');
        }
    };

    // Initialize with a conversion
    useEffect(() => {
        convert();
    }, []);

    // Auto-convert when inputs change
    useEffect(() => {
        if (activeTab === 'single') {
            convert();
        }
    }, [fromValue, fromUnit, toUnit, settings, activeTab]);

    return (
        <div className="flex flex-col justify-center mx-auto p-2 md:p-8 space-y-8">
            <div className="flex flex-col gap-4 justify-between">
                <div className='flex justify-between gap-4 flex-wrap'>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            {tool.name}
                        </h1>
                    </div>
                    
                    <div className='flex gap-2 items-center'>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Settings className="w-4 h-4" />
                                    Setting
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Conversion Settings</DialogTitle>
                                    <DialogDescription>
                                        Configure settings for accurate CSS unit conversions
                                    </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Type className="w-5 h-5" />
                                            <h3 className="font-medium">Font Size Settings</h3>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label htmlFor="baseFontSize">Base Font Size: {settings.baseFontSize}px</Label>
                                                <Badge variant="outline">For % conversions</Badge>
                                            </div>
                                            <Slider
                                                min={8}
                                                max={72}
                                                step={1}
                                                value={[settings.baseFontSize]}
                                                onValueChange={([val]) => setSettings(prev => ({ ...prev, baseFontSize: val }))}
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label htmlFor="rootFontSize">Root Font Size: {settings.rootFontSize}px</Label>
                                                <Badge variant="outline">For rem conversions</Badge>
                                            </div>
                                            <Slider
                                                min={8}
                                                max={72}
                                                step={1}
                                                value={[settings.rootFontSize]}
                                                onValueChange={([val]) => setSettings(prev => ({ ...prev, rootFontSize: val }))}
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label htmlFor="parentFontSize">Parent Font Size: {settings.parentFontSize}px</Label>
                                                <Badge variant="outline">For em conversions</Badge>
                                            </div>
                                            <Slider
                                                min={8}
                                                max={72}
                                                step={1}
                                                value={[settings.parentFontSize]}
                                                onValueChange={([val]) => setSettings(prev => ({ ...prev, parentFontSize: val }))}
                                            />
                                        </div>
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Monitor className="w-5 h-5" />
                                            <h3 className="font-medium">Viewport Settings</h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="viewportWidth">Viewport Width: {settings.viewportWidth}px</Label>
                                                <Slider
                                                    min={320}
                                                    max={3840}
                                                    step={10}
                                                    value={[settings.viewportWidth]}
                                                    onValueChange={([val]) => setSettings(prev => ({ ...prev, viewportWidth: val }))}
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label htmlFor="viewportHeight">Viewport Height: {settings.viewportHeight}px</Label>
                                                <Slider
                                                    min={480}
                                                    max={2160}
                                                    step={10}
                                                    value={[settings.viewportHeight]}
                                                    onValueChange={([val]) => setSettings(prev => ({ ...prev, viewportHeight: val }))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Settings className="w-5 h-5" />
                                            <h3 className="font-medium">Presets</h3>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2">
                                            {presets.map(preset => (
                                                <Button 
                                                    key={preset.name}
                                                    variant={activePreset === preset.name ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => applyPreset(preset.name)}
                                                >
                                                    {preset.name}
                                                </Button>
                                            ))}
                                            <Button variant="ghost" size="sm" onClick={saveAsPreset}>
                                                Save Current as Preset
                                            </Button>
                                        </div>
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
                                    <DialogTitle>Conversion History</DialogTitle>
                                    <DialogDescription>
                                        Your recent CSS unit conversions
                                    </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {conversionHistory.length === 0 ? (
                                        <p className="text-muted-foreground text-center py-4">No conversion history yet</p>
                                    ) : (
                                        conversionHistory.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                                                <div className="font-mono text-sm">
                                                    {item.fromValue}{item.fromUnit} = {formatResult(item.toValue)}{item.toUnit}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground">
                                                        {item.timestamp.toLocaleTimeString()}
                                                    </span>
                                                    <Button size="sm" variant="ghost" onClick={() => useHistoryItem(item)}>
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
                                name: tool.name,
                                description: tool.description,
                                slug: tool.slug,
                                category: tool.category,
                                tags: tool.tags
                            }}
                            variant="secondary"
                            mdFilePath="content/learn/css-unit-converter.md"
                        />
                    </div>
                </div>
                <div>
                    <p className="text-muted-foreground">{tool.description}</p>
                </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="single">Single Conversion</TabsTrigger>
                    <TabsTrigger value="batch">Batch Conversion</TabsTrigger>
                </TabsList>
                
                <TabsContent value="single" className="space-y-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                <div className="md:col-span-5">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="fromValue">Convert</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="fromValue"
                                                type="text"
                                                value={fromValue}
                                                onChange={(e) => setFromValue(e.target.value)}
                                                placeholder="Enter value"
                                            />
                                            <Select value={fromUnit} onValueChange={setFromUnit}>
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {cssUnits.map(unit => (
                                                        <SelectItem key={unit.value} value={unit.value}>
                                                            {unit.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="md:col-span-2 flex justify-center">
                                    <Button size="icon" variant="outline" onClick={swapUnits}>
                                        <ArrowRightLeft className="w-4 h-4" />
                                    </Button>
                                </div>
                                
                                <div className="md:col-span-5">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="toValue">To</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="toValue"
                                                type="text"
                                                value={result}
                                                readOnly
                                                placeholder="Result"
                                            />
                                            <Select value={toUnit} onValueChange={setToUnit}>
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {cssUnits.map(unit => (
                                                        <SelectItem key={unit.value} value={unit.value}>
                                                            {unit.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-2 mt-4">
                                <Button size="sm" variant="outline" onClick={handleCopy}>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy Result
                                </Button>
                                <div className="flex gap-1">
                                    <Button size="sm" variant="outline" onClick={() => handleExport('css')}>
                                        CSS
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleExport('json')}>
                                        JSON
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleExport('csv')}>
                                        CSV
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Ruler className="w-5 h-5" />
                                    Visual Comparison
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm">{fromValue}{fromUnit}</span>
                                            <span className="text-sm text-muted-foreground">
                                                {formatResult(convertToPx(parseFloat(fromValue) || 0, fromUnit))}px
                                            </span>
                                        </div>
                                        <div 
                                            className="h-6 bg-blue-500 rounded"
                                            style={{ width: `${Math.min(100, convertToPx(parseFloat(fromValue) || 0, fromUnit) / 5)}%` }}
                                        ></div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm">{result}{toUnit}</span>
                                            <span className="text-sm text-muted-foreground">
                                                {formatResult(convertToPx(parseFloat(result) || 0, toUnit))}px
                                            </span>
                                        </div>
                                        <div 
                                            className="h-6 bg-green-500 rounded"
                                            style={{ width: `${Math.min(100, convertToPx(parseFloat(result) || 0, toUnit) / 5)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Info className="w-5 h-5" />
                                    Unit Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <h4 className="font-medium">{fromUnit}</h4>
                                        <p className="text-muted-foreground">
                                            {fromUnit === 'px' && 'Pixels are absolute units commonly used for precise measurements.'}
                                            {fromUnit === 'em' && 'Em units are relative to the font size of the parent element.'}
                                            {fromUnit === 'rem' && 'Rem units are relative to the font size of the root element (html).'}
                                            {fromUnit === '%' && 'Percentage units are relative to the parent element\'s size.'}
                                            {fromUnit === 'vw' && 'Viewport width units are relative to 1% of the viewport\'s width.'}
                                            {fromUnit === 'vh' && 'Viewport height units are relative to 1% of the viewport\'s height.'}
                                            {fromUnit === 'vmin' && 'Viewport min units are relative to 1% of the smaller viewport dimension.'}
                                            {fromUnit === 'vmax' && 'Viewport max units are relative to 1% of the larger viewport dimension.'}
                                            {fromUnit === 'pt' && 'Points are absolute units commonly used in print (1pt = 1/72 inch).'}
                                            {fromUnit === 'pc' && 'Picas are absolute units used in print (1pc = 12pt).'}
                                            {fromUnit === 'in' && 'Inches are absolute units (1in = 96px).'}
                                            {fromUnit === 'cm' && 'Centimeters are absolute units (1cm = 37.8px).'}
                                            {fromUnit === 'mm' && 'Millimeters are absolute units (1mm = 3.78px).'}
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-medium">{toUnit}</h4>
                                        <p className="text-muted-foreground">
                                            {toUnit === 'px' && 'Pixels are absolute units commonly used for precise measurements.'}
                                            {toUnit === 'em' && 'Em units are relative to the font size of the parent element.'}
                                            {toUnit === 'rem' && 'Rem units are relative to the font size of the root element (html).'}
                                            {toUnit === '%' && 'Percentage units are relative to the parent element\'s size.'}
                                            {toUnit === 'vw' && 'Viewport width units are relative to 1% of the viewport\'s width.'}
                                            {toUnit === 'vh' && 'Viewport height units are relative to 1% of the viewport\'s height.'}
                                            {toUnit === 'vmin' && 'Viewport min units are relative to 1% of the smaller viewport dimension.'}
                                            {toUnit === 'vmax' && 'Viewport max units are relative to 1% of the larger viewport dimension.'}
                                            {toUnit === 'pt' && 'Points are absolute units commonly used in print (1pt = 1/72 inch).'}
                                            {toUnit === 'pc' && 'Picas are absolute units used in print (1pc = 12pt).'}
                                            {toUnit === 'in' && 'Inches are absolute units (1in = 96px).'}
                                            {toUnit === 'cm' && 'Centimeters are absolute units (1cm = 37.8px).'}
                                            {toUnit === 'mm' && 'Millimeters are absolute units (1mm = 3.78px).'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                
                <TabsContent value="batch" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Batch Conversion</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Convert multiple values at once. Enter one value per line in format: "value unit" (e.g., "16px")
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="batchInput">Input Values</Label>
                                    <Textarea
                                        id="batchInput"
                                        placeholder="16px&#10;1.5rem&#10;100vw&#10;24pt"
                                        value={batchInput}
                                        onChange={(e) => setBatchInput(e.target.value)}
                                        rows={8}
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="batchResults">Results</Label>
                                    <Textarea
                                        id="batchResults"
                                        value={batchResults.join('\n')}
                                        readOnly
                                        rows={8}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 justify-between">
                                <div className="flex flex-col space-y-2">
                                    <Label>Convert to:</Label>
                                    <Select value={toUnit} onValueChange={setToUnit}>
                                        <SelectTrigger className="w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cssUnits.map(unit => (
                                                <SelectItem key={unit.value} value={unit.value}>
                                                    {unit.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="flex gap-2 items-end">
                                    <Button onClick={convertBatch}>
                                        <RefreshCcw className="w-4 h-4 mr-2" />
                                        Convert All
                                    </Button>
                                    <Button variant="outline" onClick={handleCopyBatch} disabled={batchResults.length === 0}>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy Results
                                    </Button>
                                    <div className="flex gap-1">
                                        <Button size="sm" variant="outline" onClick={() => handleExport('css')} disabled={batchResults.length === 0}>
                                            CSS
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => handleExport('json')} disabled={batchResults.length === 0}>
                                            JSON
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => handleExport('csv')} disabled={batchResults.length === 0}>
                                            CSV
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Example Conversions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium">Typography</h4>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full justify-start text-left"
                                        onClick={() => setBatchInput("16px\n1.5rem\n12pt\n0.75in")}
                                    >
                                        Common font sizes
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full justify-start text-left"
                                        onClick={() => setBatchInput("1em\n1.2em\n1.5em\n2em")}
                                    >
                                        Relative font sizes
                                    </Button>
                                </div>
                                
                                <div className="space-y-2">
                                    <h4 className="font-medium">Spacing</h4>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full justify-start text-left"
                                        onClick={() => setBatchInput("8px\n16px\n24px\n32px")}
                                    >
                                        Padding/margin sizes
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full justify-start text-left"
                                        onClick={() => setBatchInput("1rem\n1.5rem\n2rem\n3rem")}
                                    >
                                        Rem spacing scale
                                    </Button>
                                </div>
                                
                                <div className="space-y-2">
                                    <h4 className="font-medium">Viewport</h4>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full justify-start text-left"
                                        onClick={() => setBatchInput("100vw\n50vw\n25vw\n10vw")}
                                    >
                                        Width percentages
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full justify-start text-left"
                                        onClick={() => setBatchInput("100vh\n80vh\n60vh\n40vh")}
                                    >
                                        Height percentages
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}