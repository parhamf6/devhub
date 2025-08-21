// hooks/use-media-query.ts
import { useState, useEffect } from 'react';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set the initial value
    setMatches(media.matches);
    
    // Define the listener function
    const listener = () => {
      setMatches(media.matches);
    };
    
    // Add the listener
    media.addEventListener('change', listener);
    
    // Clean up the listener on unmount
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;