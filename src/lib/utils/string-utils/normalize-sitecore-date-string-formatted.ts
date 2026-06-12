export const normalizeSitecoreDateStringFormatted = (date: string): string => {
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
  const match = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(date);
  if (match) {
    // Extract the captured groups
    const [, year, month, day] = match;
    // Create a formatted date string
    const formattedDate = `${month}/${day}/${year}`;
    return formattedDate;
  }
  return date;
};
