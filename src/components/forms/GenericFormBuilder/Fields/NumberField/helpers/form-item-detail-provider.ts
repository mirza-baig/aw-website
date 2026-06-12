import {
  FormItemDetail,
  standardFieldDetail,
} from 'lib/generic-form-builder/utils/load-utils/form-item-detail';
import { getNumberValidatonSchema } from 'lib/generic-form-builder/utils/validation-utils/get-validation-schema';
import { ProvidedValues } from 'lib/generic-form-builder/value-providers';
import { getEnum } from 'lib/utils/get-enum';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { lazy, Schema } from 'yup';

import { Sitecore } from '.sitecore/AndersenWindows.model';

function getInitialValue(
  props: Required<Sitecore.Forms.GenericFormBuilder.Fields.Number.NumberField>
): ProvidedValues {
  return props.fields.defaultValue.value;
}

function updateValidationsProps(
  props: Required<Sitecore.Forms.GenericFormBuilder.Fields.Number.NumberField>,
  typesToFilter: string[]
): {
  updatedProps: Required<Sitecore.Forms.GenericFormBuilder.Fields.Number.NumberField>;
  extractedObjects: Record<string, Sitecore.FieldSets.Forms.FieldValidation> | undefined;
} {
  const { validations } = props.fields;

  const extractedObjects: Record<string, Sitecore.FieldSets.Forms.FieldValidation> | undefined = {};

  // @ts-ignore Once type generation is fixed, then type is inferred correctly
  const updatedValidations = validations.filter((item) => {
    const validationItem = item as unknown as Sitecore.FieldSets.Forms.FieldValidation;
    const validationType = getEnum<string>(validationItem.fields?.validationType) ?? '';

    if (typesToFilter.includes(validationType)) {
      extractedObjects[validationType] = validationItem;
      return false; // Exclude the filtered validation from the updated array
    }

    return true; // Keep other validations in the array
  });

  const updatedProps = {
    ...props,
    fields: {
      ...props.fields,
      validations: updatedValidations,
    },
  };

  return { updatedProps, extractedObjects };
}

function getValidationSchema(
  props: Required<Sitecore.Forms.GenericFormBuilder.Fields.Number.NumberField>
): Schema | undefined {
  const dependsOnItem = props.fields.dependsOn as unknown as
    | Sitecore.FieldSets.Forms.FieldNameSettings
    | undefined;
  const dependsOn = dependsOnItem?.fields?.fieldName.value;

  if (isNullOrWhitespace(dependsOn)) {
    return getNumberValidatonSchema(props as Required<Sitecore.FieldSets.Forms.ValidationSettings>);
  }

  const { extractedObjects, updatedProps } = updateValidationsProps(props, ['required', 'min']);

  const schema = getNumberValidatonSchema(
    updatedProps as Required<Sitecore.FieldSets.Forms.ValidationSettings>
  );

  return lazy((value) => {
    // Joint field validations
    return schema.when(dependsOn, ([dependsOnValue], currentSchema) => {
      if (dependsOnValue < 1 && value < 1) {
        currentSchema = currentSchema.required(
          extractedObjects?.required?.fields?.errorMessage?.value ?? ''
        );
        if (dependsOnValue === 0 && value === 0) {
          currentSchema = currentSchema.moreThan(
            0,
            extractedObjects?.required?.fields?.errorMessage?.value ?? ''
          );
        } else {
          currentSchema = currentSchema.min(
            props.fields?.minLength?.value,
            extractedObjects?.min?.fields?.errorMessage?.value ?? ''
          );
        }
      } else {
        currentSchema = currentSchema.min(
          dependsOnValue > 0 && value === 0 ? 0 : props.fields?.minLength?.value,
          extractedObjects?.min?.fields?.errorMessage?.value ?? ''
        );
      }
      return currentSchema;
    });
  }) as unknown as Schema;
}

export async function getFormItemDetail(
  props: Sitecore.Forms.GenericFormBuilder.Fields.Number.NumberField
): Promise<FormItemDetail | undefined> {
  if (props.fields == undefined || isNullOrWhitespace(props.fields.fieldName.value)) {
    return undefined;
  }
  return standardFieldDetail({
    name: props.fields.fieldName.value,
    id: props.rendering.uid!,
    templateName: 'NumberField',
    initialValue: getInitialValue(
      props as Required<Sitecore.Forms.GenericFormBuilder.Fields.Number.NumberField>
    ),
    hideOnLoad: false,
    validationSchema: getValidationSchema(
      props as Required<Sitecore.Forms.GenericFormBuilder.Fields.Number.NumberField>
    ),
  });
}
