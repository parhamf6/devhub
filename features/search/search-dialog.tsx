// components/SearchDialog.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  ArrowRight,
  Filter,
  X,
  Star,
  ToolCase,
  FileText
} from 'lucide-react';
import { useSearch } from '@/hooks/use-search';
import { SearchableItem } from '@/types/search';


interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: SearchableItem[];
  favorites: string[];
}

export function SearchDialog({ open, onOpenChange, items, favorites }: SearchDialogProps) {
  const router = useRouter();
  const { query, setQuery, filters, setFilters, searchResults, categories, allTags } = useSearch(items, favorites);
  const [showFilters, setShowFilters] = useState(false);

  const handleItemClick = (item: SearchableItem) => {
    onOpenChange(false);
    router.push(`/${item.type === 'tool' ? 'dashboard/tools/' : 'cheatsheets'}/${item.slug}`);
    // router.push(`/dashboard/tools/${item.slug}`);
  };

  const handleSearchPageClick = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.type !== 'all') params.set('type', filters.type);
    if (filters.category) params.set('category', filters.category);
    if (filters.tags.length > 0) params.set('tags', filters.tags.join(','));
    if (filters.favorites) params.set('favorites', 'true');
    
    onOpenChange(false);
    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      category: '',
      tags: [],
      favorites: false
    });
  };

  const activeFiltersCount = [
    filters.type !== 'all',
    filters.category !== '',
    filters.tags.length > 0,
    filters.favorites
  ].filter(Boolean).length;

  useEffect(() => {
    if (!open) {
      setQuery('');
      clearFilters();
      setShowFilters(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 overflow-y-scroll">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Tools & Resources
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Search Input */}
          <div className="px-6 py-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tools, cheatsheets, categories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-4"
                autoFocus
              />
            </div>
          </div>

          {/* Filters Toggle */}
          <div className="px-6 py-2 border-b flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            )}
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  {/* Type Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Type</label>
                    <div className="flex gap-2">
                      {['all', 'tools', 'cheatsheets'].map((type) => (
                        <Button
                          key={type}
                          variant={filters.type === type ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFilters(prev => ({ ...prev, type: type as any }))}
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
                        onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                      >
                        All Categories
                      </Button>
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={filters.category === category ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFilters(prev => ({ ...prev, category }))}
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
                      onClick={() => setFilters(prev => ({ ...prev, favorites: !prev.favorites }))}
                      className="flex items-center gap-2"
                    >
                      <Star className={`w-3 h-3 ${filters.favorites ? 'fill-current' : ''}`} />
                      Show only favorites
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <div className="flex-1 overflow-auto">
            {searchResults.length > 0 ? (
              <div className="p-4 space-y-2">
                {searchResults.slice(0, 8).map((item) => (
                  <motion.div
                    key={item.slug}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleItemClick(item)}
                    className="p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {item.type === 'tool' ? (
                            <ToolCase className="w-4 h-4 text-blue-500" />
                          ) : (
                            <FileText className="w-4 h-4 text-green-500" />
                          )}
                          <h3 className="font-medium">{item.name}</h3>
                          {favorites.includes(item.slug) && (
                            <Star className="w-3 h-3 fill-current text-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                          {item.tags?.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </motion.div>
                ))}
                {searchResults.length > 8 && (
                  <div className="text-center py-4">
                    <Button onClick={handleSearchPageClick} variant="outline">
                      View all {searchResults.length} results
                    </Button>
                  </div>
                )}
              </div>
            ) : query ? (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No results found for "{query}"</p>
                <p className="text-sm mt-1">Try adjusting your search terms or filters</p>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Start typing to search...</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {(query || activeFiltersCount > 0) && (
            <div className="p-4 border-t bg-muted/30">
              <Button onClick={handleSearchPageClick} className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Advanced search with all results
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}