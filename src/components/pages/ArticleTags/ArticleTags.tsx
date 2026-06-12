'use client';

import { ComponentRendering, LinkField, useSitecore } from '@sitecore-content-sdk/nextjs';
import Component from 'helpers/Component/Component';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { mapSearchResults } from 'lib/graphql/mappers/map-search-results';
import { IntegratedGraphQlResult } from 'lib/graphql/types/integrated-graphql-result';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import { ItemSearchResults } from 'lib/graphql/types/item-search-results';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { ArticleTagsTheme } from './helpers/ArticleTags.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type ArticleTagsProps = ComponentProps & Sitecore.Components.Pages.ArticleTags.ArticleTags;

type Tag = {
  facetId?: string;
  facetUid: string;
  value: string;
  dependsOn?: string;
  dependencyValues?: Tag[];
};

function ArticleTags_Default(props: ArticleTagsProps): JSX.Element | null {
  const { fields } = getComponentServerProps(props.rendering);
  const { themeData } = useTheme(ArticleTagsTheme);
  const { page } = useSitecore();
  const pageItem = page.layout.sitecore.route as Sitecore.Pages.ArticlePage;
  if (!pageItem?.fields) {
    return null;
  }
  const mappedTags: Tag[] = [];
  const articlePublicTags = pageItem.fields
    ?.articlePublicTags as unknown as Sitecore.Data.Search.FacetTag[];
  const facetField = props?.fields?.facetId?.value ?? 'tags';

  // Map the page tags
  const pageFields = pageItem.fields as Record<string, unknown>;
  const fieldMappings =
    fields.children as Sitecore.Components.Pages.ArticleTags.FieldFacetMapping[];

  if (fieldMappings?.length < 1) {
    articlePublicTags?.forEach((tag) => {
      mappedTags.push({ facetUid: facetField, value: tag.fields?.title?.value ?? '' });
    });
  }
  fieldMappings?.forEach((map) => {
    const pageField = getEnum<string>(map.fields?.field);
    if (!pageField || !pageFields.hasOwnProperty(pageField)) {
      return;
    }
    const facetField = pageFields[pageField] as Sitecore.Data.Search.FacetTag[];
    const values = facetField.map((item) => {
      return item.fields?.title?.value;
    });
    const facet = map.fields?.facet as Sitecore.Elements.Search.Facet;
    const facetUid = facet?.fields.uniqueIdentifier.value;
    if (!facetUid || !values) {
      return;
    }
    values.forEach((item) => {
      if (item) {
        mappedTags.push({
          facetUid,
          value: item,
          facetId: facet.id,
          dependsOn: facet.fields.dependsOn?.id,
        });
      }
    });
  });

  mappedTags?.forEach((tag) => {
    if (!tag.dependsOn) {
      return;
    }
    const dependencyValues: Tag[] = [];
    let dependsOn: string | undefined = tag.dependsOn;
    while (dependsOn != undefined) {
      const dependency = mappedTags.find((_) => _.facetId && _.facetId == dependsOn);
      if (!dependency) {
        return;
      }
      dependencyValues.push({ facetUid: dependency.facetUid, value: dependency.value });
      dependsOn = dependency.dependsOn;
    }
    tag.dependencyValues = dependencyValues;
  });

  if (mappedTags?.length < 1) {
    return null;
  }

  const linkField = fields?.tagsLink as LinkField;
  return (
    <Component variant="lg" dataComponent="pages/articletags" {...props} fields={fields}>
      <div className={themeData.classes.tagsWrapper}>
        {mappedTags?.map((tag) => {
          const params = [`f:${tag.facetUid}=[${tag.value}]`];
          tag.dependencyValues?.forEach((_) => params.push(`f:${_.facetUid}=[${_.value}]`));
          return (
            <>
              {linkField?.value?.href && (
                <a href={`${linkField?.value?.href}#${params.join('&')}`} key={tag.facetUid}>
                  <div className={themeData.classes.tag}>{tag.value}</div>{' '}
                </a>
              )}
              {!linkField?.value?.href && (
                <div key={tag.facetUid} className={themeData.classes.tag}>
                  {tag.value}
                </div>
              )}
            </>
          );
        })}
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(ArticleTags_Default);

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
    fields: ItemFieldResult[];
    children: ItemSearchResults<{
      fields: ItemFieldResult[];
    }>;
  };
}>;

function getComponentServerProps(rendering: ComponentRendering): {
  fields?: ArticleTagsProps['fields'];
} {
  if (rendering.fields === undefined || !('data' in rendering.fields)) {
    return {};
  }

  const fields = rendering.fields as unknown as IntegratedGraphQl;

  const result = {
    fields: {
      ...mapItemFieldResultsToObject(fields.data.item.fields),
      children: mapSearchResults(fields.data.item.children, (child) => {
        return {
          fields: {
            ...mapItemFieldResultsToObject(child.fields),
          },
        };
      }),
    },
  };
  return result;
}
