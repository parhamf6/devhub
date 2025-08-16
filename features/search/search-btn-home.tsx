// components/SearchButton.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { SearchDialog } from './search-dialog';
import { SearchableItem } from '@/types/search';
import { SearchIcon } from '@/components/animated-icons/search-icon';

interface SearchButtonProps {
  items: SearchableItem[];
  favorites: string[];
  className?: string;
}

export function SearchButtonHome({ items, favorites, className }: SearchButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className={className}
        aria-label="Search"
      >
        <SearchIcon className="w-4 h-4" />
      </Button>
      <SearchDialog
        open={open}
        onOpenChange={setOpen}
        items={items}
        favorites={favorites}
      />
    </>
  );
}
