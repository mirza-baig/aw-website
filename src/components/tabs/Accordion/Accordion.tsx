import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { AccordionClient } from './helpers/AccordionClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';
import componentMap from '.sitecore/component-map';

type AccordionProps = ComponentProps & Sitecore.Components.Tabs.Accordion.Accordion;

function Accordion_Default(props: AccordionProps): JSX.Element {
  return (
    <AccordionClient
      fields={props.fields}
      rendering={props.rendering}
      placeholder={
        <AppPlaceholder
          name={`accordion-${props.params?.DynamicPlaceholderId}`}
          rendering={props.rendering}
          page={props.page}
          componentMap={componentMap}
        />
      }
    />
  );
}

export const Default = withDatasourceCheck(Accordion_Default);
