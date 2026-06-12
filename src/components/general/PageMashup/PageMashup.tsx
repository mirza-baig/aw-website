'use client';

import Component from 'helpers/Component/Component';
import Mashup from 'helpers/MashupHelpers/Mashup';
import { ComponentProps } from 'lib/component-props';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type PageMashupProps = ComponentProps & Sitecore.Components.General.PageMashup.PageMashup;

function PageMashup_Default(props: PageMashupProps): JSX.Element {
  return (
    <Component
      variant="full"
      sectionWrapperClasses=""
      padding="px-0"
      backgroundVariant={getEnum(props.fields?.backgroundColor) ?? 'default'}
      dataComponent="general/pagemashup"
      {...props}
    >
      <Mashup {...props} />
    </Component>
  );
}

export const Default = withDatasourceCheck(PageMashup_Default);
