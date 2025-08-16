// types/search.ts
export interface SearchableItem {
    name: string;
    slug: string;
    description: string;
    category: string;
    tags?: string[];
    type: 'tool' | 'cheatsheet';
    // type: 'tool';
    version?: string;
    info?: string;
}

export interface SearchFilters {
    type: 'all' | 'tools' | 'cheatsheets';
    // type: 'all' | 'tools';
    category: string;
    tags: string[];
    favorites: boolean;
}

export interface SearchResult extends SearchableItem {
    relevanceScore: number;
}