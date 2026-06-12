'use client';

import { Text } from '@sitecore-content-sdk/nextjs';
import Component from 'helpers/Component/Component';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import { ComponentProps } from 'lib/component-props';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';

import { Sitecore } from '.sitecore/AndersenWindows.model';

function QuoteIcon() {
  const { currentScreenWidth } = useCurrentScreenType();

  return (
    <svg
      width={currentScreenWidth <= getBreakpoint('md') ? 41 : 54}
      height={currentScreenWidth <= getBreakpoint('md') ? 26 : 34}
      viewBox="0 0 54 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M53.88 0.479994L43.08 0L24.84 33.48L40.56 34.32L53.88 0.479994ZM28.92 0.479994L18.12 0L0 33.48L15.72 34.32L28.92 0.479994Z"
        fill="#F26924"
      />
    </svg>
  );
}

type BlogQuoteProps = ComponentProps & Sitecore.Components.General.BlogQuote.BlogQuote;

function BlogQuote_Default(props: BlogQuoteProps) {
  const { fields } = props;

  return (
    <Component
      variant="lg"
      backgroundVariant=""
      sectionWrapperClasses=""
      dataComponent="general/blogquote"
      {...props}
    >
      <div className="col-span-12">
        <div className="flex justify-start">
          <div className="mr-xs md:mr-m">
            <QuoteIcon />
          </div>
          <div className="font-sans text-sm-xs font-medium md:text-xs">
            <RichTextWrapper field={fields?.body} refer="font-heavy text-sm-s md:text-s! mb-xxs" />
            <Text
              tag="p"
              field={{
                value: fields?.quoteName.value,
              }}
            />
          </div>
        </div>
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(BlogQuote_Default);
