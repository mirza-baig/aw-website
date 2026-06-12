'use client';

import classNames from 'classnames';
import { Eyebrow } from 'helpers/Eyebrow';
import { FormFieldsTheme } from 'helpers/GenericFormBuilder/FormFields.Theme';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { getHeadingLevel } from 'lib/utils/get-heading-level';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type alignmentStatus = 'left' | 'center' | 'right';

function EyebrowElement_Default(
  props: ComponentProps & Sitecore.Forms.GenericFormBuilder.Elements.Eyebrow.EyebrowElement
): JSX.Element | null {
  const { themeData } = useTheme(FormFieldsTheme);
  const defaultTag = 'h3';
  const tag = getHeadingLevel(defaultTag, props?.fields?.eyebrowLevel);

  if (props.fields == undefined) {
    return null;
  }

  const eyebrowAlignment: Record<alignmentStatus, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className="relative col-span-12">
      <Eyebrow
        classes={classNames(
          eyebrowAlignment[getEnum<alignmentStatus>(props?.fields?.alignment) ?? 'left'],
          themeData.classes.eyebrow
        )}
        useTag={tag}
        {...props}
      />
    </div>
  );
}

export const Default = withDatasourceCheck(EyebrowElement_Default);
