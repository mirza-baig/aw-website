import { getEnum } from 'lib/utils/get-enum';

import ButtonDarkBG from './buttons/btn--dark-bg';
import ButtonLink from './buttons/btn--link';
import ButtonLinkRightIcon from './buttons/btn--link-right-icon';
import ButtonPrimary from './buttons/btn--primary';
import ButtonSecondary from './buttons/btn--secondary';
import ButtonTertiary from './buttons/btn--tertiary';
import { ButtonProps, ButtonVariants } from './types';

const Button = (props: ButtonProps) => {
  const _variant = getEnum<ButtonVariants>(props.variant) ?? 'primary';

  switch (_variant) {
    case 'primary':
      return <ButtonPrimary {...props} />;
    case 'secondary':
      return <ButtonSecondary {...props} />;
    case 'tertiary':
      return <ButtonTertiary {...props} />;
    case 'link':
      return <ButtonLink {...props} />;
    case 'dark-bg':
      return <ButtonDarkBG {...props} />;
    case 'link-right-icon':
      return <ButtonLinkRightIcon {...props} />;
    default:
      return <ButtonPrimary {...props} />;
  }
};

export default Button;
