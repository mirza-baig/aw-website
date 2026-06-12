'use client';

import Component from 'helpers/Component/Component';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { JSX, PropsWithChildren } from 'react';

import { BlogContainerTheme } from './BlogContainer.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type BlogContainerProps = PropsWithChildren<
  ComponentProps & Sitecore.Components.Tabs.BlogContainer.BlogContainer
>;

export function BlogContainerClient(props: BlogContainerProps): JSX.Element {
  const { themeData } = useTheme(BlogContainerTheme);
  return (
    <Component
      dataComponent="tabs/blogcontainer"
      {...props}
      grid={themeData.classes.contentWrapper}
    >
      {props.children}
    </Component>
  );
}
