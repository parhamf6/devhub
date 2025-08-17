"use client"
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Copy, Shuffle, Trash2, Palette, Droplet, Download, X } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";
import { LearnButton } from '@/features/dashboard/tools/components/learn-button';
import colorTool from "@/lib/tools/tool/color";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { 
    hexToRgb , hexToHsl, hexToHsv ,hexToCmyk
    ,hslToHex, generateAnalogous
    ,generateMonochromatic , generateComplementary, 
    generateSplitComplementary, generateTetradic,
    generateTriadic
} from "@/lib/tools/tool/color";

const tool = colorTool;
// Color harmony types
const HARMONY_TYPES = [
  { id: "monochromatic", name: "Monochromatic" },
  { id: "analogous", name: "Analogous" },
  { id: "complementary", name: "Complementary" },
  { id: "splitComplementary", name: "Split Complementary" },
  { id: "triadic", name: "Triadic" },
  { id: "tetradic", name: "Tetradic" },
];

// Color format options
const COLOR_FORMATS = [
  { id: "hex", name: "HEX" },
  { id: "rgb", name: "RGB" },
  { id: "hsl", name: "HSL" },
  { id: "hsv", name: "HSV" },
  { id: "cmyk", name: "CMYK" },
  { id: "name", name: "Color Name" },
];

// Export format options
const EXPORT_FORMATS = [
  { id: "css", name: "CSS Variables" },
  { id: "json", name: "JSON" },
  { id: "scss", name: "SCSS Variables" },
  { id: "tailwind", name: "Tailwind Config" },
  { id: "array", name: "Array" },
];

export default function ColorPickerPage() {
  const [color, setColor] = useState("#e5c07b");
  const [savedColors, setSavedColors] = useState<string[]>([]);
  const [harmonyType, setHarmonyType] = useState("analogous");
  const [harmonyColors, setHarmonyColors] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState("hex");
  const [colorName, setColorName] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  // Export dialog states
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedHarmonyTypes, setSelectedHarmonyTypes] = useState<string[]>(["analogous"]);
  const [exportFormat, setExportFormat] = useState("css");

  useEffect(() => {
    const saved = localStorage.getItem("savedColors");
    if (saved) setSavedColors(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("savedColors", JSON.stringify(savedColors));
  }, [savedColors]);

  useEffect(() => {
    generateHarmonyColors();
  }, [color, harmonyType]);

  // Parse input color and detect format
  const parseColorInput = (input: string) => {
    // Trim whitespace
    input = input.trim();
    
    // Hex format
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(input)) {
      return input;
    }
    
    // RGB format
    const rgbMatch = input.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    // HSL format
    const hslMatch = input.match(/^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/i);
    if (hslMatch) {
      const h = parseInt(hslMatch[1], 10);
      const s = parseInt(hslMatch[2], 10);
      const l = parseInt(hslMatch[3], 10);
      return hslToHex(h, s, l);
    }
    
    // Named colors (basic set)
    const namedColors: Record<string, string> = {
      "red": "#FF0000",
      "green": "#00FF00",
      "blue": "#0000FF",
      "yellow": "#FFFF00",
      "orange": "#FFA500",
      "purple": "#800080",
      "pink": "#FFC0CB",
      "black": "#000000",
      "white": "#FFFFFF",
      "gray": "#808080",
      "brown": "#A52A2A",
      "cyan": "#00FFFF",
      "magenta": "#FF00FF",
      "lime": "#00FF00",
      "maroon": "#800000",
      "olive": "#808000",
      "teal": "#008080",
      "navy": "#000080",
    };
    
    if (namedColors[input.toLowerCase()]) {
      return namedColors[input.toLowerCase()];
    }
    
    // If no format matches, return the original input
    return input;
  };

  // Generate harmony colors based on selected type
  const generateHarmonyColors = () => {
    const baseColor = hexToHsl(color);
    if (!baseColor) return;
    
    let colors: string[] = [];
    
    switch (harmonyType) {
      case "monochromatic":
        colors = generateMonochromatic(baseColor);
        break;
      case "analogous":
        colors = generateAnalogous(baseColor);
        break;
      case "complementary":
        colors = generateComplementary(baseColor);
        break;
      case "splitComplementary":
        colors = generateSplitComplementary(baseColor);
        break;
      case "triadic":
        colors = generateTriadic(baseColor);
        break;
      case "tetradic":
        colors = generateTetradic(baseColor);
        break;
      default:
        colors = [color];
    }
    
    setHarmonyColors(colors);
  };

  // Generate random color
  const shuffleColor = () => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setColor(randomColor);
    toast.success("Random color generated!");
  };

  // Save color to palette
  const saveColor = () => {
    if (!savedColors.includes(color)) {
      setSavedColors([...savedColors, color]);
      toast.success("Color saved to palette!");
    } else {
      toast.warning("Color already in palette");
    }
  };

  // Remove color from palette
  const removeColor = (colorToRemove: string) => {
    setSavedColors(savedColors.filter(c => c !== colorToRemove));
    toast.success("Color removed from palette");
  };

  // Copy to clipboard
  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard!");
  };

  // Handle harmony type selection for export
  const handleHarmonyTypeToggle = (type: string) => {
    setSelectedHarmonyTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  // Generate export data based on selected options
  const generateExportData = () => {
    const data: any = {
      baseColor: color,
      savedColors: savedColors,
      timestamp: new Date().toISOString(),
    };

    // Add selected harmony types
    data.harmonies = {};
    selectedHarmonyTypes.forEach(type => {
      const baseColorHsl = hexToHsl(color);
      if (!baseColorHsl) return;
      
      let colors: string[] = [];
      switch (type) {
        case "monochromatic":
          colors = generateMonochromatic(baseColorHsl);
          break;
        case "analogous":
          colors = generateAnalogous(baseColorHsl);
          break;
        case "complementary":
          colors = generateComplementary(baseColorHsl);
          break;
        case "splitComplementary":
          colors = generateSplitComplementary(baseColorHsl);
          break;
        case "triadic":
          colors = generateTriadic(baseColorHsl);
          break;
        case "tetradic":
          colors = generateTetradic(baseColorHsl);
          break;
      }
      
      data.harmonies[type] = colors;
    });

    // Format based on selected export format
    switch (exportFormat) {
      case "css":
        return generateCssVariables(data);
      case "json":
        return JSON.stringify(data, null, 2);
      case "scss":
        return generateScssVariables(data);
      case "tailwind":
        return generateTailwindConfig(data);
      case "array":
        return generateArrayFormat(data);
      default:
        return JSON.stringify(data, null, 2);
    }
  };

  // Generate CSS variables format
  const generateCssVariables = (data: any) => {
    let css = `:root {\n`;
    css += `  --color-base: ${data.baseColor};\n`;
    
    if (data.savedColors && data.savedColors.length > 0) {
      data.savedColors.forEach((color: string, index: number) => {
        css += `  --color-saved-${index + 1}: ${color};\n`;
      });
    }
    
    if (data.harmonies) {
      Object.entries(data.harmonies).forEach(([type, colors]: [string, any]) => {
        colors.forEach((color: string, index: number) => {
          css += `  --color-${type}-${index + 1}: ${color};\n`;
        });
      });
    }
    
    css += `}`;
    return css;
  };

  // Generate SCSS variables format
  const generateScssVariables = (data: any) => {
    let scss = `// Color Variables\n`;
    scss += `$color-base: ${data.baseColor};\n`;
    
    if (data.savedColors && data.savedColors.length > 0) {
      data.savedColors.forEach((color: string, index: number) => {
        scss += `$color-saved-${index + 1}: ${color};\n`;
      });
    }
    
    if (data.harmonies) {
      Object.entries(data.harmonies).forEach(([type, colors]: [string, any]) => {
        colors.forEach((color: string, index: number) => {
          scss += `$color-${type}-${index + 1}: ${color};\n`;
        });
      });
    }
    
    return scss;
  };

  // Generate Tailwind config format
  const generateTailwindConfig = (data: any) => {
    let config = `module.exports = {\n`;
    config += `  theme: {\n`;
    config += `    extend: {\n`;
    config += `      colors: {\n`;
    config += `        base: '${data.baseColor}',\n`;
    
    if (data.savedColors && data.savedColors.length > 0) {
      data.savedColors.forEach((color: string, index: number) => {
        config += `        'saved-${index + 1}': '${color}',\n`;
      });
    }
    
    if (data.harmonies) {
      Object.entries(data.harmonies).forEach(([type, colors]: [string, any]) => {
        colors.forEach((color: string, index: number) => {
          config += `        '${type}-${index + 1}': '${color}',\n`;
        });
      });
    }
    
    config += `      }\n`;
    config += `    }\n`;
    config += `  }\n`;
    config += `}`;
    return config;
  };

  // Generate array format
  const generateArrayFormat = (data: any) => {
    let array = `[\n`;
    array += `  "${data.baseColor}",\n`;
    
    if (data.savedColors && data.savedColors.length > 0) {
      data.savedColors.forEach((color: string) => {
        array += `  "${color}",\n`;
      });
    }
    
    if (data.harmonies) {
      Object.entries(data.harmonies).forEach(([, colors]: [string, any]) => {
        colors.forEach((color: string) => {
          array += `  "${color}",\n`;
        });
      });
    }
    
    array += `]`;
    return array;
  };

  // Download palette with selected options
  const downloadPalette = () => {
    const exportData = generateExportData();
    const dataStr = `data:text/${exportFormat === 'json' ? 'json' : 'plain'};charset=utf-8,` + encodeURIComponent(exportData);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    
    let fileExtension = 'txt';
    switch (exportFormat) {
      case 'css':
        fileExtension = 'css';
        break;
      case 'json':
        fileExtension = 'json';
        break;
      case 'scss':
        fileExtension = 'scss';
        break;
      case 'tailwind':
        fileExtension = 'js';
        break;
      case 'array':
        fileExtension = 'txt';
        break;
    }
    
    downloadAnchorNode.setAttribute("download", `color-palette-${Date.now()}.${fileExtension}`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast.success("Palette downloaded!");
    setIsExportDialogOpen(false);
  };

  // Handle input change with format detection
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedColor = parseColorInput(value);
    setColor(parsedColor);
  };

  // Get color formats
  const formats = {
    hex: color,
    rgb: hexToRgb(color),
    hsl: hexToHsl(color),
    hsv: hexToHsv(color),
    cmyk: hexToCmyk(color),
    name: colorName,
  };

  return (
    <div className="container mx-auto p-2 md:p-6 space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{tool.name}</h1>
            <p className="text-muted-foreground mt-1">{tool.description}</p>
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
              mdFilePath="content/learn/color.md"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Left Column - Color Picker and Controls */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-primary" />
                  Color Picker
                </CardTitle>
                <div>
                  <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline"
                      disabled={savedColors.length === 0}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Export Color Palette</DialogTitle>
                      <DialogDescription>
                        Select which harmony types to include and choose the export format.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Harmony Types</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {HARMONY_TYPES.map(type => (
                            <div key={type.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`harmony-${type.id}`}
                                checked={selectedHarmonyTypes.includes(type.id)}
                                onCheckedChange={() => handleHarmonyTypeToggle(type.id)}
                              />
                              <Label htmlFor={`harmony-${type.id}`} className="text-sm">
                                {type.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Export Format</h4>
                        <Select value={exportFormat} onValueChange={setExportFormat}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {EXPORT_FORMATS.map(format => (
                              <SelectItem key={format.id} value={format.id}>
                                {format.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={downloadPalette}>
                        Export
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                </div>
              </div>
              
            </CardHeader>
            <CardContent className="p-2 md:p-4 space-y-6">
              <div className="flex justify-center">
                <HexColorPicker color={color} onChange={setColor} className="w-full max-w-xs" />
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Input
                      value={color}
                      onChange={handleInputChange}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      className="w-full font-mono"
                      placeholder="#RRGGBB"
                    />
                    {!isInputFocused && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-end pr-3">
                        <div 
                          className="w-5 h-5 rounded-full border border-border" 
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    )}
                  </div>
                  <Button onClick={shuffleColor} size="icon" variant="outline">
                    <Shuffle className="h-4 w-4" />
                  </Button>
                  <Button onClick={saveColor} className="whitespace-nowrap">
                    Save Color
                  </Button>
                </div>
                
                {/* <div className="flex items-center gap-2">
                  <Label htmlFor="format-select">Output Format:</Label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger id="format-select" className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COLOR_FORMATS.map(format => (
                        <SelectItem key={format.id} value={format.id}>
                          {format.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div> */}
              </div>
            </CardContent>
          </Card>

          {/* Color Formats */}
          <Card>
            <CardHeader className="">
              <CardTitle className="flex items-center gap-2">
                <Copy className="h-5 w-5 text-primary" />
                Color Formats
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 md:p-4">
              <Tabs defaultValue="hex" className="w-full">
                <TabsList className=" w-full">
                  {COLOR_FORMATS.map(format => (
                    <TabsTrigger key={format.id} value={format.id} className="text-xs">
                      {format.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {Object.entries(formats).map(([key, value]) => (
                  <TabsContent key={key} value={key} className="mt-4">
                    <div className="flex items-center justify-between p-3 bg-violet text-violet-foreground rounded-md">
                      <span className="font-mono text-sm break-all pr-2">{value}</span>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => copyToClipboard(value)}
                        className="flex-shrink-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Harmony and Palette */}
        <div className="space-y-6">
          {/* Color Harmony */}
          <Card>
            <CardHeader className="">
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Color Harmony
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 md:p-4 space-y-4">
              <div className="flex flex-wrap gap-2">
                {HARMONY_TYPES.map(type => (
                  <Button
                    key={type.id}
                    variant={harmonyType === type.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHarmonyType(type.id)}
                  >
                    {type.name}
                  </Button>
                ))}
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                {harmonyColors.map((col, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="aspect-square rounded-md cursor-pointer border border-border shadow-sm hover:shadow-md transition-shadow"
                          style={{ backgroundColor: col }}
                          onClick={() => setColor(col)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{col}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Saved Colors */}
          <Card>
            <CardHeader className="bg-muted/30">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Saved Colors
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-2 md:p-4">
              {savedColors.length > 0 ? (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {savedColors.map((col, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="relative group">
                            <div
                              className="aspect-square rounded-md cursor-pointer border border-border shadow-sm hover:shadow-md transition-shadow"
                              style={{ backgroundColor: col }}
                              onClick={() => setColor(col)}
                            />
                            <Button
                              size="icon"
                              variant="destructive"
                              className="absolute -top-2 -right-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeColor(col);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{col}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No saved colors yet.</p>
                  <p className="text-sm mt-1">Click "Save Color" to add colors to your palette.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}