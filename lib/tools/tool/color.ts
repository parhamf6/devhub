// Core Types
export type ColorFormat = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'hsv' | 'oklch' | 'lab' | 'lch' | 'cmyk' | 'p3' | 'rec2020';
export type HarmonyType = 'monochromatic' | 'complementary' | 'triadic' | 'tetradic' | 'analogous' | 'split-complementary';
export type ExportFormat = 'css' | 'scss' | 'js' | 'json' | 'tailwind' | 'bootstrap' | 'swift' | 'android' | 'figma' | 'sketch';

export interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number; a?: number };
  hsl: { h: number; s: number; l: number; a?: number };
  hsv: { h: number; s: number; v: number };
  oklch: { l: number; c: number; h: number };
  lab: { l: number; a: number; b: number };
  cmyk: { c: number; m: number; y: number; k: number };
  name?: string;
}

export interface ColorPalette {
  colors: Color[];
  type: HarmonyType;
  baseColor: Color;
}

export interface ContrastResult {
  ratio: number;
  AA: boolean;
  AAA: boolean;
  normalText: boolean;
  largeText: boolean;
  grade: 'AAA' | 'AA' | 'AA Large' | 'Fail';
}

export interface ColorAnalysis {
  contrast: ContrastResult;
  temperature: number;
  perceptualLightness: number;
  psychology: string[];
}

export interface GradientStop {
  color: string;
  position: number;
}

// Helper functions for color conversions
function hexToRgb(hex: string) {
  const parsed = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!parsed) return "";
  const [, r, g, b] = parsed;
  return `rgb(${parseInt(r!, 16)}, ${parseInt(g!, 16)}, ${parseInt(b!, 16)})`;
}

function hexToHsl(hex: string) {
  const rgb = hexToRgb(hex).match(/\d+/g)?.map(Number);
  if (!rgb) return "";
  let [r, g, b] = rgb.map((x) => x / 255);
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function hexToHsv(hex: string) {
  const rgb = hexToRgb(hex).match(/\d+/g)?.map(Number);
  if (!rgb) return "";
  let [r, g, b] = rgb.map((x) => x / 255);
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, v = max;
  let d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `hsv(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(v * 100)}%)`;
}

function hexToCmyk(hex: string) {
  const rgb = hexToRgb(hex).match(/\d+/g)?.map(Number);
  if (!rgb) return "";
  let [r, g, b] = rgb.map((x) => x / 255);
  let k = 1 - Math.max(r, g, b);
  let c = (1 - r - k) / (1 - k) || 0;
  let m = (1 - g - k) / (1 - k) || 0;
  let y = (1 - b - k) / (1 - k) || 0;
  return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
}

function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Color harmony generators
function generateMonochromatic(hsl: string): string[] {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return [];
  
  const h = parseInt(match[1], 10);
  const s = parseInt(match[2], 10);
  const l = parseInt(match[3], 10);
  
  return [
    hslToHex(h, s, Math.max(10, l - 30)),
    hslToHex(h, s, Math.max(10, l - 15)),
    hslToHex(h, s, l),
    hslToHex(h, s, Math.min(90, l + 15)),
    hslToHex(h, s, Math.min(90, l + 30)),
  ];
}

function generateAnalogous(hsl: string): string[] {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return [];
  
  const h = parseInt(match[1], 10);
  const s = parseInt(match[2], 10);
  const l = parseInt(match[3], 10);
  
  return [
    hslToHex((h + 330) % 360, s, l),
    hslToHex((h + 30) % 360, s, l),
    hslToHex(h, s, l),
    hslToHex((h + 60) % 360, s, l),
    hslToHex((h + 90) % 360, s, l),
  ];
}

function generateComplementary(hsl: string): string[] {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return [];
  
  const h = parseInt(match[1], 10);
  const s = parseInt(match[2], 10);
  const l = parseInt(match[3], 10);
  
  return [
    hslToHex(h, s, l),
    hslToHex((h + 180) % 360, s, l),
  ];
}

function generateSplitComplementary(hsl: string): string[] {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return [];
  
  const h = parseInt(match[1], 10);
  const s = parseInt(match[2], 10);
  const l = parseInt(match[3], 10);
  
  return [
    hslToHex((h + 150) % 360, s, l),
    hslToHex(h, s, l),
    hslToHex((h + 210) % 360, s, l),
  ];
}

function generateTriadic(hsl: string): string[] {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return [];
  
  const h = parseInt(match[1], 10);
  const s = parseInt(match[2], 10);
  const l = parseInt(match[3], 10);
  
  return [
    hslToHex(h, s, l),
    hslToHex((h + 120) % 360, s, l),
    hslToHex((h + 240) % 360, s, l),
  ];
}

function generateTetradic(hsl: string): string[] {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return [];
  
  const h = parseInt(match[1], 10);
  const s = parseInt(match[2], 10);
  const l = parseInt(match[3], 10);
  
  return [
    hslToHex(h, s, l),
    hslToHex((h + 90) % 360, s, l),
    hslToHex((h + 180) % 360, s, l),
    hslToHex((h + 270) % 360, s, l),
  ];
}

const colorTool = {
  name: "Advanced Color Tool",
  slug: "advanced-color-tool",
  description: "Professional color manipulation and palette generation tool for developers",
  category: "Design",
  version: "2.0.0",
  tags: ["Design", "Color", "Accessibility", "CSS", "Development"],
};

export default colorTool;
export {hexToRgb , hexToHsl, hexToHsv ,hexToCmyk , hslToHex, generateAnalogous
  ,generateMonochromatic , generateComplementary, generateSplitComplementary, generateTetradic,
  generateTriadic
}