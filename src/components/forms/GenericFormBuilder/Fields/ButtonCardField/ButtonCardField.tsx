'use client';

import { Page } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { FieldWrapper } from 'helpers/GenericFormBuilder/FieldWrapper';
import { ComponentProps } from 'lib/component-props';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { JSX } from 'react';

import { ButtonCardItem } from './helpers/button-card-utils';
import { ButtonCardFieldItem } from './helpers/ButtonCardFieldItem';
import { SelectionTypes } from './helpers/types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type ButtonCardProps = ComponentProps &
  Sitecore.Forms.GenericFormBuilder.Fields.ButtonCard.ButtonCardField & {
    options: ButtonCardItem[];
    page: Page;
  };

function ButtonCardField_Default(props: ButtonCardProps): JSX.Element | null {
  const { page } = props;
  if (props.fields == undefined) {
    return null;
  }

  const fieldName = page.mode.isEditing ? 'ButtonCardField' : props.fields?.fieldName.value;
  if (isNullOrWhitespace(fieldName)) {
    return null;
  }

  const isMultiSelectEnabled =
    getEnum<SelectionTypes>(props.fields.selection) === SelectionTypes.Multiple;

  return (
    <FieldWrapper {...props} isArrayField={isMultiSelectEnabled}>
      <div className="grid grid-cols-2 gap-s md:grid-cols-12">
        {props.options.map((item: ButtonCardItem) => {
          return (
            <div
              className={classNames(
                'col-span-2 md:col-span-4',
                page.mode.isEditing ? 'pointer-events-none' : ''
              )}
              key={item.id}
            >
              <ButtonCardFieldItem
                key={`${item.id}-card`}
                {...item}
                isMultiSelectEnabled={isMultiSelectEnabled}
                groupName={fieldName}
              />
            </div>
          );
        })}
      </div>
    </FieldWrapper>
  );
}

export const Default = withDatasourceCheck(ButtonCardField_Default);
