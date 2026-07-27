import { beforeEach, describe, expect, it } from 'vitest';

import { GetUrlParts } from './js/utils';
import { applyResumeRoute, buildResumeUrl, getResumeRoutePath } from './resume-url';

const Origin = 'https://www.uat.xmc.andersenwindows.com';
const Path = '/ideas-and-inspiration/design-tool';
const ProductId = '110d559f-dea5-42ea-9c1c-8a5df7e70ef9';
const Attributes = 'widIn=17.5&hgtIn=59.5&frameColor=Interior%3B+color%3DSandtone';

// A user part-way through a design: attributes in the query, route in the fragment.
const DesignUrl = `${Origin}${Path}?${Attributes}#/${ProductId}/3`;

// What the marketing pipeline appends on the way out.
const TrackingParams = 'utm_source=sfmc&utm_medium=email&utm_content=ctabuttondesign';

describe('buildResumeUrl', () => {
  it('moves the route out of the fragment and into the query string', () => {
    const resumeUrl = buildResumeUrl(DesignUrl);

    expect(resumeUrl).not.toContain('#');
    expect(new URL(resumeUrl).searchParams.get('dtProductId')).toBe(ProductId);
    expect(new URL(resumeUrl).searchParams.get('dtStep')).toBe('3');
  });

  it('keeps the attribute selections intact', () => {
    const params = new URL(buildResumeUrl(DesignUrl)).searchParams;

    expect(params.get('widIn')).toBe('17.5');
    expect(params.get('hgtIn')).toBe('59.5');
    expect(params.get('frameColor')).toBe('Interior; color=Sandtone');
  });

  it('defaults to the first step when the fragment omits one', () => {
    const resumeUrl = buildResumeUrl(`${Origin}${Path}#/${ProductId}`);

    expect(new URL(resumeUrl).searchParams.get('dtStep')).toBe('0');
  });

  it('leaves a URL with no route in the fragment unchanged', () => {
    const noRoute = `${Origin}${Path}?${Attributes}`;

    expect(buildResumeUrl(noRoute)).toBe(noRoute);
  });
});

describe('getResumeRoutePath', () => {
  it('restores the fragment the router reads', () => {
    const path = getResumeRoutePath(
      `${Origin}${Path}?${Attributes}&dtProductId=${ProductId}&dtStep=3`
    );

    expect(path).toBe(`${Path}?${Attributes}#/${ProductId}/3`);
  });

  it('strips the carrier params so they cannot be read as product settings', () => {
    const path = getResumeRoutePath(`${Origin}${Path}?dtProductId=${ProductId}&dtStep=3`);

    expect(path).toBe(`${Path}#/${ProductId}/3`);
  });

  it('leaves a URL that already routes on its own alone', () => {
    expect(getResumeRoutePath(DesignUrl)).toBeUndefined();
  });

  it('ignores a URL carrying no resume params', () => {
    // The link as reported in the ticket: attributes survived, the route did not. There is
    // nothing to restore from, so the tool correctly falls through to the Start view.
    expect(getResumeRoutePath(`${Origin}${Path}?${Attributes}&${TrackingParams}`)).toBeUndefined();
  });

  it('ignores a product id the router would not accept', () => {
    expect(
      getResumeRoutePath(`${Origin}${Path}?dtProductId=not-a-product&dtStep=3`)
    ).toBeUndefined();
  });

  it.each([
    ['missing', `dtProductId=${ProductId}`],
    ['not a number', `dtProductId=${ProductId}&dtStep=summary`],
    ['negative', `dtProductId=${ProductId}&dtStep=-2`],
  ])('falls back to the first step when the step is %s', (_label, query) => {
    expect(getResumeRoutePath(`${Origin}${Path}?${query}`)).toBe(`${Path}#/${ProductId}/0`);
  });
});

describe('applyResumeRoute', () => {
  beforeEach(() => {
    globalThis.history.replaceState(null, '', '/');
  });

  it('rewrites the address bar so the router can pick the route up', () => {
    globalThis.history.replaceState(
      null,
      '',
      `${Path}?${Attributes}&dtProductId=${ProductId}&dtStep=3&${TrackingParams}`
    );

    expect(applyResumeRoute()).toBe(true);
    expect(globalThis.location.pathname).toBe(Path);
    expect(globalThis.location.hash).toBe(`#/${ProductId}/3`);

    const params = new URLSearchParams(globalThis.location.search);
    expect(params.get('dtProductId')).toBeNull();
    expect(params.get('dtStep')).toBeNull();
    expect(params.get('widIn')).toBe('17.5');
  });

  it('is a no-op once the fragment is in place, so a re-run cannot undo it', () => {
    globalThis.history.replaceState(null, '', `${Path}?dtProductId=${ProductId}&dtStep=3`);

    expect(applyResumeRoute()).toBe(true);
    expect(applyResumeRoute()).toBe(false);
    expect(globalThis.location.hash).toBe(`#/${ProductId}/3`);
  });

  it('leaves ordinary navigation untouched', () => {
    globalThis.history.replaceState(null, '', `${Path}?${Attributes}`);

    expect(applyResumeRoute()).toBe(false);
    expect(globalThis.location.hash).toBe('');
  });
});

describe('resume link round trip', () => {
  it('survives a pipeline that appends tracking params and discards the fragment', () => {
    // 1. The site records the resume link when the design is abandoned.
    const resumeUrl = buildResumeUrl(DesignUrl);

    // 2. The email platform parses it, appends its own params, and drops any fragment.
    const emailedUrl = `${resumeUrl}&${TrackingParams}`;
    expect(emailedUrl).not.toContain('#');

    // 3. The user clicks through and the tool restores the route.
    const routePath = getResumeRoutePath(emailedUrl);
    expect(routePath).toBeDefined();

    const parts = GetUrlParts(routePath as string);
    expect(parts.option).toBe(ProductId);
    expect(parts.attributeIndex).toBe('3');

    // The selections come back with it; the tracking params ride along harmlessly.
    const restored = new URLSearchParams(parts.query);
    expect(restored.get('widIn')).toBe('17.5');
    expect(restored.get('frameColor')).toBe('Interior; color=Sandtone');
    expect(restored.get('utm_source')).toBe('sfmc');
  });

  it('still routes when the pipeline appends its params after an intact fragment', () => {
    const parts = GetUrlParts(`${DesignUrl}&${TrackingParams}`);

    expect(parts.option).toBe(ProductId);
    expect(parts.attributeIndex).toBe('3');
  });
});
