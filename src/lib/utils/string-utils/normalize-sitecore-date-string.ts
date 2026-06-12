export const normalizeSitecoreDateString = (date: string): string => {
  // For fields that don't contain
  if (date.charAt(15) !== 'Z') {
    date = `${date}Z`;
  }

  const isValid = date.length === 16 && date.charAt(8) === 'T' && date.charAt(15) === 'Z';
  if (!isValid) {
    // If used with new Date, wil get 'Invalid Date'.
    console.warn(`Invalid date provided, ${date}. Valid Sitecore date string: 20211112T203919Z.`);
    return 'Invalid Date';
  }

  return date.replace(/(\w{4})(\w{2})(\w{5})(\w{2})(\w{2})/, '$1-$2-$3:$4:$5');
};
