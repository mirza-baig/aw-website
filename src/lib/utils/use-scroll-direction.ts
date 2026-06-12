import * as React from 'react';

import { debounceFunction } from './debounce-utils';

export type ScrollDirection = 'UP' | 'DOWN';

export const useScrollDirection = (threshold: number) => {
  const [scrollDirection, setScrollDirection] = React.useState<ScrollDirection>('UP');

  const blocking = React.useRef(false);
  const prevScrollY = React.useRef(0);

  React.useEffect(() => {
    prevScrollY.current = window.scrollY;

    const updateScrollDirection = debounceFunction(() => {
      const scrollY = window.scrollY;

      if (Math.abs(scrollY - prevScrollY.current) >= threshold) {
        const newScrollDirection: ScrollDirection = scrollY > prevScrollY.current ? 'DOWN' : 'UP';

        setScrollDirection(newScrollDirection);

        prevScrollY.current = scrollY > 0 ? scrollY : 0;
      }

      blocking.current = false;
    }, threshold);

    const onScroll = () => {
      if (!blocking.current) {
        blocking.current = true;
        window.requestAnimationFrame(updateScrollDirection);
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
    //It is safe to ignore the dependency warnig, as we are always using the constant value for threshold
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollDirection]);

  return scrollDirection;
};
