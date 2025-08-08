import { tools } from "./toolDate";

export const categories = Array.from(
    new Set(tools.map(tool => tool.category))
).sort((a, b) => a.localeCompare(b));


export const getCategoryColor = (category: string) => {
    const colors = {
        'Favorites': 'border-secondary border-2',
        'Tags': 'border-coral border-2',
        'Categories': 'border-teal border-2',
        'Security': 'border-coral border-2',
        'Text & Data': 'border-teal border-2',
        'Generator' : 'border-indigo border-2',
        'Converter': 'border-violet border-2',
        'Design':"border-pink border-2",
        'Networking':"border-emerald border-2",
    };
    return colors[category as keyof typeof colors] || 'border-border border-2';
    };