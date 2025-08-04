
// Helper function to format values for display
const formatValueTool = (value: any): string => {
    if (value === null || value === undefined) {
        return '-';
    }
    
    if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
    }
    
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    
    return String(value);
};

const jsonCsvConverter = {
    name: 'JSON ↔ CSV Converter',
    description: 'Convert between JSON and CSV formats with preview and advanced options',
    slug: 'json-csv-converter',
    category: 'Converter',
    tags: ['json', 'csv', 'converter', 'data'],
};

export default jsonCsvConverter;
export {formatValueTool}