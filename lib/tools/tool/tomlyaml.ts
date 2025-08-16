import toml from '@iarna/toml';
import yaml from 'js-yaml';

export interface ConversionOptions {
  mode: 'toml-to-yaml' | 'yaml-to-toml' | 'auto-detect';
  outputFormat: 'pretty' | 'minified' | 'compact';
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
}

const defaultOptions: ConversionOptions = {
  mode: 'toml-to-yaml',
  outputFormat: 'pretty',
  indentSize: 2,
  sortKeys: false,
  preserveComments: false,
  yamlFlowLevel: -1,
};

const converterInstance = {
  convert: (input: string, options: ConversionOptions = defaultOptions): ConversionResult => {
    try {
      let parsedData: any;
      let output: string = '';
      
      // Auto-detect mode if needed
      const mode = options.mode === 'auto-detect' 
        ? (input.trim().startsWith('{') ? 'toml-to-yaml' : 'yaml-to-toml')
        : options.mode;

      // Parse input based on mode
      if (mode === 'toml-to-yaml') {
        try {
          parsedData = toml.parse(input);
        } catch (error) {
          const err = error as Error;
          const match = err.message.match(/line (\d+)/);
          const line = match ? parseInt(match[1]) : undefined;
          return {
            success: false,
            output: '',
            error: `TOML parsing error: ${err.message}`,
            errorLine: line
          };
        }
        
        // Convert to YAML
        const yamlOptions: yaml.DumpOptions = {
          indent: options.indentSize,
          flowLevel: options.yamlFlowLevel,
          sortKeys: options.sortKeys,
          lineWidth: -1,
          noRefs: true,
        };
        
        output = yaml.dump(parsedData, yamlOptions);
        
        // Apply output formatting
        if (options.outputFormat === 'minified') {
          output = output.replace(/\n\s*\n/g, '\n');
        } else if (options.outputFormat === 'compact') {
          output = output.replace(/\n\s*\n/g, '\n').replace(/\n\s+/g, ' ');
        }
      } else {
        // YAML to TOML
        try {
          parsedData = yaml.load(input);
        } catch (error) {
          const err = error as Error;
          const match = err.message.match(/line (\d+)/);
          const line = match ? parseInt(match[1]) : undefined;
          return {
            success: false,
            output: '',
            error: `YAML parsing error: ${err.message}`,
            errorLine: line
          };
        }
        
        // Convert to TOML
        output = toml.stringify(parsedData);
        
        // Apply output formatting
        if (options.outputFormat === 'minified') {
          output = output.replace(/\n\s*\n/g, '\n');
        } else if (options.outputFormat === 'compact') {
          output = output.replace(/\n\s*\n/g, '\n').replace(/\n\s+/g, ' ');
        }
      }
      
      return {
        success: true,
        output,
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        output: '',
        error: `Conversion error: ${err.message}`,
      };
    }
  },

  beautifyToml: (input: string, indentSize: number): ConversionResult => {
    try {
      const parsed = toml.parse(input);
      const output = toml.stringify(parsed);
      return {
        success: true,
        output,
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        output: '',
        error: `Beautify error: ${err.message}`,
      };
    }
  },

  minifyToml: (input: string): ConversionResult => {
    try {
      const parsed = toml.parse(input);
      const output = toml.stringify(parsed).replace(/\n\s*\n/g, '\n');
      return {
        success: true,
        output,
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        output: '',
        error: `Minify error: ${err.message}`,
      };
    }
  },

  generateFileName: (format: 'toml' | 'yaml'): string => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `converted-${timestamp}.${format}`;
  },
};

const tool = {
  name: 'TOML-YAML Converter',
  description: 'Convert between TOML and YAML formats with advanced options',
  slug: 'toml-yaml-converter',
  category: 'Converter',
  tags: ['toml', 'yaml', 'converter', 'data'],
};

export default tool;
export { converterInstance, defaultOptions };