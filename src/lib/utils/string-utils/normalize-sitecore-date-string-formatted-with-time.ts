export const normalizeSitecoreDateStringFormattedWithTime = (
  date: string,
  useLocaleFormat = false
): string => {
  const isValid = /^(?:\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z|\d{8}T\d{6}Z)$/.test(date);
  if (!isValid) {
    console.warn(
      `Invalid date provided: ${date}. Valid Sitecore date string formats: 20211112T203919Z or 2024-04-16T20:04:00Z.`
    );
    return 'Invalid Date';
  }

  const dateParts =
    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(date) ??
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/.exec(date);

  if (!dateParts) {
    console.warn(`Unable to parse date: ${date}`);
    return 'Invalid Date';
  }

  const [, year, month, day, hour, minute, second] = dateParts;

  // Convert the date string into a JavaScript Date object
  const parsedDate = new Date(
    Date.UTC(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    )
  );

  // Get the localized date string
  const formattedDate = useLocaleFormat
    ? parsedDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      })
    : parsedDate.toISOString();

  return formattedDate;
};
