import { Item } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { getEnum } from 'lib/utils/get-enum';
import { JSX } from 'react';

import Button from '../Button/Button';
import { ButtonProps } from '../Button/types';
export type CtaAlignments = 'Inline' | 'Stack';

export type ButtonGroupProps = {
  cta1?: ButtonProps;
  cta2?: ButtonProps;
  cta3?: ButtonProps;
  wrapperClasses: string;
  ctaAlignment?: Item;
};

const ButtonGroup = ({
  cta1,
  cta2,
  cta3,
  wrapperClasses,
  ctaAlignment,
}: ButtonGroupProps): JSX.Element => {
  const _alignment = getEnum<CtaAlignments>(ctaAlignment) ?? 'Inline';
  const _alignmentClasses =
    _alignment == 'Stack'
      ? ' md:flex-column mb-m flex items-start md:mb-0 md:gap-y-4'
      : 'mb-s flex items-start md:flex-row md:items-center md:gap-x-4';

  return (
    <div className={classNames(wrapperClasses, _alignmentClasses)}>
      {cta1 && <Button {...cta1} classes={classNames(cta1.classes, 'mr-m')} />}
      {cta2 && <Button {...cta2} classes={classNames(cta2.classes, 'mr-m')} />}
      {cta3 && <Button {...cta3} classes={classNames(cta3.classes, 'mr-m')} />}
    </div>
  );
};

export default ButtonGroup;
