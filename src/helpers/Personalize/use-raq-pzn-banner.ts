'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export const RAQ_PZN_BANNER_ACTIVE_CLASS = 'aw-uc01-banner-active';

const HOME_PATH = '/';

const hasRaqPznBannerClass = (): boolean =>
  document.documentElement.classList.contains(RAQ_PZN_BANNER_ACTIVE_CLASS);

export function useRaqPznBannerActive(): boolean {
  const pathname = usePathname();
  const isHome = pathname === HOME_PATH;
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setIsActive(false);
      return;
    }

    const update = () => setIsActive(hasRaqPznBannerClass());
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [isHome]);

  return isHome && isActive;
}
