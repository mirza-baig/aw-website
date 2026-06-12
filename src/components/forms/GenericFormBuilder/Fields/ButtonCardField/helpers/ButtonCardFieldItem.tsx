import { Text } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { Field } from 'formik';
import { FormFieldsTheme } from 'helpers/GenericFormBuilder/FormFields.Theme';
import ImagePrimary from 'helpers/Media/ImagePrimary';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import { useTheme } from 'lib/context/ThemeContext';
import { JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export type ButtonCardFieldItemProps =
  Sitecore.Forms.GenericFormBuilder.Datasources.ButtonCardItem & {
    isMultiSelectEnabled: boolean;
    groupName: string;
  };

export function ButtonCardFieldItem({
  fields,
  isMultiSelectEnabled,
  groupName,
}: ButtonCardFieldItemProps): JSX.Element | null {
  const { themeData } = useTheme(FormFieldsTheme);
  if (!fields) {
    return null;
  }

  const imageProps = {
    fields: {
      primaryImageCaption: {
        value: '',
      },
      primaryImage: fields.desktopImage,
      primaryImageMobile: fields.mobileImage,
    },
  };

  return (
    <label>
      <Field
        className={classNames(
          'appearence-none h-0 w-0 border-0 outline-none ring-0 focus:ring-0 [&:focus:checked+.button-card-item]:before:ring-2 [&:focus+.button-card-item]:before:ring-2',
          themeData.classes.buttonCard.buttonCardItemSelected
        )}
        type={isMultiSelectEnabled ? 'checkbox' : 'radio'}
        name={groupName}
        value={fields.value?.value}
      />

      <div
        className={classNames(
          themeData.classes.buttonCard.buttonCardItem,
          themeData.classes.buttonCard.buttonCardItemDesktop
        )}
      >
        {imageProps.fields.primaryImage.value?.src && (
          <div className={classNames(themeData.classes.buttonCard.image)}>
            <ImagePrimary
              imageLayout="fill"
              additionalMobileClasses="min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px]"
              additionalDesktopClasses="min-w-[118px] min-h-[118px] max-w-[118px] max-h-[118px]"
              {...imageProps}
            />
          </div>
        )}
        <div>
          {fields?.title && (
            <div className={classNames(themeData.classes.buttonCard.title)}>
              <Text field={{ value: fields?.title.value }} />
            </div>
          )}
          {fields?.description && (
            <div className={classNames(themeData.classes.buttonCard.description)}>
              <RichTextWrapper field={{ value: fields?.description.value }} />
            </div>
          )}
        </div>
      </div>
    </label>
  );
}
