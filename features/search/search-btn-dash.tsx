// components/SearchButton.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { SearchDialog } from './search-dialog';
import { SearchableItem } from '@/types/search';
import { SearchIcon } from '@/components/animated-icons/search-icon';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcur';

interface SearchButtonProps {
  items: SearchableItem[];
  favorites: string[];
  className?: string;
}

export function SearchButtonDash({ items, favorites, className }: SearchButtonProps) {
  const [open, setOpen] = useState(false);
    // Add keyboard shortcut
  useKeyboardShortcut({
    keys: ['ctrl', 'k'],
    callback: () => setOpen(true),
  });

  // Optional: Also support Cmd+K on Mac
  useKeyboardShortcut({
    keys: ['meta', 'k'],
    callback: () => setOpen(true),
  });
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className={`flex items-center rounded-sm gap-2 ${className}`}
        aria-label="Search"
      >
        <SearchIcon className="w-4 h-4" />
        {/* <Search className="w-4 h-4" /> */}
        <span className="hidden md:inline">Search</span>
        <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">Ctrl</span>K
        </kbd>
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
