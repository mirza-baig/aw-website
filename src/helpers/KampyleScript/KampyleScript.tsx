import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    KAMPYLE_ONSITE_SDK?: {
      updatePageView?: () => void;
    };
  }
}
const KampyleScript = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.KAMPYLE_ONSITE_SDK &&
      typeof window.KAMPYLE_ONSITE_SDK.updatePageView === 'function'
    ) {
      console.log('location.href: ', location.href);
      console.log('Route changed! Calling updatePageView()');
      window.KAMPYLE_ONSITE_SDK.updatePageView();
    } else {
      console.log('KAMPYLE SDK not ready. Retrying...');
    }
  }, [pathname, searchParams]);
  return null;
};
export default KampyleScript;
