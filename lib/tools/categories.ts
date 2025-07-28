import { tools } from "./toolDate";

export const categories = Array.from(
    new Set(tools.map(tool => tool.category))
).sort();


export const getCategoryColor = (category: string) => {
    const colors = {
        'Favorites': 'border-secondary border-2',
        'Security': 'border-coral border-2',
        'Tags': 'border-teal border-2',
        'Generator' : 'border-indigo border-2',
        'Build Tools': 'border-violet border-2',
    };
    return colors[category as keyof typeof colors] || 'border-border border-2';
    };