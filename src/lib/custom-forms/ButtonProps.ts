import { FormFieldProps } from './FormFieldProps';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type ButtonProps =
  Sitecore.Forms.GenericFormBuilder.Navigation.NavigationButton.NavigationButton & FormFieldProps;
