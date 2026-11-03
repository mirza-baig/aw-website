/**
 * Matches a "$XYZ-$XYZ" price range. Authored data uses a hyphen, en dash or em
 * dash between the two values (e.g. "$480–$870"), so all three are accepted.
 */
export const PRICE_RANGE_RE = /^\$([\d,]+(?:\.\d+)?)\s*[-–—]\s*\$([\d,]+(?:\.\d+)?)$/;

/** Strips HTML tags so rich-text values like "<p>$480–$870</p>" can be matched too. */
export const isPriceRange = (value: string): boolean =>
  PRICE_RANGE_RE.test(value.replace(/<[^<>]*>/g, '').trim());
