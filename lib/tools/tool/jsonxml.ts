// lib/tools/tool/jsonxml.ts
import { parseString, Builder } from 'xml2js';
import { parse } from 'js2xmlparser';

export type ConversionMode = 'json-to-xml' | 'xml-to-json' | 'auto-detect';
export type OutputFormat = 'pretty' | 'minified' | 'compact';
import { ToolSchema } from '../tool-schema';

export interface ConversionOptions {
  mode: ConversionMode;
  outputFormat: OutputFormat;
  indentSize: number;
  sortKeys: boolean;
  preserveComments: boolean;
  xmlDeclaration: boolean;
  rootElement: string;
  attributeNamePrefix: string;
  textNodeName: string;
}

export interface ConversionResult {
  success: boolean;
  output: string;
  error?: string;
  errorLine?: number;
  errorColumn?: number;
  inputFormat?: 'json' | 'xml';
  outputFormat?: 'json' | 'xml';
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
  format?: 'json' | 'xml';
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  input: string;
  output: string;
  inputFormat: 'json' | 'xml';
  outputFormat: 'json' | 'xml';
  options: ConversionOptions;
}

class JsonXmlConverter {
  private history: HistoryItem[] = [];
  private maxHistoryItems = 50;

  // Auto-detect input format
  detectFormat(input: string): 'json' | 'xml' | 'unknown' {
    const trimmed = input.trim();
    
    if (!trimmed) return 'unknown';
    
    // JSON detection
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || 
        (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        JSON.parse(trimmed);
        return 'json';
      } catch {
        // Continue to XML detection
      }
    }
    
    // XML detection
    if (trimmed.startsWith('<?xml') || trimmed.startsWith('<')) {
      try {
        parseString(trimmed, () => {});
        return 'xml';
      } catch {
        // Continue to final checks
      }
    }
    
    // Try parsing as JSON first (more strict)
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      // Try parsing as XML
      try {
        parseString(trimmed, () => {});
        return 'xml';
      } catch {
        return 'unknown';
      }
    }
  }

  // Validate input
  validate(input: string, format?: 'json' | 'xml'): ValidationResult {
    const trimmed = input.trim();
    
    if (!trimmed) {
      return { isValid: false, error: 'Input is empty' };
    }
    
    const detectedFormat = format || this.detectFormat(trimmed);
    
    if (detectedFormat === 'unknown') {
      return { 
        isValid: false, 
        error: 'Unable to detect valid JSON or XML format' 
      };
    }
    
    try {
      if (detectedFormat === 'json') {
        JSON.parse(trimmed);
        return { isValid: true, format: 'json' };
      } else {
        parseString(trimmed, () => {});
        return { isValid: true, format: 'xml' };
      }
    } catch (error: any) {
      const errorMatch = error.message.match(/line (\d+), column (\d+)/);
      return {
        isValid: false,
        error: error.message,
        errorLine: errorMatch ? parseInt(errorMatch[1]) : undefined,
        errorColumn: errorMatch ? parseInt(errorMatch[2]) : undefined,
        format: detectedFormat
      };
    }
  }

  // Convert JSON to XML
  private jsonToXml(jsonString: string, options: ConversionOptions): string {
    const parsed = JSON.parse(jsonString);
    
    const xmlOptions = {
      format: options.outputFormat === 'pretty' ? 'pretty' : 'minified',
      declaration: options.xmlDeclaration,
      indent: ' '.repeat(options.indentSize),
      sortNodes: options.sortKeys,
      attributeNamePrefix: options.attributeNamePrefix,
      textNodeName: options.textNodeName,
      rootElement: options.rootElement
    };
    
    return parse(options.rootElement, parsed, xmlOptions);
  }

  // Convert XML to JSON
  private xmlToJson(xmlString: string, options: ConversionOptions): string {
    return new Promise((resolve, reject) => {
      parseString(xmlString, {
        explicitCharkey: true,
        preserveChildrenOrder: true,
        explicitRoot: false,
        charsAsChildren: true,
        includeWhiteChars: true,
        attrNameProcessors: [
          (name: string) => name.replace(options.attributeNamePrefix, '')
        ],
        tagNameProcessors: [
          (name: string) => name.replace(options.attributeNamePrefix, '')
        ]
      }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          if (options.outputFormat === 'minified') {
            resolve(JSON.stringify(result));
          } else {
            const space = options.outputFormat === 'pretty' ? options.indentSize : 0;
            resolve(JSON.stringify(result, options.sortKeys ? Object.keys(result as object).sort((a, b) => a.localeCompare(b)) : null, space));
          }
        }
      });
    });
  }

  // Main conversion function
  async convert(input: string, options: ConversionOptions): Promise<ConversionResult> {
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
      
      let inputFormat: 'json' | 'xml';
      let outputFormat: 'json' | 'xml';
      let output: string;
      
      // Determine conversion direction
      if (options.mode === 'auto-detect') {
        const detected = this.detectFormat(trimmed);
        if (detected === 'unknown') {
          return {
            success: false,
            output: '',
            error: 'Unable to detect valid JSON or XML format',
            stats: {
              inputSize: input.length,
              outputSize: 0,
              processingTime: performance.now() - startTime
            }
          };
        }
        inputFormat = detected;
        outputFormat = detected === 'json' ? 'xml' : 'json';
      } else {
        inputFormat = options.mode === 'json-to-xml' ? 'json' : 'xml';
        outputFormat = options.mode === 'json-to-xml' ? 'xml' : 'json';
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
        output = this.jsonToXml(trimmed, options);
      } else {
        output = await this.xmlToJson(trimmed, options);
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

  // Format XML
  formatXml(xmlString: string, indentSize: number = 2): ConversionResult {
    const startTime = performance.now();
    
    try {
      const builder = new Builder({
        renderOpts: { pretty: true, indent: ' '.repeat(indentSize) },
        headless: true
      });
      
      const formatted = builder.buildObject(xmlString);
      
      return {
        success: true,
        output: formatted,
        inputFormat: 'xml',
        outputFormat: 'xml',
        stats: {
          inputSize: xmlString.length,
          outputSize: formatted.length,
          processingTime: performance.now() - startTime
        }
      };
    } catch (error: any) {
      return {
        success: false,
        output: '',
        error: error.message,
        stats: {
          inputSize: xmlString.length,
          outputSize: 0,
          processingTime: performance.now() - startTime
        }
      };
    }
  }

  // Minify XML
  minifyXml(xmlString: string): ConversionResult {
    const startTime = performance.now();
    
    try {
      const builder = new Builder({
        renderOpts: { pretty: false },
        headless: true
      });
      
      const minified = builder.buildObject(xmlString);
      
      return {
        success: true,
        output: minified,
        inputFormat: 'xml',
        outputFormat: 'xml',
        stats: {
          inputSize: xmlString.length,
          outputSize: minified.length,
          processingTime: performance.now() - startTime
        }
      };
    } catch (error: any) {
      return {
        success: false,
        output: '',
        error: error.message,
        stats: {
          inputSize: xmlString.length,
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
  generateFileName(format: 'json' | 'xml'): string {
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
const converterInstance = new JsonXmlConverter();
const jsonXmlConverter = {
  name: "JSON ↔ XML Converter",
  slug: "json-xml-converter",
  description: "Advanced JSON ⇄ XML converter with validation, formatting, and history",
  category: "Converter",
  version: "1.0.0",
  tags: ["JSON", "XML", "Converter", "Formatter", "Validator"],
  converter: converterInstance,
};

export default jsonXmlConverter;
export { converterInstance };