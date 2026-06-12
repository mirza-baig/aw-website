import {
  buildDateSortCriterion,
  buildFieldSortCriterion,
  buildRelevanceSortCriterion,
  buildSearchEngine,
  FacetOptions,
  FacetSortCriterion,
  // getOrganizationEndpoints,
  loadFieldActions,
  SortCriterion,
  SortOrder,
} from '@coveo/headless';
import { XupDynamicResultItem } from 'components/listing/XupCardCollectionDynamic/helpers/XupCardCollectionDynamic.Template.helper';
import { EnumField, getEnum } from 'lib/utils/get-enum';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';

import { currentAccessToken, renewAccessToken } from './access-token';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export const mapFacetOptions = (facet: Sitecore.Elements.Search.Facet): FacetOptions => {
  const field = getEnum<string>(facet?.fields.facetField) ?? '';
  const facetId = facet?.fields.uniqueIdentifier?.value || '';
  const sortCriteria =
    getEnum<FacetSortCriterion>(facet?.fields.sortCriteria as EnumField<FacetSortCriterion>) ??
    'automatic';
  const result = {
    field: field,
    facetId: facetId,
    sortCriteria: sortCriteria,
    numberOfValues: facet?.fields.numberOfValues.value || 8,
  };

  return result;
};

type SortType = 'relevancy' | 'date' | 'field';
type SortDirection = 'ascending' | 'descending';

// function to get the intitial value of sorting critarion based on layout service response
export const getInitialCriterion = (
  sortTypeField: EnumField<SortType>,
  sortDirectionField: EnumField<SortDirection>,
  sortFieldField: EnumField<string>
): SortCriterion => {
  const sortType = getEnum<SortType>(sortTypeField) ?? 'relevancy';
  const sortDirection = getEnum<SortDirection>(sortDirectionField) ?? 'descending';
  const sortField = getEnum<string>(sortFieldField) ?? '';

  let sortCriterion: SortCriterion;
  switch (sortType) {
    case 'relevancy':
      sortCriterion = buildRelevanceSortCriterion();
      break;
    case 'date':
      sortCriterion = buildDateSortCriterion(
        sortDirection === 'ascending' ? SortOrder.Ascending : SortOrder.Descending
      );
      break;
    case 'field':
      sortCriterion = buildFieldSortCriterion(
        sortField,
        sortDirection === 'ascending' ? SortOrder.Ascending : SortOrder.Descending
      );
      break;
    default:
      sortCriterion = buildRelevanceSortCriterion();
  }
  return sortCriterion;
};

export const buildEngineAsync = async (organizationId: string) => {
  if (organizationId) {
    const accessToken = await currentAccessToken(organizationId);
    if (accessToken) {
      const engine = buildEngine(accessToken, organizationId);

      return engine;
    }
  }
  return null;
};

export const buildEngine = (accessToken: string, organizationId: string) => {
  const engine = buildSearchEngine({
    configuration: {
      organizationId,
      accessToken,
      // organizationEndpoints: getOrganizationEndpoints(organizationId),
      renewAccessToken: async () => await renewAccessToken(organizationId),
      search: {
        preprocessSearchResponseMiddleware: (response) => {
          response.body.results.forEach((result) => {
            // Ideally we would use the siteName and language to do a targetHostName
            // lookup and build the URL here, but, since this happens client side,
            // we do that during indexing and just do the swap here
            if (
              result.raw['sc_url'] &&
              typeof result.raw['sc_url'] == 'string' &&
              result.raw['sc_url'] != result.clickUri
            ) {
              result.clickUri = result.raw['sc_url'];
            }
            return result;
          });
          return response;
        },
      },
      analytics: {
        analyticsMode: 'legacy',
      },
    },
  });

  const FieldActionCreators = loadFieldActions(engine);
  const action = FieldActionCreators.registerFieldsToInclude(['sc_url']);
  engine.dispatch(action);

  return engine;
};

export type LayoutType = 'list' | 'table' | 'grid' | 'mashup' | 'video' | 'video-gallery-dynamic';

export const getFieldsToInclude = (
  resultEntities:
    | Sitecore.Elements.Search.ListResultItem[]
    | Sitecore.Elements.Search.ResultColumn[]
    | Sitecore.Elements.Search.GridResultItem[]
    | Sitecore.Components.Search.PageMashupDynamic.ResultItem[]
    | Sitecore.Elements.Search.VideoResultItem[]
    | XupDynamicResultItem[],
  layoutType: LayoutType
): string[] => {
  const fields: string[] = [];

  switch (layoutType) {
    case 'list':
    case 'grid':
    case 'mashup':
    case 'video':
    case 'video-gallery-dynamic':
      resultEntities?.forEach((item) => {
        for (const searchField in item?.fields) {
          const field = getEnum<string>(item.fields[searchField as keyof unknown]);
          if (field && !fields?.includes(field)) {
            fields.push(field);
          }
        }
      });
      break;
    case 'table':
      resultEntities?.forEach((item) => {
        const field = getEnum<string>(
          (item as Sitecore.Elements.Search.ResultColumn).fields?.field
        );
        if (field) {
          fields.push(field);
        }
      });
      break;
    default:
      break;
  }

  return fields;
};

export type ResultEntities =
  | Sitecore.Elements.Search.ListResultItem[]
  | Sitecore.Elements.Search.GridResultItem[]
  | Sitecore.Components.Search.PageMashupDynamic.ResultItem[]
  | Sitecore.Elements.Search.VideoResultItem[];

export const getResultItemIndex = (
  resultEntities: ResultEntities,
  fieldToMatch: string
): number => {
  if (!resultEntities) {
    return 0;
  }

  for (const [index, resultItem] of resultEntities.entries()) {
    const templateIdsToMatch: string[] = [];

    if (resultItem.fields?.resultType) {
      for (const pageType of resultItem.fields.resultType) {
        const pageTypeIds = getEnum<string>(pageType);
        if (pageTypeIds) {
          templateIdsToMatch.push(...pageTypeIds.split('|'));
        }
      }
    }

    if (templateIdsToMatch.includes(fieldToMatch)) {
      return index;
    }
  }

  return 0;
};

export const checkHostNameInMediaURL = (url: string): string => {
  if (!url.startsWith('https')) {
    return `${process.env.SITECORE_API_HOST}${url}`;
  }

  return url;
};

type CoveoExpressionTokens = {
  currentPage?: string;
};

const CoveoExpressionTokenPlaceholders: CoveoExpressionTokens = {
  currentPage: 'aw_xmc_currentpage',
};

const CoveoExpressionTokenKeys = Object.keys(CoveoExpressionTokenPlaceholders) as Array<
  keyof CoveoExpressionTokens
>;

export const replaceTokenInCoveoExpression = (
  expression: string,
  values: CoveoExpressionTokens
): string => {
  let updatedExpression = expression;

  for (const key of CoveoExpressionTokenKeys) {
    const value = values[key];
    // Replace Token only if the coveo expression has the token
    if (updatedExpression?.includes(key) && !isNullOrWhitespace(value)) {
      updatedExpression = updatedExpression.replace(key, value);
    }
  }

  return updatedExpression;
};
