'use client';

import { useEffect, useState } from 'react';

/**
 * Loads an external script and reports its loading state.
 *
 * @param url The script URL. An empty URL disables loading.
 * @param scriptType The optional script type, defaulting to `application/javascript`.
 * @returns `idle`, `loading`, `ready`, or `error` based on the script state.
 */
export function useExternalScript(url: string, scriptType?: string) {
  const [state, setState] = useState(url ? 'loading' : 'idle');

  useEffect(() => {
    if (!url) {
      setState('idle');
      return;
    }
    let script = document.querySelector(`script[src="${url}"]`) as HTMLScriptElement;

    const handleScript = (e: Event) => {
      setState(e.type === 'load' ? 'ready' : 'error');
    };

    if (!script) {
      script = document.createElement('script');
      script.type = scriptType ?? 'application/javascript';
      script.src = url;
      script.async = true;
      document.body.appendChild(script);
      script.addEventListener('load', handleScript);
      script.addEventListener('error', handleScript);
    }

    script.addEventListener('load', handleScript);
    script.addEventListener('error', handleScript);

    return () => {
      script.removeEventListener('load', handleScript);
      script.removeEventListener('error', handleScript);
    };
    //It is safe to ignore the dependency warnig, script type is not going to update as its value is constant
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return state;
}
