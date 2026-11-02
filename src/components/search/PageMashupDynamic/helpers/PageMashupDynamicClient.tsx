'use client';

import Component from 'helpers/Component/Component';
import DynamicMashup from 'helpers/MashupHelpers/DynamicMashup';
import { ComponentProps } from 'lib/component-props';
import { getEnum } from 'lib/utils/sitecore-utils/get-enum';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type PageMashupDynamicProps = ComponentProps &
  Sitecore.Components.Search.PageMashupDynamic.PageMashupDynamic & {
    fields: {
      children: Sitecore.Components.Search.PageMashupDynamic.ResultItem[];
    };
    boostingExpression: string;
    filterExpression: string;
  };

export function PageMashupDynamicClient(props: PageMashupDynamicProps) {
  const { fields } = props.fields;

  return (
    <Component
      variant="full"
      padding="px-0"
      backgroundVariant={getEnum(fields?.backgroundColor)}
      dataComponent="general/pagemashup"
      fields={fields}
      rendering={props.rendering}
      params={props.params}
    >
      <DynamicMashup fields={fields} rendering={props.rendering} params={props.params} boostingExpression={props.boostingExpression} filterExpression={props.filterExpression} />
    </Component>
  );
}
