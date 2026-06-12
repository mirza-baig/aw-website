'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const checkDOMLoaded = () => {
      //eslint-disable-next-line
      if (typeof window !== "undefined" && document.readyState === "complete") {
        const nextRoot = document.getElementById('main');
        if (nextRoot) {
          setPortalRoot(nextRoot);
        }
      }
    };

    // If DOM is already loaded, set portal root immediately
    checkDOMLoaded();

    // Otherwise, wait for DOM to be fully loaded
    if (document.readyState !== 'complete') {
      window.addEventListener('load', checkDOMLoaded);
    }

    return () => window.removeEventListener('load', checkDOMLoaded);
  }, []);

  return portalRoot ? createPortal(children, portalRoot) : null;
};

export default ModalPortal;
