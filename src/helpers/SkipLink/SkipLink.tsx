'use client';
import { JSX } from 'react';

export const SkipLink = (): JSX.Element => {
  const handleSkipToContent = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Find the main content area
    const mainContent = document.getElementById('main');

    if (mainContent) {
      // Set focus to the main container.
      // This moves the keyboard context past the header navigation.
      mainContent.focus();

      // Ensure the view scrolls to the start of the content
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href="#main"
      onClick={handleSkipToContent}
      className="skip-link fixed -left-[9999px] top-0 z-9999
                 bg-white border-2 border-black text-black font-bold px-4 py-3
                 no-underline
                 focus:left-4 focus:top-4
                 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-black
                 transition-all duration-200 ease-in-out"
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;
