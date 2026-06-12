import { ComponentPropsCollection } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { FormPlaceholder } from 'lib/generic-form-builder/components/FormPlaceholder';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { FormPageClient } from './helpers/FormPageClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';
import componentMap from '.sitecore/component-map';

type FormPageProps = ComponentProps &
  Sitecore.Forms.GenericFormBuilder.Structure.FormPage.FormPage & {
    classes: string;
    componentProps: ComponentPropsCollection;
  };

function FormPage_Default(props: FormPageProps): JSX.Element {
  return (
    <FormPageClient
      fields={props.fields}
      rendering={props.rendering}
      placeholder={
        <FormPlaceholder
          name={`fields-${props.params?.DynamicPlaceholderId}`}
          rendering={props.rendering}
          componentProps={props.componentProps}
          page={props.page}
          componentMap={componentMap}
        />
      }
    />
  );
}

export const Default = withDatasourceCheck(FormPage_Default);
