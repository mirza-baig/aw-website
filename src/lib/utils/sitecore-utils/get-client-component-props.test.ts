import { describe, expect, it } from 'vitest';

import { getClientComponentProps } from './get-client-component-props';

describe('lib > utils > sitecore-utils > get-client-component-props', () => {
  it('returns the client component props without extra properties', () => {
    const fields = { title: 'Title' };
    const page = { customProps: { siteName: 'Website' } };
    const rendering = { componentName: 'Component' };
    const params = { RenderingIdentifier: 'rendering-id' };
    const props = {
      fields,
      page,
      rendering,
      params,
      extra: 'excluded',
    } as unknown as Parameters<typeof getClientComponentProps>[0];

    const result = getClientComponentProps(props);

    expect(result).toEqual({ fields, page, rendering, params });
    expect(result.fields).toBe(fields);
    expect(result.page).toBe(page);
    expect(result.rendering).toBe(rendering);
    expect(result.params).toBe(params);
  });

  it('preserves an undefined fields value', () => {
    const props = {
      fields: undefined,
      page: {},
      rendering: {},
      params: {},
    } as unknown as Parameters<typeof getClientComponentProps>[0];

    expect(getClientComponentProps(props)).toEqual({
      fields: undefined,
      page: props.page,
      rendering: props.rendering,
      params: props.params,
    });
  });
});
