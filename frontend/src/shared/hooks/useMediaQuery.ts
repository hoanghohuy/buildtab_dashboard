import { useEffect, useState } from 'react';

/**
 * Theo dõi `window.matchMedia`. Trả về `false` trước khi hydrate để khớp SSR.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = (): void => {
      setMatches(media.matches);
    };

    update();
    media.addEventListener('change', update);
    return () => {
      media.removeEventListener('change', update);
    };
  }, [query]);

  return matches;
}
