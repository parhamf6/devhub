export interface ToolSchema {
    slug: string;
    name: string;
    description: string;
    category: string;
    tags: string[];
    generate?: () => string | object; // Optional: for auto-generated tools
    validate?: (input: string) => boolean; // Optional: for validators
    format?: (input: string) => string; // Optional: for formatters
}
