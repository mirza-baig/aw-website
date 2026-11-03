import clientConfig from 'aw.config.client';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildVisualizerUrl, encodeProductConfig, RenoworksProductConfig } from './product-config';

vi.mock('aw.config.client', () => ({
  default: {
    renoworks: {
      visualizerUrl: 'https://andersenwindows.staging.s3.renoworks.com/',
    },
  },
}));

const referencePair: RenoworksProductConfig = {
  exterior: {
    rwd: 'exterior/50_Series_DoubleHung_EXT.rwd',
    settings:
      'Frame Color=White; color=White|Grille Style=Colonial; color=White; grilleSpacing=Custom...; grilleWidth=3/4"; cols=4; rows=2|Hardware Options=Standard Lock; color=White',
  },
  interior: {
    rwd: 'interior/50_Series_DoubleHung_INT.rwd',
    settings:
      'Frame Color=Interior; color=White|Grille Style=Colonial; color=White; grilleSpacing=Custom...; grilleWidth=3/4"; cols=4; rows=2|Hardware Options=Standard Lock; color=White',
  },
};

const referenceToken =
  'eyJleHRlcmlvciI6eyJyd2QiOiJleHRlcmlvci81MF9TZXJpZXNfRG91YmxlSHVuZ19FWFQucndkIiwic2V0dGluZ3MiOiJGcmFtZSBDb2xvcj1XaGl0ZTsgY29sb3I9V2hpdGV8R3JpbGxlIFN0eWxlPUNvbG9uaWFsOyBjb2xvcj1XaGl0ZTsgZ3JpbGxlU3BhY2luZz1DdXN0b20uLi47IGdyaWxsZVdpZHRoPTMvNFwiOyBjb2xzPTQ7IHJvd3M9MnxIYXJkd2FyZSBPcHRpb25zPVN0YW5kYXJkIExvY2s7IGNvbG9yPVdoaXRlIn0sImludGVyaW9yIjp7InJ3ZCI6ImludGVyaW9yLzUwX1Nlcmllc19Eb3VibGVIdW5nX0lOVC5yd2QiLCJzZXR0aW5ncyI6IkZyYW1lIENvbG9yPUludGVyaW9yOyBjb2xvcj1XaGl0ZXxHcmlsbGUgU3R5bGU9Q29sb25pYWw7IGNvbG9yPVdoaXRlOyBncmlsbGVTcGFjaW5nPUN1c3RvbS4uLjsgZ3JpbGxlV2lkdGg9My80XCI7IGNvbHM9NDsgcm93cz0yfEhhcmR3YXJlIE9wdGlvbnM9U3RhbmRhcmQgTG9jazsgY29sb3I9V2hpdGUifX0';

describe('encodeProductConfig', () => {
  it('matches the reference token from PRODUCT_CONFIG_CLIENT_GUIDE v2', () => {
    expect(encodeProductConfig(referencePair)).toBe(referenceToken);
  });

  it('produces base64url characters only (no +, /, or =)', () => {
    const token = encodeProductConfig(referencePair);
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('roundtrips cleanly through JSON', () => {
    const token = encodeProductConfig(referencePair);
    // Decode base64url → base64 → utf8
    const b64 =
      token.replaceAll('-', '+').replaceAll('_', '/') + '==='.slice((token.length + 3) % 4);
    const json = Buffer.from(b64, 'base64').toString('utf-8');
    expect(JSON.parse(json)).toEqual(referencePair);
  });

  it('throws when exterior is not in the exterior/ folder', () => {
    expect(() =>
      encodeProductConfig({
        exterior: { rwd: 'wrong/50_Series_DoubleHung_EXT.rwd' },
        interior: { rwd: 'interior/50_Series_DoubleHung_INT.rwd' },
      })
    ).toThrow(/pair mismatch/);
  });

  it('throws when interior is missing the _INT.rwd suffix', () => {
    expect(() =>
      encodeProductConfig({
        exterior: { rwd: 'exterior/50_Series_DoubleHung_EXT.rwd' },
        interior: { rwd: 'interior/50_Series_DoubleHung.rwd' },
      })
    ).toThrow(/pair mismatch/);
  });

  it('throws when exterior and interior base names differ', () => {
    expect(() =>
      encodeProductConfig({
        exterior: { rwd: 'exterior/A_Series_Casement_EXT.rwd' },
        interior: { rwd: 'interior/50_Series_DoubleHung_INT.rwd' },
      })
    ).toThrow(/pair mismatch/);
  });
});

describe('buildVisualizerUrl', () => {
  const originalVisualizerUrl = clientConfig.renoworks.visualizerUrl;

  beforeEach(() => {
    clientConfig.renoworks.visualizerUrl = 'https://andersenwindows.staging.s3.renoworks.com/';
  });

  afterAll(() => {
    clientConfig.renoworks.visualizerUrl = originalVisualizerUrl;
  });

  it('appends the token as the product-config query param', () => {
    const url = buildVisualizerUrl(referencePair);
    expect(url).toBe(
      `https://andersenwindows.staging.s3.renoworks.com/?product-config=${referenceToken}`
    );
  });

  it('throws when the visualizer URL is not configured', () => {
    clientConfig.renoworks.visualizerUrl = '';
    expect(() => buildVisualizerUrl(referencePair)).toThrow(/not configured/);
  });
});
