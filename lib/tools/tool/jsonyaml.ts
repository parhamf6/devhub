// lib/tools/tool/jsonyaml.ts
import * as yaml from 'js-yaml';
// import * as yaml from 'js-yaml'
export type ConversionMode = 'json-to-yaml' | 'yaml-to-json' | 'auto-detect';
export type OutputFormat = 'pretty' | 'minified' | 'compact';
import { ToolSchema } from '../tool-schema';

export interface ConversionOptions {
  mode: ConversionMode;
  outputFormat: OutputFormat;
  indentSize: number;
  sortKeys: boolean;
  preserveComments: boolean;
  yamlFlowLevel: number;
}

export interface ConversionResult {
  success: boolean;
  output: string;
  error?: string;
  errorLine?: number;
  errorColumn?: number;
  inputFormat?: 'json' | 'yaml';
  outputFormat?: 'json' | 'yaml';
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
  format?: 'json' | 'yaml';
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  input: string;
  output: string;
  inputFormat: 'json' | 'yaml';
  outputFormat: 'json' | 'yaml';
  options: ConversionOptions;
}

class JsonYamlConverter {
  private history: HistoryItem[] = [];
  private maxHistoryItems = 50;

  // Auto-detect input format
  detectFormat(input: string): 'json' | 'yaml' | 'unknown' {
    const trimmed = input.trim();
    
    if (!trimmed) return 'unknown';
    
    // JSON detection
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || 
        (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        JSON.parse(trimmed);
        return 'json';
      } catch {
        // Continue to YAML detection
      }
    }
    
    // YAML detection - look for YAML-specific patterns
    const yamlPatterns = [
      /^[\s]*-[\s]+/m, // List items
      /^[\s]*[\w-]+:[\s]*$/m, // Key without value on same line
      /^[\s]*[\w-]+:[\s]+[^{[]/, // Key with simple value
      /^---/m, // Document separator
      /^[\s]*#/m // Comments
    ];
    
    const hasYamlPatterns = yamlPatterns.some(pattern => pattern.test(trimmed));
    
    if (hasYamlPatterns) {
      try {
        yaml.load(trimmed);
        return 'yaml';
      } catch {
        // Continue to final checks
      }
    }
    
    // Try parsing as JSON first (more strict)
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      // Try parsing as YAML
      try {
        yaml.load(trimmed);
        return 'yaml';
      } catch {
        return 'unknown';
      }
    }
  }

  // Validate input
  validate(input: string, format?: 'json' | 'yaml'): ValidationResult {
    const trimmed = input.trim();
    
    if (!trimmed) {
      return { isValid: false, error: 'Input is empty' };
    }

    const detectedFormat = format || this.detectFormat(trimmed);
    
    if (detectedFormat === 'unknown') {
      return { 
        isValid: false, 
        error: 'Unable to detect valid JSON or YAML format' 
      };
    }

    try {
      if (detectedFormat === 'json') {
        JSON.parse(trimmed);
        return { isValid: true, format: 'json' };
      } else {
        yaml.load(trimmed, { json: true });
        return { isValid: true, format: 'yaml' };
      }
    } catch (error: any) {
      const errorMatch = error.message.match(/at line (\d+), column (\d+)/);
      return {
        isValid: false,
        error: error.message,
        errorLine: errorMatch ? parseInt(errorMatch[1]) : undefined,
        errorColumn: errorMatch ? parseInt(errorMatch[2]) : undefined,
        format: detectedFormat
      };
    }
  }

  // Convert JSON to YAML
  private jsonToYaml(jsonString: string, options: ConversionOptions): string {
    const parsed = JSON.parse(jsonString);
    
    const yamlOptions: yaml.DumpOptions = {
      indent: options.indentSize,
      lineWidth: -1,
      noRefs: true,
      sortKeys: options.sortKeys,
      flowLevel: options.yamlFlowLevel === -1 ? undefined : options.yamlFlowLevel,
    };

    if (options.outputFormat === 'compact') {
      yamlOptions.flowLevel = 0;
    }

    return yaml.dump(parsed, yamlOptions);
  }

  // Convert YAML to JSON
  private yamlToJson(yamlString: string, options: ConversionOptions): string {
    const parsed = yaml.load(yamlString, { json: true });
    
    if (options.outputFormat === 'minified') {
      return JSON.stringify(parsed);
    } else {
      const space = options.outputFormat === 'pretty' ? options.indentSize : 0;
      return JSON.stringify(parsed, options.sortKeys ? Object.keys(parsed as object).sort((a, b) => a.localeCompare(b)) : null, space);
    }
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

      let inputFormat: 'json' | 'yaml';
      let outputFormat: 'json' | 'yaml';
      let output: string;

      // Determine conversion direction
      if (options.mode === 'auto-detect') {
        const detected = this.detectFormat(trimmed);
        if (detected === 'unknown') {
          return {
            success: false,
            output: '',
            error: 'Unable to detect valid JSON or YAML format',
            stats: {
              inputSize: input.length,
              outputSize: 0,
              processingTime: performance.now() - startTime
            }
          };
        }
        inputFormat = detected;
        outputFormat = detected === 'json' ? 'yaml' : 'json';
      } else {
        inputFormat = options.mode === 'json-to-yaml' ? 'json' : 'yaml';
        outputFormat = options.mode === 'json-to-yaml' ? 'yaml' : 'json';
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
        output = this.jsonToYaml(trimmed, options);
      } else {
        output = this.yamlToJson(trimmed, options);
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
  generateFileName(format: 'json' | 'yaml'): string {
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
const converterInstance = new JsonYamlConverter();

const jsonYamlConverter = {
  name: "JSON ↔ YAML Converter",
  slug: "json-yaml-converter",
  description: "Advanced JSON ⇄ YAML converter with validation, formatting, and history",
  category: "Converter",
  version: "1.0.0",
  tags: ["JSON", "YAML", "Converter", "Formatter", "Validator"],
  converter: converterInstance,
};

export default jsonYamlConverter;
export { converterInstance };