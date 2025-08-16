// app/search/page.tsx
'use client';

import { Suspense, useMemo , useState , useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Filter,
  X,
  Star,
  ToolCase,
  FileText,
  SlidersHorizontal
} from 'lucide-react';
import { useSearch } from '@/hooks/use-search';
import { SearchableItem } from '@/types/search';
import { ToolCard } from '@/components/tool-card';
import { tools } from '@/lib/tools/toolDate';

const alldata = tools

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || 'all';
  const initialCategory = searchParams.get('category') || '';
  const initialTags = searchParams.get('tags')?.split(',') || [];
  const initialFavorites = searchParams.get('favorites') === 'true';

  const { 
    query, 
    setQuery, 
    filters, 
    setFilters, 
    searchResults, 
    categories, 
    allTags 
  } = useSearch(alldata, []);

  // Initialize from URL params
  useMemo(() => {
    setQuery(initialQuery);
    setFilters({
      type: initialType as any,
      category: initialCategory,
      tags: initialTags,
      favorites: initialFavorites
    });
  }, []);

  useEffect(() => {
      const stored = localStorage.getItem("devhub-favorites");
      if (stored) setFavorites(JSON.parse(stored));
    }, []);
    const toggleFavorite = (slug: string) => {
    const updated = favorites.includes(slug)
      ? favorites.filter((s) => s !== slug)
      : [...favorites, slug];

    setFavorites(updated);
    localStorage.setItem("devhub-favorites", JSON.stringify(updated));
  };

  const updateURL = (newQuery: string, newFilters: any) => {
    const params = new URLSearchParams();
    if (newQuery) params.set('q', newQuery);
    if (newFilters.type !== 'all') params.set('type', newFilters.type);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.tags.length > 0) params.set('tags', newFilters.tags.join(','));
    if (newFilters.favorites) params.set('favorites', 'true');
    
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    updateURL(newQuery, filters);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    updateURL(query, newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      type: 'all' as const,
      category: '',
      tags: [],
      favorites: false
    };
    handleFiltersChange(clearedFilters);
    setQuery('');
    router.push('/search');
  };

  const activeFiltersCount = [
    filters.type !== 'all',
    filters.category !== '',
    filters.tags.length > 0,
    filters.favorites
  ].filter(Boolean).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-muted-foreground">
          Find tools and cheatsheets across our library
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search tools, cheatsheets, categories..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="pl-10 pr-4 h-12 text-lg"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="font-medium">Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {/* Type Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Type</label>
            <div className="flex gap-2 flex-wrap">
              {['all', 'tools', 'cheatsheets'].map((type) => (
                <Button
                  key={type}
                  variant={filters.type === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFiltersChange({ ...filters, type: type as any })}
                  className="capitalize"
                >
                  {type === 'tools' && <ToolCase className="w-3 h-3 mr-1" />}
                  {type === 'cheatsheets' && <FileText className="w-3 h-3 mr-1" />}
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!filters.category ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFiltersChange({ ...filters, category: '' })}
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={filters.category === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFiltersChange({ ...filters, category })}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Favorites Filter */}
          <div>
            <Button
              variant={filters.favorites ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFiltersChange({ ...filters, favorites: !filters.favorites })}
              className="flex items-center gap-2"
            >
              <Star className={`w-3 h-3 ${filters.favorites ? 'fill-current' : ''}`} />
              Show only favorites
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
          {query && ` for "${query}"`}
        </p>
      </div>

      {/* Results Grid */}
      <div className="flex flex-wrap gap-4 items-center justify-center">
        {searchResults.map((item) => (
          <motion.div
            key={item.slug}
            whileHover={{ scale: 1.03 }}
            className="relative"
          >
            <ToolCard
              {...item}
              withFavoriteToggle
              isFavorite={favorites.includes(item.slug)}
              onToggleFavorite={() => toggleFavorite(item.slug)}
            />
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {searchResults.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters
          </p>
          <Button onClick={clearAllFilters} variant="outline">
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}

export default function SearchPageComp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}