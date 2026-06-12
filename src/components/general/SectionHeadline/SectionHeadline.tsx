'use client';

import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { SectionHeadlineTheme } from './helpers/SectionHeadline.theme';
import { BorderStyle, TextAlignment } from './helpers/SectionHeadline.types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type SectionHeadlineProps = ComponentProps &
  Sitecore.Components.General.SectionHeadline.SectionHeadline;

function SectionHeadline_Default(props: SectionHeadlineProps): JSX.Element {
  const alignment = getEnum<TextAlignment>(props.fields?.alignment) ?? 'left';
  const borderStyle = getEnum<BorderStyle>(props.fields?.underlineStyle) ?? 'default';

  const { themeData } = useTheme(SectionHeadlineTheme(alignment, borderStyle));

  return (
    <Component
      variant="lg"
      backgroundVariant=""
      sectionWrapperClasses=""
      dataComponent="general/sectionheadline"
      {...props}
    >
      <div className="col-span-12">
        <Headline classes={themeData.classes.headlineContainer} {...props} />
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(SectionHeadline_Default);
