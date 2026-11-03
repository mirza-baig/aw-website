import clientConfig from 'aw.config.client';

export interface RenoworksVisualizerProduct {
  rwd: string;
  settings?: string;
}

export interface RenoworksProductConfig {
  exterior: RenoworksVisualizerProduct;
  interior: RenoworksVisualizerProduct;
}

function base64ToBase64Url(b64: string): string {
  return b64.replaceAll('+', '-').replaceAll('/', '_').replaceAll(/=+$/g, '');
}

function toBase64Url(input: string): string {
  if (typeof btoa === 'function') {
    // Browser path — UTF-8 safe.
    const bytes = new TextEncoder().encode(input);
    const binary = Array.from(bytes, (b) => String.fromCodePoint(b)).join('');
    return base64ToBase64Url(btoa(binary));
  }

  return base64ToBase64Url(Buffer.from(input, 'utf-8').toString('base64'));
}

function assertMatchedPair(config: RenoworksProductConfig): void {
  const exteriorRwd = config.exterior?.rwd ?? '';
  const interiorRwd = config.interior?.rwd ?? '';

  const exteriorBase = exteriorRwd.replaceAll(/^exterior\//g, '').replaceAll(/_EXT\.rwd$/g, '');
  const interiorBase = interiorRwd.replaceAll(/^interior\//g, '').replaceAll(/_INT\.rwd$/g, '');

  const validExterior = exteriorRwd.startsWith('exterior/') && exteriorRwd.endsWith('_EXT.rwd');
  const validInterior = interiorRwd.startsWith('interior/') && interiorRwd.endsWith('_INT.rwd');

  if (!validExterior || !validInterior || exteriorBase !== interiorBase || exteriorBase === '') {
    throw new Error(
      `Renoworks product pair mismatch: exterior="${exteriorRwd}" interior="${interiorRwd}"`
    );
  }
}

export function encodeProductConfig(config: RenoworksProductConfig): string {
  assertMatchedPair(config);
  return toBase64Url(JSON.stringify(config));
}

export function buildVisualizerUrl(config: RenoworksProductConfig): string {
  const domain = clientConfig.renoworks.visualizerUrl;
  if (!domain) {
    throw new Error(
      'Renoworks visualizer URL is not configured (aw.config.client → renoworks.visualizerUrl / NEXT_PUBLIC_AW_RENOWORKS_VISUALIZER_URL).'
    );
  }

  const token = encodeProductConfig(config);
  const url = new URL(domain);
  url.searchParams.set('product-config', token);
  return url.toString();
}
