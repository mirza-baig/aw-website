import { describe, expect, it } from 'vitest';

import { convertToSitecoreGuid } from './convert-to-sitecore-guid';

describe('lib > utils > string-utils > convert-to-sitecore-guid', () => {
  it('formats an uppercase guid as a lowercase Sitecore guid', () => {
    expect(convertToSitecoreGuid('C138C30AC0B3456FA547E9B1E6197EB4')).toBe(
      'c138c30a-c0b3-456f-a547-e9b1e6197eb4'
    );
  });

  it('preserves the Sitecore guid format for lowercase input', () => {
    expect(convertToSitecoreGuid('c138c30ac0b3456fa547e9b1e6197eb4')).toBe(
      'c138c30a-c0b3-456f-a547-e9b1e6197eb4'
    );
  });
});
