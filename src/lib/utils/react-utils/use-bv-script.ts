'use client';

import { Environment } from 'lib/environment/environment';
import { useExternalScript } from 'lib/utils/react-utils/use-external-script';

interface UseBVScriptProps {
  environment: Environment;
  theme: string;
}

/**
 * Loads the Bazaarvoice script for the Andersen Windows theme.
 *
 * Production environments use the production script; other environments use
 * the staging script. Unsupported themes do not load a script.
 *
 * @param props The environment and theme used to select the script.
 * @returns The external script loading state.
 */
export function useBVScript(props: UseBVScriptProps) {
  const { environment, theme } = props;

  let bazaarvoiceScriptUrl = '';

  if (theme == 'aw') {
    bazaarvoiceScriptUrl = environment.isProduction()
      ? 'https://apps.bazaarvoice.com/deployments/andersenwindows/main_website_dxp/production/en_US/bv.js'
      : 'https://apps.bazaarvoice.com/deployments/andersenwindows/main_website_dxp/staging/en_US/bv.js';
  }

  const bazaarvoiceScriptState = useExternalScript(bazaarvoiceScriptUrl);

  return bazaarvoiceScriptState;
}
