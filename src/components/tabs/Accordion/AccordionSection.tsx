import { AppPlaceholder, Field, Item } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import AccordionSectionClient from './helpers/AccordionSectionClient';
import componentMap from '.sitecore/component-map';

type AccordionSectionProps = ComponentProps & {
  fields: {
    sectionTitle: Field<string>;
    sectionAnchorName: Field<string>;
    headlineLevel: Item;
  };
};

function AccordionSection_Default(props: AccordionSectionProps): JSX.Element {
  return (
    <AccordionSectionClient
      fields={props.fields}
      placeholder={
        <AppPlaceholder
          name={`section-${props.params?.DynamicPlaceholderId}`}
          rendering={props.rendering}
          page={props.page}
          componentMap={componentMap}
        />
      }
    />
  );
}

export const Default = withDatasourceCheck(AccordionSection_Default);
