'use client';

import classNames from 'classnames';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import { cta1ToButtonProps, cta2ToButtonProps } from 'helpers/Button/Utils';
import ButtonGroup from 'helpers/ButtonGroup/ButtonGroup';
import Component, { ComponentBackgroundVariants } from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { JSX, ReactNode } from 'react';

import { XupCardCollectionTheme } from './XupCardCollection.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type XupCardCollectionProps = Sitecore.Components.Listing.XupCardCollection.XupCardContainer & {
  cards: ReactNode;
};

export function XupCardCollectionClient(props: XupCardCollectionProps): JSX.Element {
  const { themeData } = useTheme(XupCardCollectionTheme);
  const setBackgroundColor = getEnum<ComponentBackgroundVariants>(props?.fields?.backgroundColor);

  return (
    <Component
      variant="lg"
      dataComponent="listing/xupcardcollection"
      {...props}
      sectionWrapperClasses={setBackgroundColor === 'gray' ? 'theme-gray bg-light-gray' : ''}
    >
      <div className={classNames('col-span-12')}>
        <Headline classes={themeData.classes.headlineClass} {...props} />
        <BodyCopy classes={themeData.classes.bodyClass} {...props} />
        <ButtonGroup
          cta1={cta1ToButtonProps(props, themeData.classes.buttonGroupClass.cta1Classes)}
          cta2={cta2ToButtonProps(props, themeData.classes.buttonGroupClass.cta2Classes)}
          wrapperClasses={themeData.classes.buttonGroupClass.wrapper}
        />
      </div>
      {props.cards}
    </Component>
  );
}
