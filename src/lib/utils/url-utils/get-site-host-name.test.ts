import { faker } from '@faker-js/faker';
import { SiteInfo } from '@sitecore-content-sdk/nextjs';
import { Environment } from 'lib/environment/environment';
import { describe, expect, it } from 'vitest';

import { getSiteHostName } from './get-site-host-name';

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

const EMPTY_STRING = '';

describe('lib > utils > url-utils > get-site-host-name', () => {
  describe('in a preview role', () => {
    const environment = buildEnvironment({
      roleName: 'preview',
    });

    it('handles undefined', () => {
      expect(getSiteHostName(undefined, environment)).toBe(EMPTY_STRING);
    });

    it('ignores a non-string targetHostName', () => {
      const site = buildSiteInfo({ targetHostName: 6 });
      expect(getSiteHostName(site, environment)).toBe(EMPTY_STRING);
    });

    it('ignores a whitespace targetHostName', () => {
      const site = buildSiteInfo({ targetHostName: '   ' });
      expect(getSiteHostName(site, environment)).toBe(EMPTY_STRING);
    });

    it('prefers a valid targetHostName', () => {
      const targetHostName = faker.internet.domainName();
      const site = buildSiteInfo({ targetHostName });
      expect(getSiteHostName(site, environment)).toBe(`https://${targetHostName}`);
    });

    it('handles a hostName of *', () => {
      const site = buildSiteInfo({ hostName: '*' });
      expect(getSiteHostName(site, environment)).toBe(EMPTY_STRING);
    });

    it('handles a single hostName', () => {
      const hostName = faker.internet.domainName();
      const site = buildSiteInfo({ hostName: hostName });
      expect(getSiteHostName(site, environment)).toBe(`https://${hostName}`);
    });

    it('handles a hostName of * when multiple', () => {
      const site = buildSiteInfo({ hostName: '*|*' });
      expect(getSiteHostName(site, environment)).toBe(EMPTY_STRING);
    });

    it('returns preview hostName when multiple', () => {
      const hostName = faker.internet.domainName();
      const site = buildSiteInfo({ hostName: `preview.${hostName}|www.${hostName}` });
      expect(getSiteHostName(site, environment)).toBe(`https://preview.${hostName}`);
    });
  });

  describe('in a www role', () => {
    const environment = buildEnvironment({
      roleName: 'www',
    });

    it('handles undefined', () => {
      expect(getSiteHostName(undefined, environment)).toBe(EMPTY_STRING);
    });

    it('ignores a non-string targetHostName', () => {
      const targetHostName = 6;
      const site = buildSiteInfo({ targetHostName });
      expect(getSiteHostName(site, environment)).toBe(EMPTY_STRING);
    });

    it('ignores a whitespace targetHostName', () => {
      const targetHostName = '\t';
      const site = buildSiteInfo({ targetHostName });
      expect(getSiteHostName(site, environment)).toBe(EMPTY_STRING);
    });

    it('prefers a valid targetHostName', () => {
      const targetHostName = faker.internet.domainName();
      const site = buildSiteInfo({ targetHostName });
      expect(getSiteHostName(site, environment)).toBe(`https://${targetHostName}`);
    });

    it('handles a hostName of *', () => {
      const site = buildSiteInfo({ hostName: '*' });
      expect(getSiteHostName(site, environment)).toBe(EMPTY_STRING);
    });

    it('handles a single hostName', () => {
      const hostName = faker.internet.domainName();
      const site = buildSiteInfo({ hostName: hostName });
      expect(getSiteHostName(site, environment)).toBe(`https://${hostName}`);
    });

    it('handles a hostName of * when multiple', () => {
      const site = buildSiteInfo({ hostName: '*|*' });
      expect(getSiteHostName(site, environment)).toBe(EMPTY_STRING);
    });

    it('returns www hostName when multiple', () => {
      const hostName = faker.internet.domainName();
      const site = buildSiteInfo({ hostName: `preview.${hostName}|www.${hostName}` });
      expect(getSiteHostName(site, environment)).toBe(`https://www.${hostName}`);
    });
  });
});
