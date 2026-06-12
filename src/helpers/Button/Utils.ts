import { ButtonProps } from './types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export function cta1ToButtonProps({ fields }: Sitecore.FieldSets.Cta1, classes = ''): ButtonProps {
  return {
    field: fields?.cta1Link,
    variant: fields?.cta1Style,
    icon: fields?.cta1Icon,
    modalId: (fields?.cta1Modal as unknown as Sitecore.Components.Modal.GenericModal.GenericModal)
      ?.fields?.modalId?.value,
    modalLinkText: fields?.cta1ModalLinkText,
    classes,
  };
}

export function cta2ToButtonProps({ fields }: Sitecore.FieldSets.Cta2, classes = ''): ButtonProps {
  return {
    field: fields?.cta2Link,
    variant: fields?.cta2Style,
    icon: fields?.cta2Icon,
    modalId: (fields?.cta2Modal as unknown as Sitecore.Components.Modal.GenericModal.GenericModal)
      ?.fields?.modalId?.value,
    modalLinkText: fields?.cta2ModalLinkText,
    classes,
  };
}

export function cta3ToButtonProps({ fields }: Sitecore.FieldSets.Cta3, classes = ''): ButtonProps {
  return {
    field: fields?.cta3Link,
    variant: fields?.cta3Style,
    icon: fields?.cta3Icon,
    modalId: (fields?.cta3Modal as unknown as Sitecore.Components.Modal.GenericModal.GenericModal)
      ?.fields?.modalId?.value,
    modalLinkText: fields?.cta3ModalLinkText,
    classes,
  };
}
