import {
  ComponentFields,
  ComponentRendering,
  NextjsContentSdkComponent,
  PlaceholdersData,
} from '@sitecore-content-sdk/nextjs';
import chalk from 'chalk';
import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';

import { getErrorMessage } from './error-utils/get-error-message';

export type NextContext = GetServerSidePropsContext | GetStaticPropsContext;

/**
 * Type of side effect function which could be invoked on component level (getStaticProps/getServerSideProps)
 */
export type PropsFetchFunction<
  NextContext,
  FetchedProps,
  TRenderingFields = ComponentFields,
  TSourceFields = ComponentFields,
> = (
  rendering: ComponentRendering<TRenderingFields>,
  source: ComponentRendering<TSourceFields>,
  context: NextContext
) => Promise<FetchedProps | undefined>;

/**
 * Shape of getServerSideProps function on component level
 */
export type GetServerSideNestedComponentProps<
  TFetchedProps,
  TRenderingFields = ComponentFields,
  TSourceFields = ComponentFields,
> = PropsFetchFunction<
  GetServerSidePropsContext,
  TFetchedProps | undefined,
  TRenderingFields,
  TSourceFields
>;

/**
 * Shape of getStaticProps function on component level
 */
export type GetStaticNestedComponentProps<
  TFetchedProps,
  TRenderingFields = ComponentFields,
  TSourceFields = ComponentFields,
> = PropsFetchFunction<
  GetStaticPropsContext,
  TFetchedProps | undefined,
  TRenderingFields,
  TSourceFields
>;

export type FetchPropsArguments<NextContext, TSourceFields = ComponentFields> = {
  source: ComponentRendering<TSourceFields>;
  context: NextContext;
  components: Map<string, NextjsContentSdkComponent>;
};

export type PropsRequest<
  NextContext,
  FetchedProps,
  TRenderingFields = ComponentFields,
  TSourceFields = ComponentFields,
> = {
  fetch: PropsFetchFunction<NextContext, FetchedProps, TRenderingFields, TSourceFields>;
  source: ComponentRendering<TSourceFields>;
  rendering: ComponentRendering<TRenderingFields>;
  context: NextContext;
};

type FetchFunctionFactory<
  NextContext,
  FetchedProps,
  TRenderingFields = ComponentFields,
  TSourceFields = ComponentFields,
> = (
  componentName: string
) => Promise<
  PropsFetchFunction<NextContext, FetchedProps, TRenderingFields, TSourceFields> | undefined
>;

export class NestedComponentPropsService<TProps, TFetchResult, TSourceFields = ComponentFields> {
  /**
   * SSR mode
   * Fetch tab props using getServerSideProps function
   * @param {TProps} initialValue fetch params
   * @param {(result: TFetchResult, props: TProps) => void} callback callback function for collecting fetched results into props
   * @param {string} staticKey method name for getting server side props
   * @param {string} serverKey method name for getting static props
   * @param {boolean} recurse recurse into placeholders of nested components
   */
  constructor(
    protected initialValue: TProps,
    protected callback: (result: TFetchResult, props: TProps) => void,
    protected staticKey: string,
    protected serverKey: string,
    protected recurse: boolean = true
  ) {}

  /**
   * SSR mode
   * Fetch tab props using getServerSideProps function
   * @param {FetchTabPropsArguments<GetServerSidePropsContext>} params fetch params
   * @returns {Promise<ComponentPropsCollection>} props
   */
  async fetchServerSideProps(
    params: FetchPropsArguments<GetServerSidePropsContext, TSourceFields>
  ): Promise<TProps> {
    const { components, source, context } = params;

    const fetchFunctionFactory: FetchFunctionFactory<
      GetServerSidePropsContext,
      TFetchResult | undefined,
      ComponentFields,
      TSourceFields
    > = async (componentName: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const component = components.get(componentName) as any;
      if (!component) {
        return undefined;
      }

      return component[this.staticKey] as unknown as
        | PropsFetchFunction<
            GetServerSidePropsContext,
            TFetchResult | undefined,
            ComponentFields,
            TSourceFields
          >
        | undefined;
    };

    return this.fetchProps<GetServerSidePropsContext>(fetchFunctionFactory, source, context);
  }

  /**
   * SSG mode
   * Fetch component props using getStaticProps function
   * @param {FetchPropsArguments<GetStaticPropsContext>} params fetch arguments
   * @returns {Promise<TProps>} props
   */
  async fetchStaticProps(
    params: FetchPropsArguments<GetStaticPropsContext, TSourceFields>
  ): Promise<TProps> {
    const { components, source, context } = params;

    const fetchFunctionFactory: FetchFunctionFactory<
      GetStaticPropsContext,
      TFetchResult | undefined,
      ComponentFields,
      TSourceFields
    > = async (componentName: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const component = components.get(componentName) as any;
      if (!component) {
        return undefined;
      }

      return component[this.staticKey] as unknown as
        | PropsFetchFunction<
            GetStaticPropsContext,
            TFetchResult | undefined,
            ComponentFields,
            TSourceFields
          >
        | undefined;
    };

    return this.fetchProps<GetStaticPropsContext>(fetchFunctionFactory, source, context);
  }

  /**
   * Traverse Layout Service data tree and call side effects on component level.
   * Side effect function can be: getStaticProps (SSG) or getServerSideProps (SSR)
   * @param {FetchFunctionFactory<NextContext>} fetchFunctionFactory fetch function factory
   * @param {ConponentRendering} source parent component
   * @param {NextContext} context next context
   * @returns {Promise<ComponentPropsCollection>} component props
   */
  protected async fetchProps<NextContext>(
    fetchFunctionFactory: FetchFunctionFactory<
      NextContext,
      TFetchResult | undefined,
      ComponentFields,
      TSourceFields
    >,
    source: ComponentRendering<TSourceFields>,
    context: NextContext
  ): Promise<TProps> {
    // Array of side effect functions
    const requests = await this.collectRequests({
      placeholders: source?.placeholders,
      fetchFunctionFactory,
      source,
      context,
    });

    return await this.execRequests(requests);
  }

  /**
   * Go through layout service data, check all renderings using displayName, which should make some side effects.
   * Write result in requests variable
   * @param {object} params params
   * @param {PlaceholdersData} [params.placeholders]
   * @param {FetchFunctionFactory<NextContext>} params.fetchFunctionFactory
   * @param {ComponentRendering} params.source
   * @param {NextContext} params.context
   * @param {TabPropsRequest<NextContext>[]} params.requests
   * @returns {TabPropsRequest<NextContext>[]} array of requests
   */
  protected async collectRequests<NextContext>(params: {
    placeholders?: PlaceholdersData;
    fetchFunctionFactory: FetchFunctionFactory<
      NextContext,
      TFetchResult | undefined,
      ComponentFields,
      TSourceFields
    >;
    source: ComponentRendering<TSourceFields>;
    context: NextContext;
  }): Promise<
    PropsRequest<NextContext, TFetchResult | undefined, ComponentFields, TSourceFields>[]
  > {
    const { placeholders = {}, fetchFunctionFactory, source, context } = params;

    const renderings = this.flatRenderings(placeholders);

    const actions = renderings.map(async (r) => {
      const result: PropsRequest<
        NextContext,
        TFetchResult | undefined,
        ComponentFields,
        TSourceFields
      >[] = [];
      const fetchFunc = await fetchFunctionFactory(r.componentName);

      if (fetchFunc) {
        result.push({
          fetch: fetchFunc,
          rendering: r,
          source,
          context,
        });
      }

      // If placeholders exist in current rendering
      if (r.placeholders && this.recurse) {
        const results = await this.collectRequests({
          ...params,
          placeholders: r.placeholders,
        });
        result.push(...results);
      }

      return result;
    });

    const results = await Promise.all(actions);

    return results.flat();
  }

  /**
   * Execute request for component props
   * @param {TabPropsRequest<NextContext>[]} requests requests
   * @returns {Promise<ComponentPropsCollection>} requests result
   */
  protected async execRequests<NextContext>(
    requests: PropsRequest<NextContext, TFetchResult | undefined, ComponentFields, TSourceFields>[]
  ): Promise<TProps> {
    const promises = requests.map(async (req) => {
      const { uid } = req.rendering;

      try {
        return await req.fetch(req.rendering, req.source, req.context);
      } catch (error: unknown) {
        const errLog = `Error during preload data for component ${
          req.rendering.componentName
        } (${uid}): ${getErrorMessage(error)}`;

        console.error(chalk.red(errLog));
      }
      return undefined;
    });

    const results = await Promise.all(promises);

    const props = this.initialValue;
    results.forEach((result) => {
      if (result === undefined) {
        return;
      }
      this.callback(result, props);
    });

    return props;
  }

  /**
   * Take renderings from all placeholders and returns a flat array of renderings.
   * @example
   * const placeholders = {
   *    x1: [{ uid: 1 }, { uid: 2 }],
   *    x2: [{ uid: 11 }, { uid: 22 }]
   * }
   *
   * flatRenderings(placeholders);
   *
   * RESULT: [{ uid: 1 }, { uid: 2 }, { uid: 11 }, { uid: 22 }]
   * @param {PlaceholdersData} placeholders placeholders
   * @returns {ComponentRendering[]} renderings
   */
  protected flatRenderings(placeholders: PlaceholdersData): ComponentRendering[] {
    const allComponentRenderings: ComponentRendering[] = [];
    const placeholdersArr = Object.values(placeholders);

    placeholdersArr.forEach((pl) => {
      const renderings = pl as ComponentRendering[];
      allComponentRenderings.push(...renderings);
    });

    return allComponentRenderings;
  }
}
