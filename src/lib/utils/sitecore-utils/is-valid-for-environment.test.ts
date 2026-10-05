import { Environment } from 'lib/environment/environment';
import { describe, expect, it } from 'vitest';

import { isValidForEnvironment } from './is-valid-for-environment';

describe('lib > utils > sitecore-utils > is-valid-for-environment', () => {
  const environment = new Environment({
    environmentName: 'production',
    applicationName: 'website',
    roleName: 'www',
  });

  it.each([undefined, {}, { fields: {} }])(
    'returns false when the state is missing: %s',
    (fieldset) => {
      expect(isValidForEnvironment(fieldset as never, environment)).toBe(false);
    }
  );

  it('returns false when the state is Disabled', () => {
    const fieldset = { fields: { environmentState: { fields: { Value: { value: 'Disabled' } } } } };

    expect(isValidForEnvironment(fieldset as never, environment)).toBe(false);
  });

  it('returns true when the state is All', () => {
    const fieldset = { fields: { environmentState: { fields: { Value: { value: 'All' } } } } };

    expect(isValidForEnvironment(fieldset as never, environment)).toBe(true);
  });

  it('returns true when the selected state includes the current environment', () => {
    const fieldset = {
      fields: {
        environmentState: { fields: { Value: { value: 'Selected' } } },
        validEnvironments: [
          { fields: { Value: { value: 'local' } } },
          { fields: { Value: { value: 'Production' } } },
        ],
      },
    };

    expect(isValidForEnvironment(fieldset as never, environment)).toBe(true);
  });

  it.each([undefined, []])(
    'returns false for selected state without environments: %s',
    (validEnvironments) => {
      const fieldset = {
        fields: {
          environmentState: { fields: { Value: { value: 'Selected' } } },
          validEnvironments,
        },
      };

      expect(isValidForEnvironment(fieldset as never, environment)).toBe(false);
    }
  );
});
