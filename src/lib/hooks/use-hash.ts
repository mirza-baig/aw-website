'use client';

import React from 'react';

export const useHash = () => {
  const [hash, setHash] = React.useState('');

  React.useEffect(() => {
    const updateHash = () => {
      const nextHash = globalThis.location.hash;
      setHash((prev) => (prev === nextHash ? prev : nextHash));
    };

    queueMicrotask(updateHash);

    const { pushState, replaceState } = globalThis.history;

    globalThis.history.pushState = function (...args) {
      pushState.apply(globalThis.history, args);
      queueMicrotask(updateHash);
    };
    globalThis.history.replaceState = function (...args) {
      replaceState.apply(globalThis.history, args);
      queueMicrotask(updateHash);
    };

    globalThis.addEventListener('hashchange', updateHash);

    return () => {
      globalThis.removeEventListener('hashchange', updateHash);

      globalThis.history.pushState = pushState;
      globalThis.history.replaceState = replaceState;
    };
  }, []);

  return hash;
};
