import config from 'aw.config.server';
import { AWSitecoreClient } from 'lib/sitecore-client';

/**
 * Shape returned for each resolved AW_SwatchCollection. Intentionally mirrors
 * the layout-service "resolved" wrapper shape so the existing
 * `ProductCompareChart` renderer can consume it without changes:
 *
 *   {
 *     id,
 *     fields: {
 *       swatchCollectionName: { value },
 *       swatchCollectionDescription: { value },
 *       swatchCollectionFooterCopy: { value },
 *       swatches: [
 *         { id, name, fields: { swatchName:{value}, swatchDescription:{value}, swatchImage:{src,alt,width,height} } }
 *       ]
 *     }
 *   }
 */
export type ResolvedSwatchItem = {
  id: string;
  name?: string;
  fields: {
    swatchName?: { value: string };
    swatchDescription?: { value: string };
    swatchImage?: { src: string; alt: string; width: number | string; height: number | string };
  };
};

export type ResolvedSwatchCollection = {
  id: string;
  fields: {
    swatchCollectionName?: { value: string };
    swatchCollectionDescription?: { value: string };
    swatchCollectionFooterCopy?: { value: string };
    swatches: ResolvedSwatchItem[];
  };
};

interface SwatchCollectionQueryResult {
  id: string;
  name?: string;
  swatchCollectionName?: { value: string };
  swatchCollectionDescription?: { value: string };
  swatchCollectionFooterCopy?: { value: string };
  swatches?: {
    targetItems?: Array<{
      id: string;
      name?: string;
      swatchName?: { value: string };
      swatchDescription?: { value: string };
      swatchImage?: { src: string; alt: string; width: number | string; height: number | string };
    }>;
  };
}

export interface SwatchesServiceConfig {
  sitecoreClient: AWSitecoreClient;
}

/**
 * Resolves AW_SwatchCollection items (and their nested AW_Swatch children) by id
 * using a single batched GraphQL `item()` query. Works around Sitecore layout
 * service's single-hop resolution limit for per-product swatch references in
 * the Product Compare Chart.
 */
export class SwatchesService {
  // Sitecore's GraphQL endpoint enforces a max query-depth (25), and it sums
  // the depth across all aliased selections. Each `item(...) { ... }` alias here
  // adds ~5 levels (item → swatches → MultilistField → targetItems → AW_Swatch
  // → swatchImage → src), so we must keep the per-request alias count small.
  // Matches the pattern in `ItemBatch`: lower in preview (heavier resolver),
  // higher in published.
  private static readonly BATCH_SIZE = config.app.role === 'preview' ? 3 : 4;

  constructor(public options: SwatchesServiceConfig) {}

  async resolve(
    ids: string[],
    language = 'en'
  ): Promise<Record<string, ResolvedSwatchCollection | null>> {
    const result: Record<string, ResolvedSwatchCollection | null> = {};
    const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
    if (uniqueIds.length === 0) {
      return result;
    }

    for (let i = 0; i < uniqueIds.length; i += SwatchesService.BATCH_SIZE) {
      const chunk = uniqueIds.slice(i, i + SwatchesService.BATCH_SIZE);
      const { query, variables } = this.buildQuery(chunk, language);
      const data = await this.options.sitecoreClient.getData<
        Record<string, SwatchCollectionQueryResult | null>
      >(query, variables);

      chunk.forEach((id, idx) => {
        const raw = data?.[`i${idx}`];
        result[id] = raw ? this.mapResult(raw) : null;
      });
    }

    return result;
  }

  private buildQuery(
    ids: string[],
    language: string
  ): { query: string; variables: Record<string, unknown> } {
    const variables: Record<string, unknown> = { language };
    const aliases: string[] = [];
    const params: string[] = ['$language: String!'];

    ids.forEach((id, idx) => {
      const varName = `p${idx}`;
      variables[varName] = id;
      params.push(`$${varName}: String!`);
      aliases.push(
        `i${idx}: item(path: $${varName}, language: $language) { ...SwatchCollectionFields }`
      );
    });

    const query = `query ResolveSwatchCollections(${params.join(', ')}) {
${aliases.join('\n')}
}
fragment SwatchCollectionFields on Item {
  id
  name
  ... on AW_SwatchCollection {
    swatchCollectionName { value }
    swatchCollectionDescription { value }
    swatchCollectionFooterCopy { value }
    swatches {
      ... on MultilistField {
        targetItems {
          id
          name
          ... on AW_Swatch {
            swatchName { value }
            swatchDescription { value }
            swatchImage { src alt width height }
          }
        }
      }
    }
  }
}`;

    return { query, variables };
  }

  private mapResult(raw: SwatchCollectionQueryResult): ResolvedSwatchCollection {
    const swatches: ResolvedSwatchItem[] = (raw.swatches?.targetItems ?? []).map((s) => ({
      id: s.id,
      name: s.name,
      fields: {
        swatchName: s.swatchName,
        swatchDescription: s.swatchDescription,
        swatchImage: s.swatchImage,
      },
    }));

    return {
      id: raw.id,
      fields: {
        swatchCollectionName: raw.swatchCollectionName,
        swatchCollectionDescription: raw.swatchCollectionDescription,
        swatchCollectionFooterCopy: raw.swatchCollectionFooterCopy,
        swatches,
      },
    };
  }
}
