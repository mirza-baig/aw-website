/** Indicates whether the specified string is null, undefined or an empty string (""). */
export const isNullOrEmpty = (value: string | null | undefined): value is null | undefined | '' => {
  if (value === undefined || value === null || value === '') {
    return true;
  }

  return false;
};
