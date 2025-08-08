// lib/tools/tool/jsontoml.ts
import * as toml from '@iarna/toml';
import { ToolSchema } from '../tool-schema';

export type ConversionMode = 'json-to-toml' | 'toml-to-json' | 'auto-detect';
export type OutputFormat = 'pretty' | 'minified' | 'compact';

export interface ConversionOptions {
  mode: ConversionMode;
  outputFormat: OutputFormat;
  indentSize: number;
  sortKeys: boolean;
  preserveComments: boolean;
  tomlArrayStyle: 'inline' | 'multiline';
}

export interface ConversionResult {
  success: boolean;
  output: string;
  error?: string;
  errorLine?: number;
  errorColumn?: number;
  inputFormat?: 'json' | 'toml';
  outputFormat?: 'json' | 'toml';
  stats: {
    inputSize: number;
    outputSize: number;
    processingTime: number;
  };
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  errorLine?: number;
  errorColumn?: number;
  format?: 'json' | 'toml';
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  input: string;
  output: string;
  inputFormat: 'json' | 'toml';
  outputFormat: 'json' | 'toml';
  options: ConversionOptions;
}

class JsonTomlConverter {
  private history: HistoryItem[] = [];
  private maxHistoryItems = 50;

  // Auto-detect input format
  detectFormat(input: string): 'json' | 'toml' | 'unknown' {
    const trimmed = input.trim();
    
    if (!trimmed) return 'unknown';
    
    // JSON detection
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || 
        (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        JSON.parse(trimmed);
        return 'json';
      } catch {
        // Continue to TOML detection
      }
    }
    
    // TOML detection - look for TOML-specific patterns
    const tomlPatterns = [
      /^[\s]*[\w-]+[\s]*=[\s]*.+/m, // Key-value pairs
      /^[\s]*\[[\w.-]+\]/m, // Tables
      /^[\s]*\[\[[\w.-]+\]\]/m, // Array of tables
      /^[\s]*#/m, // Comments
    ];
    
    const hasTomlPatterns = tomlPatterns.some(pattern => pattern.test(trimmed));
    
    if (hasTomlPatterns) {
      try {
        toml.parse(trimmed);
        return 'toml';
      } catch {
        // Continue to final checks
      }
    }
    
    // Try parsing as JSON first (more strict)
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      // Try parsing as TOML
      try {
        toml.parse(trimmed);
        return 'toml';
      } catch {
        return 'unknown';
      }
    }
  }

  // Validate input
  validate(input: string, format?: 'json' | 'toml'): ValidationResult {
    const trimmed = input.trim();
    
    if (!trimmed) {
      return { isValid: false, error: 'Input is empty' };
    }
    
    const detectedFormat = format || this.detectFormat(trimmed);
    
    if (detectedFormat === 'unknown') {
      return { 
        isValid: false, 
        error: 'Unable to detect valid JSON or TOML format' 
      };
    }
    
    try {
      if (detectedFormat === 'json') {
        JSON.parse(trimmed);
        return { isValid: true, format: 'json' };
      } else {
        toml.parse(trimmed);
        return { isValid: true, format: 'toml' };
      }
    } catch (error: any) {
      // Extract line and column from error message if available
      let errorLine, errorColumn;
      const lineMatch = error.message.match(/line (\d+)/);
      const colMatch = error.message.match(/column (\d+)/);
      
      if (lineMatch) errorLine = parseInt(lineMatch[1]);
      if (colMatch) errorColumn = parseInt(colMatch[1]);
      
      return {
        isValid: false,
        error: error.message,
        errorLine,
        errorColumn,
        format: detectedFormat
      };
    }
  }

  // Convert JSON to TOML
  private jsonToToml(jsonString: string, options: ConversionOptions): string {
    const parsed = JSON.parse(jsonString);
    
    const tomlOptions: toml.JsonToTomlOptions = {
      indent: options.indentSize,
      sortKeys: options.sortKeys,
      arrayStyle: options.tomlArrayStyle,
    };
    
    return toml.stringify(parsed, tomlOptions);
  }

  // Convert TOML to JSON
  private tomlToJson(tomlString: string, options: ConversionOptions): string {
    const parsed = toml.parse(tomlString);
    
    if (options.outputFormat === 'minified') {
      return JSON.stringify(parsed);
    } else {
      const space = options.outputFormat === 'pretty' ? options.indentSize : 0;
      return JSON.stringify(parsed, options.sortKeys ? this.getSortedKeys(parsed) : null, space);
    }
  }

  // Helper function to get sorted keys for JSON stringify
  private getSortedKeys(obj: any): (string | number)[] {
    if (typeof obj !== 'object' || obj === null) {
      return [];
    }
    
    if (Array.isArray(obj)) {
      return obj.map((_, index) => index);
    }
    
    return Object.keys(obj).sort();
  }

  // Main conversion function
  convert(input: string, options: ConversionOptions): ConversionResult {
    const startTime = performance.now();
    
    try {
      const trimmed = input.trim();
      
      if (!trimmed) {
        return {
          success: false,
          output: '',
          error: 'Input is empty',
          stats: {
            inputSize: 0,
            outputSize: 0,
            processingTime: performance.now() - startTime
          }
        };
      }
      
      let inputFormat: 'json' | 'toml';
      let outputFormat: 'json' | 'toml';
      let output: string;
      
      // Determine conversion direction
      if (options.mode === 'auto-detect') {
        const detected = this.detectFormat(trimmed);
        if (detected === 'unknown') {
          return {
            success: false,
            output: '',
            error: 'Unable to detect valid JSON or TOML format',
            stats: {
              inputSize: input.length,
              outputSize: 0,
              processingTime: performance.now() - startTime
            }
          };
        }
        inputFormat = detected;
        outputFormat = detected === 'json' ? 'toml' : 'json';
      } else {
        inputFormat = options.mode === 'json-to-toml' ? 'json' : 'toml';
        outputFormat = options.mode === 'json-to-toml' ? 'toml' : 'json';
      }
      
      // Validate input
      const validation = this.validate(trimmed, inputFormat);
      if (!validation.isValid) {
        return {
          success: false,
          output: '',
          error: validation.error,
          errorLine: validation.errorLine,
          errorColumn: validation.errorColumn,
          stats: {
            inputSize: input.length,
            outputSize: 0,
            processingTime: performance.now() - startTime
          }
        };
      }
      
      // Perform conversion
      if (inputFormat === 'json') {
        output = this.jsonToToml(trimmed, options);
      } else {
        output = this.tomlToJson(trimmed, options);
      }
      
      const result: ConversionResult = {
        success: true,
        output,
        inputFormat,
        outputFormat,
        stats: {
          inputSize: input.length,
          outputSize: output.length,
          processingTime: performance.now() - startTime
        }
      };
      
      // Add to history
      this.addToHistory({
        id: Date.now().toString(),
        timestamp: Date.now(),
        input: trimmed,
        output,
        inputFormat,
        outputFormat,
        options
      });
      
      return result;
    } catch (error: any) {
      return {
        success: false,
        output: '',
        error: error.message,
        stats: {
          inputSize: input.length,
          outputSize: 0,
          processingTime: performance.now() - startTime
        }
      };
    }
  }

  // Beautify JSON
  beautifyJson(jsonString: string, indentSize: number = 2): ConversionResult {
    const startTime = performance.now();
    
    try {
      const parsed = JSON.parse(jsonString);
      const output = JSON.stringify(parsed, null, indentSize);
      
      return {
        success: true,
        output,
        inputFormat: 'json',
        outputFormat: 'json',
        stats: {
          inputSize: jsonString.length,
          outputSize: output.length,
          processingTime: performance.now() - startTime
        }
      };
    } catch (error: any) {
      return {
        success: false,
        output: '',
        error: error.message,
        stats: {
          inputSize: jsonString.length,
          outputSize: 0,
          processingTime: performance.now() - startTime
        }
      };
    }
  }

  // Minify JSON
  minifyJson(jsonString: string): ConversionResult {
    const startTime = performance.now();
    
    try {
      const parsed = JSON.parse(jsonString);
      const output = JSON.stringify(parsed);
      
      return {
        success: true,
        output,
        inputFormat: 'json',
        outputFormat: 'json',
        stats: {
          inputSize: jsonString.length,
          outputSize: output.length,
          processingTime: performance.now() - startTime
        }
      };
    } catch (error: any) {
      return {
        success: false,
        output: '',
        error: error.message,
        stats: {
          inputSize: jsonString.length,
          outputSize: 0,
          processingTime: performance.now() - startTime
        }
      };
    }
  }

  // Format TOML
  formatToml(tomlString: string, options: ConversionOptions): ConversionResult {
    const startTime = performance.now();
    
    try {
      const parsed = toml.parse(tomlString);
      const output = toml.stringify(parsed, {
        indent: options.indentSize,
        sortKeys: options.sortKeys,
        arrayStyle: options.tomlArrayStyle,
      });
      
      return {
        success: true,
        output,
        inputFormat: 'toml',
        outputFormat: 'toml',
        stats: {
          inputSize: tomlString.length,
          outputSize: output.length,
          processingTime: performance.now() - startTime
        }
      };
    } catch (error: any) {
      return {
        success: false,
        output: '',
        error: error.message,
        stats: {
          inputSize: tomlString.length,
          outputSize: 0,
          processingTime: performance.now() - startTime
        }
      };
    }
  }

  // History management
  addToHistory(item: HistoryItem): void {
    this.history.unshift(item);
    if (this.history.length > this.maxHistoryItems) {
      this.history = this.history.slice(0, this.maxHistoryItems);
    }
  }

  getHistory(): HistoryItem[] {
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
  }

  getHistoryItem(id: string): HistoryItem | undefined {
    return this.history.find(item => item.id === id);
  }

  // File operations
  generateFileName(format: 'json' | 'toml'): string {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    return `converted-${timestamp}.${format}`;
  }

  // Statistics
  getConversionStats(input: string, output: string, processingTime: number) {
    return {
      inputSize: input.length,
      outputSize: output.length,
      compressionRatio: input.length > 0 ? (output.length / input.length).toFixed(2) : '0',
      processingTime: `${processingTime.toFixed(2)}ms`,
      inputLines: input.split('\n').length,
      outputLines: output.split('\n').length
    };
  }
}

// Export the converter instance and schema
const converterInstance = new JsonTomlConverter();
const jsonTomlConverter = {
  name: "JSON ↔ TOML Converter",
  slug: "json-toml-converter",
  description: "Advanced JSON ⇄ TOML converter with validation, formatting, and history",
  category: "Converter",
  version: "1.0.0",
  tags: ["JSON", "TOML", "Converter", "Formatter", "Validator"],
  converter: converterInstance,
};

export default jsonTomlConverter;
export { converterInstance };