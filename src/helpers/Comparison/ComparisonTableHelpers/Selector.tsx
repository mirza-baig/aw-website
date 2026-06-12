/***  Disabling no-explicit-any for whole file as this file uses proxy objects for handling fucntionality */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Text } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import SingleButton from 'helpers/SingleButton/SingleButton';
import { isSvgUrl } from 'lib/utils/url-utils/is-svg-url';
import Image from 'next/image';
import React, { Dispatch, JSX, SetStateAction, useEffect, useRef, useState } from 'react';

import { ComparisonObjectProps, SeriesTitle } from './ComparisonTable.Types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type CommonSelectorProps = {
  tableConfiguration: Sitecore.Components.Product.ComparisonTable.ComparisonTableConfiguration;
  toggleSelector: Dispatch<SetStateAction<boolean>>;
  isProductSelector?: boolean;
  isImageVisible?: boolean;
};

type ProductSelectorProps = {
  productsStylesList?: [];
  productStyleIndexSetter?: Dispatch<SetStateAction<number>>;
  selectedProductStyleIndex?: number;
};

type SeriesSelectorProps = {
  originalComparisonObject?: ComparisonObjectProps;
  currentSelectedSeries?: Array<SeriesTitle | undefined>;
  comparisonObjectSetter?: Dispatch<SetStateAction<ComparisonObjectProps>>;
};

export const Selector = (
  props: SeriesSelectorProps & ProductSelectorProps & CommonSelectorProps
) => {
  const seriesSelectorRef = useRef<HTMLDivElement>(null);

  let selectedSeriesIndices: Array<number> = [];

  const {
    isProductSelector,
    tableConfiguration,
    toggleSelector,
    productsStylesList,
    selectedProductStyleIndex,
    productStyleIndexSetter,
    originalComparisonObject,
    currentSelectedSeries,
    comparisonObjectSetter,
    isImageVisible,
  } = props;

  const [localSelectedProductStyleIndex, setLocalSelectedProductStyleIndex] = useState<number>(
    selectedProductStyleIndex ?? 0
  );
  const compareButtonProps = {
    cta1Icon: {
      id: 'f8ad4587-51a4-4e66-8eec-b448f78b4cb2',
      url: 'http://localhost/sitecore/login/sitecore/system/Settings/Foundation/EnterpriseWeb/Enums/Icons/Augmented-Reality',
      name: 'Augmented Reality',
      displayName: 'Augmented Reality',
      fields: {
        Value: {
          value: 'arrow',
        },
      },
      templateId: 'd2923fee-da4e-49be-830c-e27764dfa269',
      templateName: 'Enum',
    },
    cta1Link: {
      value: {
        href: '#',
        text: isProductSelector
          ? tableConfiguration.fields?.changeProductStyleModalCTAText.value
          : tableConfiguration.fields?.buttonCardModalCTAText.value,
        anchor: '',
        linktype: 'internal',
        class: '',
        title: '',
        target: '',
        querystring: '',
        id: '{BD66C47E-42B0-4EDD-BAD3-4BC981C05E5D}',
      },
    },
    cta1Style: {
      id: '8aedd89c-e161-41d4-b773-6a6097a19372',
      url: 'http://localhost/sitecore/login/sitecore/system/Settings/Foundation/EnterpriseWeb/Enums/CTA-Styles/Secondary',
      name: 'Secondary',
      displayName: 'Primary',
      fields: {
        Value: {
          value: 'primary',
        },
      },
      templateId: 'd2923fee-da4e-49be-830c-e27764dfa269',
      templateName: 'Enum',
    },
    cta1ModalLinkText: {
      value: '',
    },
    cta1AriaLabel: {
      value: '',
    },
  };

  const updateComparisonObject = () => {
    const _objectToModify: any = originalComparisonObject;

    const configureSeries = (curatedObject: any): any => {
      return curatedObject.filter((_obj: any, index: number) =>
        selectedSeriesIndices.includes(index)
      );
    };

    for (const property of Object.keys(_objectToModify)) {
      if (property === 'seriesTitles') {
        _objectToModify.seriesTitles = _objectToModify.seriesTitles.filter((_obj: SeriesTitle) =>
          selectedSeriesIndices.includes(_obj.seriesIndex)
        );
      } else {
        _objectToModify[property as keyof ComparisonObjectProps] = configureSeries(
          _objectToModify[property as keyof ComparisonObjectProps].swatches ??
            _objectToModify[property as keyof ComparisonObjectProps]
        );
      }
    }

    comparisonObjectSetter?.(_objectToModify);
  };

  const updateSeriesToCompare = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();

    if (isProductSelector) {
      productStyleIndexSetter?.(localSelectedProductStyleIndex);
      toggleSelector(false);
    } else {
      const errorElement = seriesSelectorRef.current?.querySelector('#seriesSelectorError');
      if (selectedSeriesIndices.length === 0) {
        if (errorElement?.classList.contains('hidden')) {
          errorElement.classList.remove('hidden');
          errorElement.classList.add('block');
        }
      } else {
        if (errorElement?.classList.contains('block')) {
          errorElement.classList.remove('block');
          errorElement.classList.add('hidden');
        }

        updateComparisonObject();

        toggleSelector(false);
      }
    }
  };

  const SeriesCard = (props: SeriesTitle): JSX.Element => {
    const { seriesIndex, title, description, image } = props;

    const [isSelected, setIsSelected] = useState(
      isProductSelector
        ? localSelectedProductStyleIndex === seriesIndex
        : Boolean(currentSelectedSeries?.find((series) => series?.seriesIndex === seriesIndex))
    );

    useEffect(() => {
      if (isProductSelector && isSelected) {
        setLocalSelectedProductStyleIndex(seriesIndex);
      } else {
        if (isSelected) {
          selectedSeriesIndices.push(seriesIndex);
        } else {
          selectedSeriesIndices = selectedSeriesIndices.filter(
            (seriesIndexToRemove) => seriesIndexToRemove !== seriesIndex
          );
        }

        selectedSeriesIndices.sort();
      }
    }, [isSelected, seriesIndex]);

    return (
      <div
        tabIndex={0}
        className={classNames(
          'relative flex min-h-[80px] w-full basis-[25%] cursor-pointer items-center rounded-[10px] border bg-light-gray p-xxs text-center ml:min-h-[255px] ml:min-w-[288px] ml:flex-col ml:justify-center ml:px-0 ml:py-ml',
          isProductSelector ? 'ml:min-h-[255px] ml:min-w-[288px]' : 'ml:min-h-[64px]',
          isSelected
            ? 'border-[#00000000]! before:absolute before:top-0 before:left-0 before:h-full before:w-full before:rounded-[10px] before:border-4 before:border-primary before:content-[""] ml:before:border-[6px]'
            : 'border-gray'
        )}
        onClick={() => setIsSelected(isProductSelector ? true : !isSelected)}
      >
        {isImageVisible && image?.src && (
          <div className="relative mr-s h-[64px] w-[64px] ml:mr-0 ml:mb-m ml:h-[118px] ml:w-[118px]">
            <Image
              src={image.src}
              layout="fill"
              alt={image?.alt as string}
              unoptimized={isSvgUrl(image.src)}
            />
          </div>
        )}
        <div
          className={classNames(
            'flex w-full flex-col ml:mb-xxs ml:items-center',
            isImageVisible && image?.src ? 'items-start' : 'items-center'
          )}
        >
          <h3 className="font-sans text-base font-heavy ml:text-xs">{title}</h3>
          {description && (
            <p
              className={classNames(
                'text-body ml:px-xxs',
                isImageVisible && image?.src && 'text-left ml:text-center'
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-center px-m ml:items-center" ref={seriesSelectorRef}>
      <Text
        className="font-sans text-sm-xs font-heavy ml:text-xs"
        tag="h2"
        field={
          isProductSelector
            ? tableConfiguration.fields?.changeProductStyleModalTitle
            : tableConfiguration.fields?.buttonCardModalTitle
        }
      />
      {/* Series cards */}
      <div className="no-scrollbar mt-l flex flex-col items-stretch justify-center gap-y-m gap-x-s overflow-y-scroll pb-[140px] ml:max-h-[750px] ml:flex-row ml:flex-wrap ml:pb-[40px]">
        {isProductSelector
          ? productsStylesList?.map((productItem: any, index) => {
              return (
                productItem && (
                  <SeriesCard
                    seriesIndex={index}
                    key={index}
                    image={productItem.productImage}
                    title={productItem.productTitle}
                    url={{ value: {} }}
                  />
                )
              );
            })
          : originalComparisonObject?.seriesTitles.map((seriesItem) => {
              return seriesItem && <SeriesCard {...seriesItem} />;
            })}
      </div>
      {/* Compare button */}
      <div
        tabIndex={0}
        onClick={(e) => updateSeriesToCompare(e)}
        className="fixed bottom-0 left-0 right-0 flex w-full flex-col items-center justify-center border-t border-gray bg-white pt-s shadow-[0px_-1px_4px_rgba(0,0,0,0.12)] ml:sticky ml:bottom-0 ml:border-none ml:shadow-none"
      >
        <SingleButton fields={compareButtonProps} />
        <span
          className="mb-[40px] hidden text-center text-[12px] leading-[22px] text-[#F14343] ml:text-body"
          id="seriesSelectorError"
        >
          {tableConfiguration.fields?.buttonCardModalNoSelectionErrorMessage.value}
        </span>
      </div>
    </div>
  );
};
