// hooks/useSearch.ts
import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { SearchableItem, SearchFilters, SearchResult } from '@/types/search';

const fuseOptions = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'description', weight: 0.3 },
    { name: 'category', weight: 0.2 },
    { name: 'tags', weight: 0.1 }
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2
};

export const useSearch = (items: SearchableItem[], favorites: string[] = []) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    category: '',
    tags: [],
    favorites: false
  });

  const fuse = useMemo(() => new Fuse(items, fuseOptions), [items]);

  const searchResults = useMemo(() => {
    let results: SearchableItem[] = items;

    // Apply filters first
    results = results.filter(item => {
      const typeMatch = filters.type === 'all' || 
        (filters.type === 'tools' && item.type === 'tool') ||
        (filters.type === 'cheatsheets' && item.type === 'cheatsheet');
      
      const categoryMatch = !filters.category || item.category === filters.category;
      
      const tagsMatch = filters.tags.length === 0 || 
        filters.tags.every(tag => item.tags?.includes(tag));
      
      const favoriteMatch = !filters.favorites || favorites.includes(item.slug);

      return typeMatch && categoryMatch && tagsMatch && favoriteMatch;
    });

    // Apply search query
    if (query.trim()) {
      const fuseResults = fuse.search(query);
      const filteredFuseResults = fuseResults.filter(result => 
        results.some(item => item.slug === result.item.slug)
      );
      
      return filteredFuseResults.map(result => ({
        ...result.item,
        relevanceScore: 1 - (result.score || 0)
      }));
    }

    return results.map(item => ({ ...item, relevanceScore: 1 }));
  }, [items, query, filters, favorites, fuse]);

  const categories = useMemo(() => 
    [...new Set(items.map(item => item.category))].sort()
  , [items]);

  const allTags = useMemo(() => 
    [...new Set(items.flatMap(item => item.tags || []))].sort()
  , [items]);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    searchResults,
    categories,
    allTags
  };
};