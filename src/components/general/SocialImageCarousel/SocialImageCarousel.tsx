'use client';

import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import Script from 'next/script';
import { JSX, useEffect } from 'react';

import { SocialImageCarouselTheme } from './helpers/SocialImageCarousel.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type SocialImageCarouselProps = ComponentProps &
  Sitecore.Components.Social.SocialImageCarousel.SocialImageCarousel;

function SocialImageCarousel_Default(props: SocialImageCarouselProps): JSX.Element {
  const { themeName, themeData } = useTheme(SocialImageCarouselTheme);

  const siteName =
    props.fields?.siteName.value ?? (themeName === 'aw' ? 'andersenwindows-6o5qt0' : '');

  const containerId = props.fields?.containerID?.value ?? '';
  const genericFilter = props.fields?.genericFilter?.value ?? '';
  const slideFormat = props.fields?.slideFormat?.fields?.Value?.value ?? 'inline';

  useEffect(() => {
    const htmlElement = document.documentElement;
    const originalScrollBehavior = htmlElement.style.scrollBehavior;
    htmlElement.style.scrollBehavior = 'auto';

    return () => {
      htmlElement.style.scrollBehavior = originalScrollBehavior;
    };
  }, []);
  return (
    <Component variant="lg" dataComponent="general/socialimagecarousel" {...props}>
      <div
        className={
          slideFormat === 'inline'
            ? themeData.classes.wrapperInline
            : themeData.classes.wrapperStack
        }
      >
        {slideFormat === 'inline' ? (
          <div className={themeData.classes.headlineClass}>
            <Headline classes={themeData.classes.headlineTextInline} {...props} />
            <BodyCopy classes={themeData.classes.bodyCopyClassInline} {...props} />
          </div>
        ) : (
          <div>
            <Headline classes={themeData.classes.headlineTextStack} {...props} />
            {themeName === 'rba' && (
              <BodyCopy classes={themeData.classes.bodyCopyClassStack} {...props} />
            )}
          </div>
        )}
        <div>
          <Script src={`https://edge.curalate.com/sites/${siteName}/site/latest/site.min.js`} />
          <div
            className={
              slideFormat === 'inline'
                ? themeData.classes.carouselInline
                : themeData.classes.carouselStack
            }
            data-crl8-container-id={`${containerId}`}
            data-crl8-filter={`${genericFilter.trim()}`}
          ></div>
        </div>
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(SocialImageCarousel_Default);
