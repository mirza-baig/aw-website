'use client';

import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import ImagePrimary from 'helpers/Media/ImagePrimary';
import { SliderWrapper } from 'helpers/SliderWrapper/SliderWrapper';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { mapSearchResults } from 'lib/graphql/mappers/map-search-results';
import { IntegratedGraphQlResult } from 'lib/graphql/types/integrated-graphql-result';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import { ItemSearchResults } from 'lib/graphql/types/item-search-results';
import { getEnum } from 'lib/utils/get-enum';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import CalloutItem from './helpers/CalloutItem.helper';
import { ListImageWithCalloutsTheme } from './helpers/ListImageWithCallouts.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type CalloutItemProp = Sitecore.Components.Listing.ListImageWithCallouts.ListImagewithCalloutsItem;

type ListImageWithCalloutsProps = ComponentProps & {
  fields: Sitecore.Components.Listing.ListImageWithCallouts.ListImagewithCallouts['fields'] & {
    children: Array<CalloutItemProp>;
  };
};

const RowPositions: { [callOutIndex: number]: string } = {
  1: 'md:row-start-1!',
  2: 'md:row-start-2!',
  3: 'md:row-start-3!',
};

const ColPositions: { [callOutIndex: number]: string } = {
  1: 'md:col-start-1!',
  3: 'md:col-start-10!',
};

function ListImageWithCallouts_Default(props: ListImageWithCalloutsProps): JSX.Element {
  props = getComponentServerProps(props.rendering) as ListImageWithCalloutsProps;
  const { fields } = props;
  const { themeName, themeData } = useTheme(ListImageWithCalloutsTheme);
  const imagePosition = getEnum(fields?.imgPosition) ?? 'right';

  let componentBackgroundClass = '';

  switch (getEnum(fields?.backgroundColor)) {
    case 'black':
      componentBackgroundClass = 'theme-black';
      break;
    case 'gray':
      componentBackgroundClass = 'theme-gray';
      break;
    case 'white':
      componentBackgroundClass = 'theme-white';
      break;
    case 'primary':
      componentBackgroundClass = 'theme-primary';
      break;
    case 'secondary':
      componentBackgroundClass = 'theme-secondary';
      break;
  }

  const { currentScreenWidth } = useCurrentScreenType();

  // We've to use this check in order remove optional chaining
  if (!fields) {
    return <></>;
  }

  // Callout items code
  const calloutItems = fields.children;

  const getImageColStart = () => {
    return imagePosition === 'right' ? 'md:col-start-7!' : 'md:col-start-1!';
  };

  const sliderSettings = {
    className: componentBackgroundClass,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    enableNumberedPagination: false,
  };

  const renderCallouts = () => {
    if (currentScreenWidth <= getBreakpoint('md')) {
      // Renderings for mobile devices
      return (
        <div
          className={classNames(
            'col-span-12',
            calloutItems.length > 3 ? 'md:col-span-3' : 'md:col-span-5'
          )}
        >
          <SliderWrapper sliderSettings={sliderSettings} theme={themeName}>
            {calloutItems.map((item: CalloutItemProp, index: number) => {
              return (
                <CalloutItem
                  key={`callout-mobile-${item.fields?.headlineText?.value ?? index}`}
                  fields={item.fields}
                  callOutItemClasses={themeData.classes.callOutItemClasses}
                />
              );
            })}
          </SliderWrapper>
        </div>
      );
    } else {
      // Renderings for tablets and large screen devices
      return calloutItems.map(
        (
          item: Sitecore.Components.Listing.ListImageWithCallouts.ListImagewithCalloutsItem,
          index: number
        ) => {
          const colSpanClass = calloutItems.length > 3 ? 'md:col-span-3' : 'md:col-span-5';
          const rowIndex = calloutItems.length === 4 ? (index % 2) + 2 : (index % 3) + 2;
          const rowClass = RowPositions[rowIndex];

          let colStartClass = '';
          if (calloutItems.length > 3) {
            if (calloutItems.length === 4) {
              colStartClass = ColPositions[index > 1 ? 3 : 1];
            } else {
              colStartClass = ColPositions[index > 2 ? 3 : 1];
            }
          } else {
            colStartClass = imagePosition === 'right' ? 'md:col-start-1!' : 'md:col-start-7!';
          }

          return (
            <div
              key={`callout-desktop-${item.fields?.headlineText?.value ?? index}`}
              className={classNames(colSpanClass, rowClass, colStartClass)}
            >
              <CalloutItem
                fields={item.fields}
                callOutItemClasses={themeData.classes.callOutItemClasses}
              />
            </div>
          );
        }
      );
    }
  };

  return (
    <Component
      variant={themeName === 'aw' ? 'full' : 'lg'}
      backgroundVariant={getEnum(fields.backgroundColor)}
      dataComponent="listing/listimagewithcallouts"
      {...props}
    >
      <div className={classNames('col-span-12', themeData.classes.listWrapper)}>
        <div
          className={classNames(
            'grid-rows-auto grid grid-cols-12 gap-y-0 md:max-w-(--breakpoint-lg) md:grid-flow-row-dense md:grid-cols-12 md:gap-s md:px-m lg:mx-auto'
          )}
        >
          <div className="col-span-12">
            <Headline classes={themeData.classes.headline} {...props} />
          </div>
          <div
            className={classNames(
              'col-span-12 row-span-3 md:col-span-6 md:row-start-2!',
              calloutItems.length > 3 ? 'md:col-start-4!' : getImageColStart(),
              themeData.classes.imageContainer
            )}
          >
            <ImagePrimary imageLayout={'intrinsic'} ratio="portrait" focusArea={'top'} {...props} />
          </div>
          {renderCallouts()}
        </div>
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(ListImageWithCallouts_Default);

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
    fields: ItemFieldResult[];
    children: ItemSearchResults<{
      fields: ItemFieldResult[];
    }>;
  };
}>;

function getComponentServerProps(rendering: ComponentRendering) {
  if (rendering.fields === undefined || !('data' in rendering.fields)) {
    return {};
  }

  const fields = rendering.fields as unknown as IntegratedGraphQl;

  const result = {
    fields: {
      ...mapItemFieldResultsToObject(fields.data.item.fields),
      children: mapSearchResults(fields.data.item.children, (child) => ({
        fields: {
          ...mapItemFieldResultsToObject(child.fields),
        },
      })),
    },
  };

  return result;
}
