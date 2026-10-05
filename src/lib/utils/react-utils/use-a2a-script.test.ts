import { useExternalScript } from 'lib/utils/react-utils/use-external-script';
import { describe, expect, it, vi } from 'vitest';

import { useA2AScript } from './use-a2a-script';

vi.mock('lib/utils/react-utils/use-external-script', () => ({
  useExternalScript: vi.fn(),
}));

describe('lib > utils > react-utils > use-a2a-script', () => {
  it('returns the external script state', () => {
    vi.mocked(useExternalScript).mockReturnValue('ready');

    expect(useA2AScript()).toBe('ready');
  });

  it('loads the AddToAny script URL', () => {
    vi.mocked(useExternalScript).mockReturnValue('loading');

    useA2AScript();

    expect(useExternalScript).toHaveBeenCalledWith('https://static.addtoany.com/menu/page.js');
  });
});
