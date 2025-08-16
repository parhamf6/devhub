// hooks/useKeyboardShortcut.ts
import { useEffect, useCallback } from 'react';

interface UseKeyboardShortcutProps {
  keys: string[];
  callback: () => void;
  preventDefault?: boolean;
}

export function useKeyboardShortcut({ 
  keys, 
  callback, 
  preventDefault = true 
}: UseKeyboardShortcutProps) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const isMatch = keys.every(key => {
      switch (key.toLowerCase()) {
        case 'ctrl':
        case 'control':
          return event.ctrlKey || event.metaKey; // Support both Ctrl and Cmd
        case 'shift':
          return event.shiftKey;
        case 'alt':
          return event.altKey;
        case 'meta':
        case 'cmd':
          return event.metaKey;
        default:
          return event.key.toLowerCase() === key.toLowerCase();
      }
    });

    if (isMatch) {
      if (preventDefault) {
        event.preventDefault();
        event.stopPropagation();
      }
      callback();
    }
  }, [keys, callback, preventDefault]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}