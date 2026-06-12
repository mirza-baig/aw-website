'use client';

import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Button from 'helpers/Button/Button';
import { cta1ToButtonProps, cta2ToButtonProps } from 'helpers/Button/Utils';
import ButtonGroup from 'helpers/ButtonGroup/ButtonGroup';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import OrangeTriangle from 'helpers/SvgIcon/icons/icon--orange-triangle';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { mapSearchResults } from 'lib/graphql/mappers/map-search-results';
import { IntegratedGraphQlResult } from 'lib/graphql/types/integrated-graphql-result';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import { ItemSearchResults } from 'lib/graphql/types/item-search-results';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { ListHighlightAndCtaTheme } from './helpers/ListHighlightAndCta.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type ListHighlightAndCtaProps = ComponentProps &
  Sitecore.Components.Listing.ListHighlightAndCta.ListHighlightandCta;

function ListHighlightAndCta_Default(props: ListHighlightAndCtaProps): JSX.Element {
  props = getComponentServerProps(props.rendering);
  const { themeData, themeName } = useTheme(ListHighlightAndCtaTheme());
  const sectionHeadline: Sitecore.FieldSets.Headline = {
    fields: {
      headlineText: props.fields?.sectionHeadline,
      headlineLevel: props.fields?.sectionHeadlineLevel,
    },
  };
  const listItemStyle = props.fields?.listItemStyle?.fields?.Value.value;

  return (
    <Component variant="lg" dataComponent="listing/listhighlightandcta" {...props}>
      <div className={themeData.classes.headlineBorder}>
        <div className="mt-4 flex md:mt-2">
          {themeName === 'aw' && (
            <div className="m-1 mt-px flex">
              <OrangeTriangle></OrangeTriangle>
            </div>
          )}
          <Headline classes={themeData.classes.headlineClass} fields={sectionHeadline.fields} />
        </div>
      </div>

      {/* loop through children */}
      <div className="col-span-12 md:col-span-8">
        {props.fields?.children?.map((_item: ListHighlightAndCtaProps) => {
          if (_item.fields && listItemStyle === 'row-list') {
            _item.fields.cta1Link.value.text =
              _item.fields.headlineText.value !== ''
                ? _item.fields.headlineText.value
                : _item.fields.cta1Link.value.text;
          }
          const variantLinkRightIcon = {
            name: 'Link Right Icon',
            fields: {
              Value: {
                value: 'link-right-icon',
              },
            },
            id: '',
            url: '',
          };

          return (
            <div key={_item.id} className={themeData.classes.listItemContainer}>
              <div className={themeData.classes.listItemHeadlineBorder}>
                <div>
                  {listItemStyle !== 'row-list' && (
                    <>
                      <Headline
                        classes={themeData.classes.contentClasses.listItemHeadlineClass}
                        fields={_item.fields}
                      />
                      <BodyCopy
                        fields={_item.fields}
                        classes={themeData.classes.contentClasses.body}
                      />
                    </>
                  )}

                  {listItemStyle === 'row-list' ? (
                    <Button
                      field={_item.fields?.cta1Link}
                      variant={variantLinkRightIcon}
                      icon={_item.fields?.cta1Icon}
                      classes={(themeData.classes.buttonGroupClassRightIcon, 'font-sans text-s')}
                    ></Button>
                  ) : (
                    <ButtonGroup
                      cta1={cta1ToButtonProps(
                        _item,
                        themeData.classes.buttonGroupClass.cta1Classes
                      )}
                      cta2={cta2ToButtonProps(
                        _item,
                        themeData.classes.buttonGroupClass.cta2Classes
                      )}
                      wrapperClasses={themeData.classes.buttonGroupClass.wrapper}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(ListHighlightAndCta_Default);

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
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
      ...mapItemFieldResultsToObject(fields.data.item.fields),
      children: mapSearchResults(fields.data.item.children, (child) => ({
        id: child.id,
        fields: {
          ...mapItemFieldResultsToObject(child.fields),
        },
      })),
    },
  };
  return result;
}
