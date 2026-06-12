'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { useHash } from './use-hash';

/**
 * App Router-friendly `asPath`:
 *   /path?query=value#hash
 *
 * Reacts to:
 *  - pathname (Next)
 *  - search params (Next)
 *  - hash (browser)
 *  - pushState/replaceState (3rd parties often use these)
 */
export function useAsPath(): string {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hash = useHash();

  // Build the asPath string without nested template literals (Sonar-friendly)
  const asPath = useMemo(() => {
    const path = pathname ?? '';
    const qs = searchParams?.toString() ?? '';
    const query = qs ? '?' + qs : '';
    const h = hash ?? '';
    return path + query + h;
  }, [pathname, searchParams, hash]);

  return asPath;
}
