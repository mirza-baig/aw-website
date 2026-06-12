'use client';

import Component from 'helpers/Component/Component';
import { ComponentProps } from 'lib/component-props';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX, useEffect, useRef } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type HTMLBlockProps = ComponentProps & Sitecore.Components.General.HtmlBlock.Htmlblock;

function HTMLBlock_Default(props: HTMLBlockProps): JSX.Element {
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (props.fields?.code?.value) {
      try {
        const fragment = document.createRange().createContextualFragment(props.fields?.code?.value);
        divRef.current?.append(fragment);
      } catch (error) {
        console.error('Error creating fragment:', error);
      }
    }
    // Suggested deps are coming from layout service. We can ignore useEffect warning.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!props.fields?.code?.value) {
    return <></>;
  }
  const containerWidth =
    getEnum<'fullBleed' | 'fullWidth'>(props.fields?.containerWidth) ?? 'fullWidth';
  return (
    <Component
      variant={containerWidth === 'fullBleed' ? 'full' : 'lg'}
      backgroundVariant=""
      sectionWrapperClasses=""
      dataComponent="general/htmlblock"
      {...props}
    >
      <div className="body-copy col-span-12 **:max-w-full" ref={divRef}></div>
    </Component>
  );
}

export const Default = withDatasourceCheck(HTMLBlock_Default);
