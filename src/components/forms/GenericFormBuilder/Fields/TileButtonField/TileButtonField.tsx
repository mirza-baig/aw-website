'use client';

import classNames from 'classnames';
import { FieldWrapper } from 'helpers/GenericFormBuilder/FieldWrapper';
import { FormFieldsTheme } from 'helpers/GenericFormBuilder/FormFields.Theme';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { OptionItem } from 'lib/generic-form-builder/utils/get-option-items';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { Page } from 'playwright';
import { JSX } from 'react';

import TileButtonItem from './helpers/TileButtonItem';
import { SelectionTypes } from './helpers/types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type TileButtonProps = ComponentProps &
  Sitecore.Forms.GenericFormBuilder.Fields.TileButton.TileButtonField & {
    options: OptionItem[];
    page: Page;
  };

enum Alignment {
  Left = 'left',
  Center = 'center',
  Right = 'right',
  Unknown = '',
}

function TileButtonField_Default(props: TileButtonProps): JSX.Element | null {
  const { themeData } = useTheme(FormFieldsTheme);
  const { page } = props;

  const fieldName = page.mode.isEditing ? 'TileButtonField' : props.fields?.fieldName.value;
  if (props.fields == undefined || isNullOrWhitespace(fieldName)) {
    return null;
  }

  const alignment = getEnum<Alignment>(props.fields.alignment) ?? Alignment.Left;
  const isMultiSelectEnabled =
    getEnum<SelectionTypes>(props.fields.selection) === SelectionTypes.Multiple;
  const moveForwardOnClick = props.fields.moveForwardOnClick.value;

  let alignmentClasses = '';

  switch (alignment) {
    case Alignment.Center:
      alignmentClasses = 'text-center justify-center';
      break;
    case Alignment.Left:
      alignmentClasses = 'text-left justify-left';
      break;
    case Alignment.Right:
      alignmentClasses = 'text-right justify-end';
      break;
  }

  const ColumnSpan: Record<number, string> = {
    1: 'md:col-span-12',
    2: 'md:col-span-6',
    3: 'md:col-span-4',
    4: 'md:col-span-3',
  };

  return (
    <div className={classNames(themeData.classes.tileButton.tileButtonContainer, alignmentClasses)}>
      <FieldWrapper {...props} isArrayField={isMultiSelectEnabled}>
        <div className={classNames(themeData.classes.tileButton.tileButtonLayout)}>
          {props.options.map((item: OptionItem) => {
            return (
              <div
                className={classNames(
                  ColumnSpan[getEnum<number>(props.fields?.buttonsPerRows) ?? 2],
                  isMultiSelectEnabled ? 'col-span-1' : 'col-span-2',
                  page.mode.isEditing ? 'pointer-events-none' : ''
                )}
                key={item.id}
              >
                <TileButtonItem
                  key={`${item.id}-item`}
                  {...item}
                  isMultiSelectEnabled={isMultiSelectEnabled}
                  groupName={fieldName}
                  moveForwardOnClick={moveForwardOnClick}
                />
              </div>
            );
          })}
        </div>
      </FieldWrapper>
    </div>
  );
}

export const Default = withDatasourceCheck(TileButtonField_Default);
