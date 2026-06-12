'use client';

import classNames from 'classnames';
import { BodyCopy } from 'helpers/BodyCopy/BodyCopy';
import { FormFieldsTheme } from 'helpers/GenericFormBuilder/FormFields.Theme';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type alignmentStatus = 'left' | 'center' | 'right';

function DescriptionElement_Default(
  props: ComponentProps & Sitecore.Forms.GenericFormBuilder.Elements.Description.DescriptionElement
): JSX.Element | null {
  const { themeData } = useTheme(FormFieldsTheme);

  if (props.fields == undefined) {
    return null;
  }

  const descriptionAlignment: Record<alignmentStatus, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className="relative col-span-12">
      <BodyCopy
        classes={classNames(
          descriptionAlignment[getEnum<alignmentStatus>(props?.fields?.alignment) || 'left'],
          themeData.classes.description
        )}
        fields={{ body: props.fields.body }}
      />
    </div>
  );
}

export const Default = withDatasourceCheck(DescriptionElement_Default);
