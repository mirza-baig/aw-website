'use client';

import { Text } from '@sitecore-content-sdk/nextjs';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type RaqMobileBannerProps = Sitecore.Components.Navigation.RaqMobileBanner.RaqmobileBanner;

export default function RaqMobileBanner(props: RaqMobileBannerProps) {
  return (
    <div id="raqbanner" className="h-[55px]">
      <div className="bg-primary text-white max-ml:relative max-ml:mb-5 max-ml:min-h-[75px] md:max-w-(--breakpoint-xl) ml:mb-0 ml:mt-8 ml:px-l lg:mx-auto">
        <div className="flex  flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="text-center">
              {props?.props?.fields?.textBeforeCta?.value && (
                <Text
                  tag={'h3'}
                  field={{ value: props?.props?.fields?.textBeforeCta.value }}
                  className="font-sans text-sm"
                />
              )}
            </div>

            <div className="flex flex-row">
              {props?.props.fields?.cta1Link && (
                <>
                  <LinkWrapper
                    field={{ value: props.props?.fields?.cta1Link.value }}
                    className="font-sans text-sm font-bold underline"
                  />
                  <Text
                    tag={'h3'}
                    field={{ value: props?.props?.fields?.textAfterCta.value }}
                    className="m-auto pl-1 font-sans text-sm"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
