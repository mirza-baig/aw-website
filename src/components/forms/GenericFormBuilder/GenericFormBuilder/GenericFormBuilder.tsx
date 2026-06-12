import { ComponentProps } from 'lib/component-props';
import { FormPlaceholder } from 'lib/generic-form-builder/components/FormPlaceholder';
import { PageIndexWrapper } from 'lib/generic-form-builder/components/PageIndexWrapper';
import { fetchComponentServerProps } from 'lib/generic-form-builder/utils/load-utils/fetch-component-server-props';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { GenericFormBuilderClient } from './helpers/GenericFormBuilderClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';
import componentMap from '.sitecore/component-map';

export async function GenericFormBuilder_Default(
  props: ComponentProps & Sitecore.Forms.GenericFormBuilder.GenericFormBuilder
): Promise<JSX.Element | null> {
  const componentProps = await fetchComponentServerProps(props.rendering.placeholders);

  const paddingGap =
    getEnum<string>(props.fields?.inputPadding) === 'reduced'
      ? 'gap-x-s gap-y-xxs'
      : 'gap-y-m gap-x-s';

  return (
    <GenericFormBuilderClient
      fields={props.fields}
      rendering={props.rendering}
      placeholder={
        <FormPlaceholder
          name={`pages-${props.params?.DynamicPlaceholderId}`}
          rendering={props.rendering}
          componentProps={componentProps}
          page={props.page}
          componentMap={componentMap}
          render={(components) => {
            return components.map((component, index) => {
              const key = `form-page-${index}`;
              return (
                <PageIndexWrapper key={key} index={index} paddingGap={paddingGap}>
                  {component}
                </PageIndexWrapper>
              );
            });
          }}
        />
      }
      componentProps={componentProps}
    />
  );
}

export const Default = withDatasourceCheck(GenericFormBuilder_Default);
