'use client';

import { ComparisonTable } from 'helpers/Comparison/ComparisonTableHelpers/ComparisonTable';
import Component from 'helpers/Component/Component';
import { ComponentProps } from 'lib/component-props';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type ComparisonTableSeriesProps = ComponentProps &
  Sitecore.Components.Product.ComparisonTable.ComparisonSeriesTable;

function ComparisonTableSeries_Default(props: ComparisonTableSeriesProps) {
  const { currentScreenWidth } = useCurrentScreenType();

  const isMobile = currentScreenWidth <= getBreakpoint('ml');

  if (!props.fields) {
    return <></>;
  }

  return (
    <Component
      variant={isMobile ? 'full' : 'lg'}
      dataComponent="product/comparisontableseries"
      padding={isMobile && 'px-0'}
      {...props}
    >
      <ComparisonTable {...props} />
    </Component>
  );
}

export const Default = withDatasourceCheck(ComparisonTableSeries_Default);
