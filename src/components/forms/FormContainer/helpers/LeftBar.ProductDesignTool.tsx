'use client';

import classNames from 'classnames';
import {
  SummaryAttributeTheme,
  SummaryAttributeThemeSubType,
} from 'components/tool/DesignTool/helpers/attributes/SummaryAttribute.theme';
import { DesignToolContext } from 'components/tool/DesignTool/helpers/DesignToolContext.helper';
import Headline from 'helpers/Headline/Headline';
import { MediaPrimary } from 'helpers/Media';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import { useTheme } from 'lib/context/ThemeContext';
import { useRenoworks } from 'lib/renoworks/renoworks-context';
import { getEnum } from 'lib/utils/get-enum';
import NextLink from 'next/link';
import { JSX, useContext } from 'react';

import { getLeftBarTheme } from './LeftBar.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type LeftBarProps = Sitecore.Components.Forms.FormContainer.FormContainer;

export function LeftBar(props: LeftBarProps): JSX.Element | null {
  const { viewModel } = useRenoworks();
  const { designToolRouter } = useContext(DesignToolContext);
  const { themeData } = useTheme(SummaryAttributeTheme());
  const theme = (themeData as SummaryAttributeThemeSubType).classes;

  const productSeries = designToolRouter?.routeData?.product?.series?.value;
  const productCategory = designToolRouter?.routeData?.product?.category?.value;
  const seriesName = `${productSeries ?? ''} ${productCategory ?? ''}`.trim();
  const interiorImageUrl = viewModel?.interiorImage;
  const exteriorImageUrl = viewModel?.exteriorImage;
  const selections = viewModel?.selectedOptions;
  const showDesign =
    seriesName.length > 0 || interiorImageUrl || exteriorImageUrl || selections?.length > 0;
  const leftBarTheme = getLeftBarTheme().aw.classes;
  const widthDimension = getEnum<string>(props?.fields?.width);
  const headlineText = props?.fields?.headlineText?.value ?? '';
  const headlineLevel = getEnum<string>(props?.fields.headlineLevel);
  const richTextContent = props?.fields?.body?.value ?? '';
  const containerWidth = props?.fields?.edgeToEdgeContainer?.value === true ? 'full' : 'lg';
  const displayImage = props?.fields?.primaryImage?.value?.src;

  if (showDesign) {
    return (
      <div className="py-s">
        <div className="body-copy -mt-xxs mb-s text-body font-regular text-dark-gray">
          <div>
            <div
              className={classNames(
                richTextContent && 'py-s',
                containerWidth === 'full' && headlineText && 'px-m',
                widthDimension === 'half' && headlineText && 'px-m',
                widthDimension === 'one-third' && headlineText && 'px-m'
              )}
            >
              <Headline defaultTag={headlineLevel} {...props} />
              <RichTextWrapper
                classes="-mt-xxs mb-s text-body font-regular text-dark-gray"
                field={props?.fields?.body}
              />
            </div>
            {displayImage && (
              <div className="h-full">
                <MediaPrimary
                  {...props}
                  imageLayout="responsive"
                  additionalDesktopClasses="w-full h-full"
                  additionalMobileClasses="max-ml:h-[376px]"
                />
              </div>
            )}
            <div className={theme.designSummary.content}>
              <h3 className={theme.designSummary.header}>{seriesName}</h3>
              {(interiorImageUrl || exteriorImageUrl) && (
                <div className={theme.designSummary.imagesOuterContainer}>
                  {interiorImageUrl && (
                    <div className={theme.designSummary.imageWrapper}>
                      <img
                        className={theme.designSummary.image}
                        src={interiorImageUrl.src}
                        alt={interiorImageUrl.alt}
                        loading="lazy"
                      />
                      <p className={theme.designSummary.imageDescription}>Interior</p>
                    </div>
                  )}
                  {exteriorImageUrl && (
                    <div className={theme.designSummary.imageWrapper}>
                      <img
                        className={theme.designSummary.image}
                        src={exteriorImageUrl.src}
                        alt={exteriorImageUrl.alt}
                        loading="lazy"
                      />
                      <p className={theme.designSummary.imageDescription}>Exterior</p>
                    </div>
                  )}
                </div>
              )}
              {selections.length > 0 && (
                <div className={theme?.designSummary?.selections?.container}>
                  <table className={theme?.designSummary?.selections?.table}>
                    <tbody>
                      {selections.map(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (row: any) => (
                          <tr className={theme?.designSummary?.selections?.tr} key={row.title}>
                            <td className={theme?.designSummary?.selections?.tdAsset}>
                              {row.title}
                            </td>
                            <td className={theme?.designSummary?.selections?.tdAssetValue}>
                              {row.value}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <ul className={leftBarTheme.list}>
      <li className={leftBarTheme.item}>
        <p className={leftBarTheme.text}>
          <strong>Energy Efficient</strong> - Andersen Corporation was awarded the U.S.Environmental
          Protection Agency&apos;s{' '}
          <NextLink
            href="/ideas-and-inspiration/why-andersen/energy-efficiency/energy-star/"
            className={leftBarTheme.link}
          >
            ENERGY STAR
          </NextLink>{' '}
          Partner of the Year–Sustained Excellence Award in 2023.
        </p>
      </li>
      <li className={leftBarTheme.item}>
        <p className={leftBarTheme.text}>
          <strong>Environmentally Friendly</strong> - Green Builder Media Readers&apos; Choice 2020,
          Awarded Most Environmentally Friendly 8 of 9 Years
        </p>
      </li>
      <li className={leftBarTheme.item}>
        <p className={leftBarTheme.text}>
          <strong>Peace of Mind</strong> - Our longstanding practice of making products that perform
          year after year allows us to offer some of the best warranties in the industry.
        </p>
      </li>
      <li className={leftBarTheme.item}>
        <p className={leftBarTheme.text}>
          <strong>We Design with Your Needs In Mind</strong> - With a variety of collections and
          customization options, we&apos;ve got reliable products that create the style you&apos;re
          trying to achieve.
        </p>
      </li>
      <li className={leftBarTheme.item}>
        <p className={leftBarTheme.text}>
          <strong>No-Obligation</strong> - A local Andersen Windows representative will provide you
          with a no-obligation quote.
        </p>
      </li>
    </ul>
  );
}
