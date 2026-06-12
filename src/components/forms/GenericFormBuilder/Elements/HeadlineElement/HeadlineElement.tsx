'use client';

import classNames from 'classnames';
import { FormFieldsTheme } from 'helpers/GenericFormBuilder/FormFields.Theme';
import Heading from 'helpers/Headline/Headline';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type HeadlineProps = ComponentProps &
  Sitecore.Forms.GenericFormBuilder.Elements.Headline.HeadlineElement & {
    alignmentClasses?: string;
  };

type Alignment = 'left' | 'center' | 'right';

function Headline_Default(props: HeadlineProps): JSX.Element | null {
  const textAlignment: Record<Alignment, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const { themeData } = useTheme(FormFieldsTheme);

  if (props.fields == undefined) {
    return null;
  }

  const _alignment = getEnum<Alignment>(props.fields.alignment);

  return (
    <div
      className={classNames(
        (!props?.fields?.removeHorizontalLine?.value
          ? themeData.classes.headingRuleLine
          : 'mb-0!') ?? '',
        'relative col-span-12 mb-s',
        { 'mx-auto w-fit': _alignment === 'center' }
      )}
    >
      <Heading
        classes={classNames(textAlignment[_alignment || 'left'], themeData.classes.headline)}
        {...props}
      />
    </div>
  );
}

export const Default = withDatasourceCheck(Headline_Default);
