import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { ComponentWithContextProps } from 'lib/component-props';

import componentMap from '.sitecore/component-map';

const PartialDesignDynamicPlaceholder = (props: ComponentWithContextProps) => {
  return (
    <AppPlaceholder
      name={props.rendering?.params?.sig ?? ''}
      rendering={props.rendering}
      page={props.page}
      componentMap={componentMap}
    />
  );
};

export default PartialDesignDynamicPlaceholder;
