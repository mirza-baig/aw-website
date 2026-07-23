'use client';

import { ProductCompareChart } from 'helpers/Comparison/ProductCompareChartHelper/ProductCompareChart.helper';
import { ComponentProps } from 'lib/component-props';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import Component from 'src/helpers/Component/Component';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type ProductCompareChartProps = ComponentProps &
  Sitecore.Components.Product.ComparisonTable.ProductCompareChart;

function ProductCompareChart_Default(props: ProductCompareChartProps) {
  const { currentScreenWidth } = useCurrentScreenType();

  const isMobile = currentScreenWidth <= getBreakpoint('ml');

  if (!props.fields) {
    return <></>;
  }

  return (
    <Component
      variant={isMobile ? 'full' : 'lg'}
      dataComponent="product/productcomparechart"
      padding={isMobile && 'px-0'}
      {...props}
    >
      <ProductCompareChart {...props} />
    </Component>
  );
}

export const Default = withDatasourceCheck(ProductCompareChart_Default);
