import {
  AppPlaceholder,
  AppPlaceholderProps,
  ComponentPropsCollection,
  ComponentRendering,
  Field,
  Item,
} from '@sitecore-content-sdk/nextjs';
import { JSX } from 'react';

interface AppComponentProps {
  fields: {
    [name: string]: Field | Item | Item[];
  };
  params: {
    [name: string]: string;
  };
  rendering: ComponentRendering;
}

interface FormComponentProps {
  fields: {
    [name: string]: Field | Item | Item[];
  };
  params: {
    [name: string]: string;
  };
  rendering: ComponentRendering;
  componentProps: ComponentPropsCollection;
}

function modifyComponentPropsFactory(componentProps: ComponentPropsCollection) {
  return function modifyComponentProps(initialProps: AppComponentProps): FormComponentProps {
    if (!initialProps.rendering.uid) {
      return { ...initialProps, componentProps };
    }

    const data = componentProps[initialProps.rendering.uid] as Record<string, unknown> | undefined;

    if (data === undefined) {
      return { ...initialProps, componentProps };
    }

    return {
      ...initialProps,
      ...data,
      componentProps,
    };
  };
}

export interface FormPlaceholderProps extends AppPlaceholderProps {
  componentProps: ComponentPropsCollection;
}

export function FormPlaceholder(props: Readonly<FormPlaceholderProps>): JSX.Element {
  return (
    <AppPlaceholder
      {...props}
      modifyComponentProps={modifyComponentPropsFactory(props.componentProps)}
    />
  );
}
