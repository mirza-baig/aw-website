'use client';

import classNames from 'classnames';
import { ComponentMargin, ComponentPadding, ComponentSpacing } from 'helpers/Component/Component';
import { useCurrentScreenType } from 'lib/utils/get-screen-type';
import { JSX, PropsWithChildren, useEffect, useState } from 'react';

import { HeroMediaBackgroundProps } from './types';
import { asEnumField, getSpacingClass } from './utils';

export function WrapperClient(
  props: PropsWithChildren<HeroMediaBackgroundProps>
): JSX.Element | null {
  const { currentScreenWidth } = useCurrentScreenType();
  const [stepFixed, setStepFixed] = useState('');

  useEffect(() => {
    const raqBanner = document.getElementById('raqbanner');

    if (raqBanner && currentScreenWidth <= 1007 && props?.fields?.componentSpacing) {
      setStepFixed('my-28');
    } else {
      setStepFixed('');
    }
  }, [currentScreenWidth, props?.fields?.componentSpacing]);

  const spacingField = asEnumField<ComponentSpacing>(props.fields?.componentSpacing);
  const paddingField = asEnumField<ComponentPadding>(props.fields?.componentPadding);
  const marginField = asEnumField<ComponentMargin>(props.fields?.componentMargin);

  const componentSpacing = getSpacingClass(spacingField, paddingField, marginField);

  return (
    <div
      data-component="hero/heromediabackground"
      className={classNames('relative', componentSpacing, stepFixed)}
    >
      {props.children}
    </div>
  );
}
