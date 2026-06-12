interface URLParts {
  href: string;
  anchor?: string;
  querystring?: string;
  linktype?: 'internal' | 'external';
}

export function extractURLParts(url?: string): URLParts {
  // Initialize variable to hold URL parts
  const urlParts = {} as URLParts;

  if (!url) {
    urlParts.href = '';
    return urlParts;
  }

  // Find the index of '#' and '?'
  const hashIndex = url.indexOf('#');
  const queryIndex = url.indexOf('?');

  // Find the minimum index of anchor and query
  const minIndex = Math.min(
    hashIndex !== -1 ? hashIndex : Infinity,
    queryIndex !== -1 ? queryIndex : Infinity
  );

  // Extract the hostname
  urlParts.href = url.slice(0, minIndex);

  // Extract anchor if it exists
  if (hashIndex !== -1) {
    const endIndex = hashIndex < queryIndex ? queryIndex : undefined;
    urlParts.anchor = url.slice(hashIndex + 1, endIndex);
  } else {
    urlParts.anchor = '';
  }

  // Extract query if it exists
  if (queryIndex !== -1) {
    const endIndex = queryIndex < hashIndex ? hashIndex : undefined;
    urlParts.querystring = url.slice(queryIndex + 1, endIndex);
  } else {
    urlParts.querystring = '';
  }

  // Determine link type (internal or external)
  urlParts.linktype = url.startsWith('/') ? 'internal' : 'external';

  // Return the extracted URL parts
  return urlParts;
}
