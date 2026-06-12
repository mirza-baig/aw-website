'use client';

import Component from 'helpers/Component/Component';
import SwatchCollectionHelper from 'helpers/SwatchCollection/SwatchCollection';
import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type SwatchCollectionProps = ComponentProps &
  Sitecore.Components.General.SwatchCollections.SwatchCollections;

// Extend helper props to include layoutStyle
type SwatchCollectionHelperProps = SwatchCollectionProps & {
  layoutStyle?: string;
};

function SwatchCollection_Default(props: SwatchCollectionProps) {
  const Helper = SwatchCollectionHelper as React.ComponentType<SwatchCollectionHelperProps>;

  return (
    <Component
      variant="lg"
      backgroundVariant=""
      sectionWrapperClasses=""
      dataComponent="general/swatchcollection"
      {...props}
    >
      <div className="col-span-12">
        <Helper layoutStyle="full-width" {...props} />
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(SwatchCollection_Default);
