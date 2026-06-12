import { Environment } from 'lib/environment/environment';
import { useExternalScript } from 'lib/utils/use-external-script';

export const useBVScript = (props: UseBVScriptProps) => {
  const { environment, theme } = props;

  let bazaarvoiceScriptUrl = '';

  if (theme == 'aw') {
    bazaarvoiceScriptUrl = environment.isProduction()
      ? 'https://apps.bazaarvoice.com/deployments/andersenwindows/main_website_dxp/production/en_US/bv.js'
      : 'https://apps.bazaarvoice.com/deployments/andersenwindows/main_website_dxp/staging/en_US/bv.js';
  }

  const bazaarvoiceScriptState = useExternalScript(bazaarvoiceScriptUrl);

  return bazaarvoiceScriptState;
};

export interface UseBVScriptProps {
  environment: Environment;
  theme: string;
}
