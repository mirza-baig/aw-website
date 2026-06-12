'use client';

import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import ImagePrimary from 'helpers/Media/ImagePrimary';
import SvgIcon, { IconTypes } from 'helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { mapSearchResults } from 'lib/graphql/mappers/map-search-results';
import { IntegratedGraphQlResult } from 'lib/graphql/types/integrated-graphql-result';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import { ItemSearchResults } from 'lib/graphql/types/item-search-results';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { useState } from 'react';

import { CardImageAndProductDetailsTheme } from './helpers/CardImageAndProductDetails.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type ProductLinkProps = Sitecore.Cards.CardImageAndProductDetails.ProductDetailLink & {
  id: string;
};

type CardImageAndProductDetailsProps = ComponentProps &
  Sitecore.Cards.CardImageAndProductDetails.CardImageandProductDetails & {
    fields: {
      children: [ProductLinkProps];
    };
  };

function CardImageAndProductDetails_Default(props: CardImageAndProductDetailsProps) {
  const { fields } = getComponentServerProps(props) as CardImageAndProductDetailsProps;
  const { themeData } = useTheme(CardImageAndProductDetailsTheme);
  const [details, setDetails] = useState(false);

  const linkWrapperClasses =
    'flex w-fit items-center p-2 text-body font-normal hover:underline hover:decoration-primary hover:underline-offset-8 disabled:border-gray disabled:text-gray';
  const svgIconClasses =
    'ml-[10px] text-theme-btn-bg-hover hover:underline hover:decoration-primary hover:underline-offset-8';

  return (
    <Component
      padding="px-0"
      variant="lg"
      dataComponent="card/cardimageandproductdetails"
      {...props}
    >
      <div className={themeData.classes.parentDiv}>
        <ImagePrimary {...props} fields={fields} ratio={'square'} />
        <div className={details ? themeData.classes.darkImageOverlay : 'collapse absolute'}>
          <div className={themeData.classes.groupDiv}>
            <Headline classes={themeData.classes.headline} {...props} fields={fields} />
            <div className="product-links">
              {fields?.children?.map((_item: ProductLinkProps) => {
                const _icon = getEnum<IconTypes>(_item.fields?.productIcon);
                const key = _item.id ?? '';

                return (
                  <div key={key}>
                    {_item.fields?.productLink && (
                      <LinkWrapper
                        field={_item.fields?.productLink}
                        className={linkWrapperClasses}
                        ariaLabel={{ value: 'product icon' }}
                        rel=""
                      >
                        {_item.fields?.productIcon && (
                          <SvgIcon icon={_icon} className={svgIconClasses} />
                        )}
                      </LinkWrapper>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* when button is clicked, change styling on image */}
      {fields?.children?.length > 0 && (
        <div className="col-span-12">
          <button
            className={themeData.classes.detailsButton}
            type="button"
            onClick={() => {
              setDetails(!details);
            }}
          >
            {!details ? 'View Details' : 'Hide Details'}
            <SvgIcon
              icon={!details ? 'smallplus' : 'smallclose'}
              className={themeData.classes.iconClass}
            />
          </button>
        </div>
      )}
    </Component>
  );
}

export const Default = withDatasourceCheck(CardImageAndProductDetails_Default);

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
    id: string;
    fields: ItemFieldResult[];
    children: ItemSearchResults<{
      id: string;
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
      id: fields.data.item.id,
      ...mapItemFieldResultsToObject(fields.data.item.fields),
      children: mapSearchResults(fields.data.item.children, (child) => {
        return {
          id: child.id,
          fields: {
            ...mapItemFieldResultsToObject(child.fields),
          },
        };
      }),
    },
  };
  return result;
}
