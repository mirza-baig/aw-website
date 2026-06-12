'use client';

import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import { useTheme } from 'lib/context/ThemeContext';
import { JSX, ReactNode } from 'react';

import { AccordionTheme } from './Accordion.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type AccordionProps = Sitecore.Components.Tabs.Accordion.Accordion & {
  placeholder: ReactNode;
};

export function AccordionClient(props: AccordionProps): JSX.Element {
  const { themeData } = useTheme(AccordionTheme);

  return (
    <Component dataComponent="tabs/accordion" {...props}>
      <div className="theme-white col-span-12 my-8">
        <div className={themeData.classes.accordionWrapper}>
          <Headline {...props} classes={themeData.classes.headline} />
          <RichTextWrapper field={props.fields?.body} classes={themeData.classes.bodyCopy} />
          {props.placeholder}
        </div>
      </div>
    </Component>
  );
}
