import { CookieInfo } from '../cookie-info';
import { SourcingCookiesPlugin, SourcingCookiesPluginParams } from '../sourcing-cookies-plugin';

// for AW: Query String and the corresponding cookie name
const CookieMappings: { [key: string]: string } = {
  sourceKey: 'awSourceKey',
  aw_cid: 'awCampaignId',
};

const expiryTime = ''; // for AW : cookie will be removed at the end of the session

export class AndersenWindows implements SourcingCookiesPlugin {
  exec({ searchParams, siteInfo }: SourcingCookiesPluginParams): CookieInfo[] {
    if (siteInfo.name !== 'AndersenWindows') {
      return [];
    }

    const cookiesToSet: CookieInfo[] = [];

    const mappingKeys = Object.keys(CookieMappings);

    searchParams.forEach((value, key) => {
      const lowercaseKey = key.toLowerCase();
      const cookieMappingKey = mappingKeys.find(
        (mappingKey) => mappingKey.toLowerCase() === lowercaseKey
      );

      if (cookieMappingKey) {
        cookiesToSet.push({ name: CookieMappings[cookieMappingKey], value, expiryTime });
      }
    });

    return cookiesToSet;
  }
}

export const plugin = new AndersenWindows();
