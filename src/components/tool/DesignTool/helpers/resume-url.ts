import { GetUrlParts } from './js/utils';

/**
 * The Design Tool routes on the URL fragment (`#/{productId}/{attributeIndex}`).
 *
 * Fragments are client-only: they are never sent to a server, and they are routinely dropped by
 * email and link-tracking pipelines that parse a URL and rebuild it in order to append tracking
 * parameters. A resume link that travels through one of those pipelines arrives with its query
 * string intact but no fragment, which leaves the router with no product to route to and drops
 * the user back on the Start view.
 *
 * These helpers mirror the same routing state into ordinary query parameters, which survive that
 * round trip, and translate it back into the fragment when such a link is opened.
 */

export const ResumeProductParam = 'dtProductId';
export const ResumeStepParam = 'dtStep';

// Only used to resolve relative URLs; the resulting host is never read back out.
const ParseBase = 'https://server';

/**
 * True when the router would accept this product id in the fragment. Checked by round-tripping
 * through GetUrlParts rather than re-declaring its pattern, so this can never drift from it.
 */
const IsRoutableProductId = (productId: string) => {
  return GetUrlParts(`#/${productId}/0`).option === productId;
};

/**
 * Rewrites a Design Tool URL into a fragment-free equivalent, moving the route out of the
 * fragment and into the query string. Use it for any link that leaves the browser — CDP payloads,
 * emails, anything else that may be rebuilt along the way.
 *
 * Optional stepOverride to override the attribute index that would otherwise be
 * read from the fragment. This is for bug ticket AWEB-603 where the resume link should always be
 * the summary step after the glass step is reached.
 *
 * Returns the URL unchanged when there is no route in the fragment to preserve.
 */
export function buildResumeUrl(
  href: string = globalThis.location?.href ?? '',
  stepOverride?: number
): string {
  const { option, attributeIndex } = GetUrlParts(href);

  if (!option) {
    return href;
  }

  try {
    const url = new URL(href, ParseBase);

    url.searchParams.set(ResumeProductParam, option);
    url.searchParams.set(
      ResumeStepParam,
      stepOverride === undefined ? (attributeIndex ?? '0') : String(stepOverride)
    );
    url.hash = '';

    return url.toString();
  } catch {
    return href;
  }
}

/**
 * The inverse of {@link buildResumeUrl}: builds the fragment-based path for a resume link that
 * arrived carrying its route in the query string.
 *
 * Returns undefined when the URL already routes on its own or carries no resume parameters, so
 * callers can leave ordinary navigation untouched.
 */
export function getResumeRoutePath(href: string): string | undefined {
  // A fragment that already routes wins — the query is only a fallback carrier.
  if (GetUrlParts(href).option) {
    return undefined;
  }

  let url: URL;
  try {
    url = new URL(href, ParseBase);
  } catch {
    return undefined;
  }

  const productId = url.searchParams.get(ResumeProductParam);
  if (!productId || !IsRoutableProductId(productId)) {
    return undefined;
  }

  const step = Number.parseInt(url.searchParams.get(ResumeStepParam) ?? '', 10);
  // The Design view clamps the upper bound once it knows how many attributes the product has.
  const attributeIndex = Number.isNaN(step) || step < 0 ? 0 : step;

  // Drop the carriers so they are not mistaken for product settings, and so the URL the user
  // ends up seeing and sharing is the ordinary fragment form.
  url.searchParams.delete(ResumeProductParam);
  url.searchParams.delete(ResumeStepParam);

  const query = url.searchParams.toString();

  return `${url.pathname}${query ? `?${query}` : ''}#/${productId}/${attributeIndex}`;
}

/**
 * Moves a query-carried resume route back into the fragment the router reads.
 *
 * Safe to call more than once — it is a no-op once the fragment is in place. Returns whether the
 * URL was rewritten.
 */
export function applyResumeRoute(): boolean {
  if (globalThis.location === undefined || globalThis.history === undefined) {
    return false;
  }

  const routePath = getResumeRoutePath(globalThis.location.href);
  if (!routePath) {
    return false;
  }

  globalThis.history.replaceState(null, '', routePath);

  return true;
}
