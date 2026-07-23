'use client';

import { ComponentRendering, LinkField } from '@sitecore-content-sdk/nextjs';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import SingleButton from 'helpers/SingleButton/SingleButton';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { mapSearchResults } from 'lib/graphql/mappers/map-search-results';
import { IntegratedGraphQlResult } from 'lib/graphql/types/integrated-graphql-result';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import { ItemSearchResults } from 'lib/graphql/types/item-search-results';
import { getHeadingLevel } from 'lib/utils/get-heading-level';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { HelpfulLinksTheme } from './helpers/HelpfulLinks.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

const defaultLink: LinkField = {
  value: {
    href: '',
  },
};

type HelpfulLinkItem = {
  id?: string;
  fields?: {
    ctaLink?: LinkField;
  };
};

type HelpfulLinksProps = ComponentProps &
  Sitecore.Components.General.HelpfulLinks.HelpfulLinks & {
    fields: Sitecore.Components.General.HelpfulLinks.HelpfulLinks['fields'] & {
      children?: HelpfulLinkItem[];
    };
  };

function HelpfulLinks_Default(props: HelpfulLinksProps): JSX.Element {
  const { fields } = getComponentServerProps(props.rendering);
  const { themeData } = useTheme(HelpfulLinksTheme);
  const defaultTag = 'h2';
  const tag = getHeadingLevel(defaultTag, fields?.headlineLevel);

  return (
    <Component
      variant="full"
      backgroundVariant=""
      sectionWrapperClasses=""
      dataComponent="general/helpfullinks"
      {...props}
      fields={fields}
    >
      <div className={themeData.classes.container}>
        <Headline
          useTag={tag}
          classes={themeData.classes.headlineClass}
          {...props}
          fields={fields}
        />
        <div className={themeData.classes.wrapper}>
          {fields?.children?.map((_item: HelpfulLinkItem, i: number) => {
            return (
              <div key={`button-${_item.id ?? i}`} className="mb-xxs md:mb-0">
                <SingleButton
                  classes={{
                    cta1Classes: 'whitespace-pre-wrap !leading-ml text-text-link',
                  }}
                  fields={{
                    cta1Link: _item?.fields?.ctaLink ?? defaultLink,
                    cta1AriaLabel: {
                      value: '',
                    },
                    cta1ModalLinkText: {
                      value: '',
                    },
                    cta1PersonalizeEventName: {
                      value: '',
                    },
                    cta1Style: {
                      id: '',
                      url: '',
                      name: 'Link',
                      displayName: 'Link',
                      fields: {
                        Value: {
                          value: 'link',
                        },
                      },
                    },
                    cta1Icon: {
                      id: '',
                      url: '',
                      name: 'Arrow',
                      displayName: 'Arrow',
                      fields: {
                        Value: {
                          value: 'arrow',
                        },
                      },
                    },
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(HelpfulLinks_Default);

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
    fields: ItemFieldResult[];
    children: ItemSearchResults<{
      id: string;
      template: { name: string };
      fields: ItemFieldResult[];
    }>;
  };
}>;

function getComponentServerProps(rendering: ComponentRendering): {
  fields?: HelpfulLinksProps['fields'];
} {
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
