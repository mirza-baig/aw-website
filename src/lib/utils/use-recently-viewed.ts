import { LinkFieldValue } from '@sitecore-content-sdk/nextjs';
import { useEffect, useState } from 'react';

export const useRecentlyViewed = () => {
  const [recentLinks, setRecentLinks] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleLinkClick = (event: any) => {
      const link = event.currentTarget;
      // recently-viewed array from local storage, or create a new one
      const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') ?? '[]');

      // check if the link's href already exists in the recently-viewed array
      const existingLinkIndex = recentlyViewed.findIndex(
        (obj: LinkFieldValue) => obj.href === link.href
      );

      if (existingLinkIndex !== -1) {
        // If the href already exists, update the expiry and move the object to the beginning of the array
        recentlyViewed[existingLinkIndex].expiry = new Date().toISOString();
        const existingLinkObj = recentlyViewed.splice(existingLinkIndex, 1)[0];
        existingLinkObj.expiry = new Date().toISOString();
        recentlyViewed.unshift(existingLinkObj);
      } else {
        // If the href is new, create a new object with the href value and current expiry, and add it to the beginning of the array
        const linkObj = {
          href: link.href,
          text: link.title,
          expiry: new Date().toISOString(),
        };

        // A max of 50 documents can be added, once that is reached, older documents are removed from the list
        if (recentlyViewed.length >= 50) {
          recentlyViewed.pop();
        }
        recentlyViewed.unshift(linkObj);
      }

      // Items added to the list are removed after 30 days
      const cutoffTimestamp = Date.now() - 30 * 24 * 60 * 60 * 1000;
      const recentLinks = recentlyViewed.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (link: any) => new Date(link.expiry).getTime() > cutoffTimestamp
      );

      // if the recently-viewed array is empty, and remove the key from local storage
      if (recentLinks.length === 0) {
        localStorage.removeItem('recentlyViewed');
      } else {
        // Save the updated recently-viewed array back to local storage
        localStorage.setItem('recentlyViewed', JSON.stringify(recentLinks));
        const recentlyViewedSaved = JSON.parse(localStorage.getItem('recentlyViewed') ?? '') ?? [];
        setRecentLinks(recentlyViewedSaved);
      }
    };

    const updateLinks = () => {
      const toSaveLinks = document.querySelectorAll('a.documentLink');
      toSaveLinks.forEach((link) => {
        link.addEventListener('click', handleLinkClick);
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleStorageChange = (event: any) => {
      if (event.key === 'recentlyViewed') {
        const recentlyViewedSaved = JSON.parse(event.newValue ?? '') ?? [];
        setRecentLinks(recentlyViewedSaved);
      }
    };

    updateLinks();

    // Update the links whenever the DOM is updated
    const observer = new MutationObserver(updateLinks);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('storage', handleStorageChange);

    // Retrieve the recently viewed links from local storage
    const recentlyViewedStr = localStorage.getItem('recentlyViewed');
    let recentlyViewed = [];
    if (recentlyViewedStr) {
      try {
        recentlyViewed = JSON.parse(recentlyViewedStr);
      } catch (error) {
        console.error('Error parsing recentlyViewed from localStorage', error);
      }
    }

    // Filter out the links that are older than 30 days
    const cutoffTimestamp = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentLinks = recentlyViewed.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (link: any) => new Date(link.expiry).getTime() > cutoffTimestamp
    );

    // Save the filtered links back to local storage
    localStorage.setItem('recentlyViewed', JSON.stringify(recentLinks));
    setRecentLinks(recentLinks);

    // Cleanup function to remove the event listeners and observer when the component unmounts
    return () => {
      const toSaveLinks = document.querySelectorAll('a.documentLink');
      toSaveLinks.forEach((link) => {
        link.removeEventListener('click', handleLinkClick);
      });
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { recentLinks };
};
