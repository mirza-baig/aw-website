import { createLlmsTxtRouteHandler } from '@sitecore-content-sdk/nextjs/route-handler';
import client from 'lib/sitecore-client';

import sites from '.sitecore/sites.json';

export const { GET } = createLlmsTxtRouteHandler({
  client,
  sites,
});
