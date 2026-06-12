'use client';

import { ComparisonTable } from 'helpers/Comparison/ComparisonTableHelpers/ComparisonTable';
import Component from 'helpers/Component/Component';
import { ComponentProps } from 'lib/component-props';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type ComparisonTableProductsProps = ComponentProps &
  Sitecore.Components.Product.ComparisonTable.ComparisonProductTable;

function ComparisonTableProducts_Default(props: ComparisonTableProductsProps) {
  const { currentScreenWidth } = useCurrentScreenType();

  const isMobile = currentScreenWidth <= getBreakpoint('ml');

  if (!props.fields) {
    return <></>;
  }

  return (
    <Component
      variant={isMobile ? 'full' : 'lg'}
      dataComponent="product/comparisontableproducts"
      padding={isMobile && 'px-0'}
      {...props}
    >
      <ComparisonTable {...props} />
    </Component>
  );
}

export const Default = withDatasourceCheck(ComparisonTableProducts_Default);
