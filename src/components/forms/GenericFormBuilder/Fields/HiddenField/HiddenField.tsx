'use client';

import { Field } from 'formik';
import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

function HiddenField_Default(
  props: ComponentProps & Sitecore.Forms.GenericFormBuilder.Fields.Hidden.HiddenField
): JSX.Element | null {
  const { page } = props;

  if (page.mode.isEditing) {
    return <div className="col-span-12 p-3 bg-light-gray border border-gray">Hidden Field</div>;
  }

  if (props.fields == undefined) {
    return null;
  }

  const fieldName = props.fields.fieldName.value;
  if (isNullOrWhitespace(fieldName) && !page.mode.isEditing) {
    return null;
  }

  return (
    <div className="relative mb-s" data-te-input-wrapper-init>
      <Field id={props.rendering.uid} name={fieldName} type="hidden" />
    </div>
  );
}

export const Default = withDatasourceCheck(HiddenField_Default);
