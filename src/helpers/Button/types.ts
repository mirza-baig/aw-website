import { Field, Item, LinkField } from '@sitecore-content-sdk/nextjs';

export type ButtonVariants =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'link'
  | 'dark-bg'
  | 'iconOnly'
  | 'link-right-icon';

export type ButtonProps = {
  field?: LinkField;
  ariaLabel?: Field<string>;
  variant?: Item;
  icon?: Item;
  classes: string;
  modalId?: string;
  modalLinkText?: Field<string>;
};
