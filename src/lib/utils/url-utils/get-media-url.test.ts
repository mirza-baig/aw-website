import { faker } from '@faker-js/faker';
import { SiteInfo } from '@sitecore-content-sdk/content/site';
import { Environment } from 'lib/environment/environment';
import { describe, expect, it } from 'vitest';

import { getMediaUrl, GetMediaUrlOptions, MediaUrlType } from './get-media-url';

function buildSiteInfo(overrides?: Partial<SiteInfo>): SiteInfo {
  return {
    hostName: '*',
    name: 'test',
    language: 'en',
    ...overrides,
  };
}

function buildEnvironment(
  overrides?: Partial<{
    environmentName: string;
    applicationName: string;
    roleName: string;
  }>
): Environment {
  return new Environment({
    applicationName: 'test',
    environmentName: 'test',
    roleName: 'preview',
    ...overrides,
  });
}

function buildParams(
  overrides?: Partial<{
    url: { src?: string } | string | undefined | null;
    type: MediaUrlType | undefined;
    siteInfo: SiteInfo | undefined;
    environment: Environment | undefined;
    options: GetMediaUrlOptions | undefined;
  }>
): [
  string | { src?: string } | null | undefined,
  MediaUrlType,
  SiteInfo,
  Environment,
  GetMediaUrlOptions,
] {
  return [
    overrides?.url == null ? null : (overrides?.url ?? undefined),
    overrides?.type ?? MediaUrlType.Canonical,
    overrides?.siteInfo ?? buildSiteInfo(),
    overrides?.environment ?? buildEnvironment(),
    overrides?.options ?? {},
  ];
}

const EMPTY_STRING = '';

describe('lib > utils > url-utils > get-media-url', () => {
  it('returns an empty string for undefined with no fallback', () => {
    expect(getMediaUrl(...buildParams({ url: undefined }))).toBe(EMPTY_STRING);
  });

  it('returns an fallback for undefined with a fallback', () => {
    const fallbackUrl = faker.internet.url();
    expect(getMediaUrl(...buildParams({ url: undefined, options: { fallbackUrl } }))).toBe(
      fallbackUrl
    );
  });

  it('returns an empty string for null with no fallback', () => {
    expect(getMediaUrl(...buildParams({ url: null }))).toBe(EMPTY_STRING);
  });

  it('returns an fallback for null with a fallback', () => {
    const fallbackUrl = faker.internet.url();
    expect(getMediaUrl(...buildParams({ url: null, options: { fallbackUrl } }))).toBe(fallbackUrl);
  });

  it('returns an empty string for undefined src with no fallback', () => {
    expect(getMediaUrl(...buildParams({ url: { src: undefined } }))).toBe(EMPTY_STRING);
  });

  it('returns an fallback for undefined src with a fallback', () => {
    const fallbackUrl = faker.internet.url();
    expect(getMediaUrl(...buildParams({ url: { src: undefined }, options: { fallbackUrl } }))).toBe(
      fallbackUrl
    );
  });

  describe('relative media url type', () => {
    describe('in a preview role', () => {
      const environment = buildEnvironment({
        roleName: 'preview',
      });
      const siteInfo = buildSiteInfo({
        mediaHostName: faker.internet.domainName(),
        targetHostName: faker.internet.domainName(), // I think requiring this is a bug
      });

      it('prepends the media host name', () => {
        const relativeUrl = faker.system.filePath();
        const url = `https://${faker.internet.domainName()}${relativeUrl}`;
        expect(
          getMediaUrl(...buildParams({ url, type: MediaUrlType.Relative, environment, siteInfo }))
        ).toBe(`https://${siteInfo.mediaHostName}${relativeUrl}`);
      });

      it('converts edge urls', () => {
        const relativeUrl = faker.system.filePath();
        const url = `https://edge.sitecorecloud.io/remove-me${relativeUrl}`;
        expect(
          getMediaUrl(...buildParams({ url, type: MediaUrlType.Relative, environment, siteInfo }))
        ).toBe(`https://${siteInfo.mediaHostName}/-${relativeUrl}`);
      });
    });

    describe('in a www role', () => {
      const environment = buildEnvironment({
        roleName: 'www',
      });

      it('returns a relative media URL', () => {
        const relativeUrl = faker.system.filePath();
        const url = `https://${faker.internet.domainName()}${relativeUrl}`;
        expect(getMediaUrl(...buildParams({ url, type: MediaUrlType.Relative, environment }))).toBe(
          relativeUrl
        );
      });

      it('converts edge urls', () => {
        const relativeUrl = faker.system.filePath();
        const url = `https://edge.sitecorecloud.io/remove-me${relativeUrl}`;
        expect(getMediaUrl(...buildParams({ url, type: MediaUrlType.Relative, environment }))).toBe(
          `/-${relativeUrl}`
        );
      });
    });
  });

  describe('cdn media url type', () => {
    describe('in a preview role', () => {
      const environment = buildEnvironment({
        roleName: 'preview',
      });
      const siteInfo = buildSiteInfo({
        mediaHostName: faker.internet.domainName(),
        targetHostName: faker.internet.domainName(), // I think requiring this is a bug
      });

      it('prepends the media host name', () => {
        const relativeUrl = faker.system.filePath();
        const url = `https://${faker.internet.domainName()}${relativeUrl}`;
        expect(
          getMediaUrl(...buildParams({ url, type: MediaUrlType.Cdn, environment, siteInfo }))
        ).toBe(`https://${siteInfo.mediaHostName}${relativeUrl}`);
      });

      it('converts edge urls', () => {
        const relativeUrl = faker.system.filePath();
        const url = `https://edge.sitecorecloud.io/remove-me${relativeUrl}`;
        expect(
          getMediaUrl(...buildParams({ url, type: MediaUrlType.Cdn, environment, siteInfo }))
        ).toBe(`https://${siteInfo.mediaHostName}/-${relativeUrl}`);
      });
    });

    describe('in a www role', () => {
      const environment = buildEnvironment({
        roleName: 'www',
      });

      it('returns original url', () => {
        const relativeUrl = faker.system.filePath();
        const url = `https://${faker.internet.domainName()}${relativeUrl}`;
        expect(getMediaUrl(...buildParams({ url, type: MediaUrlType.Cdn, environment }))).toBe(url);
      });
    });
  });

  describe('canonical media url type', () => {
    const siteInfo = buildSiteInfo({
      mediaHostName: faker.internet.domainName(),
      targetHostName: faker.internet.domainName(), // I think requiring this is a bug
    });

    describe('in a preview role', () => {
      const environment = buildEnvironment({
        roleName: 'preview',
      });

      it('uses the target host name', () => {
        const relativeUrl = faker.system.filePath();
        const url = `https://${faker.internet.domainName()}${relativeUrl}`;
        expect(
          getMediaUrl(...buildParams({ url, type: MediaUrlType.Canonical, environment, siteInfo }))
        ).toBe(`https://${siteInfo.targetHostName}${relativeUrl}`);
      });

      it('converts edge urls', () => {
        const relativeUrl = faker.system.filePath();
        const url = `https://edge.sitecorecloud.io/remove-me${relativeUrl}`;
        expect(
          getMediaUrl(...buildParams({ url, type: MediaUrlType.Canonical, environment, siteInfo }))
        ).toBe(`https://${siteInfo.targetHostName}/-${relativeUrl}`);
      });
    });

    describe('in a www role', () => {
      const environment = buildEnvironment({
        roleName: 'www',
      });

      it('uses the target host name', () => {
        const relativeUrl = faker.system.filePath();
        const url = `https://${faker.internet.domainName()}${relativeUrl}`;
        expect(
          getMediaUrl(...buildParams({ url, type: MediaUrlType.Canonical, environment, siteInfo }))
        ).toBe(`https://${siteInfo.targetHostName}${relativeUrl}`);
      });
    });
  });
});
