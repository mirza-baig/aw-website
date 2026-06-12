import { ComponentProps } from 'lib/component-props';
import { fetchFormItemDetails } from 'lib/generic-form-builder/utils/load-utils/fetch-form-item-details';
import { FormPageDetail } from 'lib/generic-form-builder/utils/load-utils/form-page-detail';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export async function getFormPageDetail(
  props: ComponentProps & Sitecore.Forms.GenericFormBuilder.Structure.FormPage.FormPage
): Promise<FormPageDetail | undefined> {
  if (props.fields == undefined) {
    return undefined;
  }

  const formFieldDetails = await fetchFormItemDetails(
    props.rendering.placeholders,
    props.componentProps
  );

  return {
    label: props.fields.label.value,
    includeInSteps: props.fields.includeInSteps.value,
    hideStepper: props.fields.hideStepper.value,
    formFieldDetails,
  };
}
