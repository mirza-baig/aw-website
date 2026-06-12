import { ComponentRendering, Item, LayoutServiceData } from '@sitecore-content-sdk/nextjs';
import chalk from 'chalk';
import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';

import { FormFieldModuleFactory } from './FormFieldModule';
import { FormFieldProps, FormFieldPropsError, FormFieldPropsFetchFunction } from './FormFieldProps';

/**
 * Shape of form field props storage
 */
export type FormFieldPropsCollection = {
  [fieldId: string]: unknown | FormFieldPropsError;
};

type FetchFormFieldPropsArguments<NextContext> = {
  rendering: ComponentRendering;
  layoutData: LayoutServiceData;
  context: NextContext;
  formFieldModule: FormFieldModuleFactory;
};

type FormFieldPropsRequest<NextContext> = {
  fetch: FormFieldPropsFetchFunction<NextContext>;
  field: FormFieldProps;
  layoutData: LayoutServiceData;
  rendering: ComponentRendering;
  context: NextContext;
};

type FetchFunctionFactory<NextContext> = (
  fieldName: string
) => Promise<FormFieldPropsFetchFunction<NextContext> | undefined>;

export class FormFieldPropsService {
  /**
   * SSR mode
   * Fetch field props using getServerSideProps function
   * @param {FetchFormFieldPropsArguments<GetServerSidePropsContext>} params fetch params
   * @returns {Promise<FormFieldPropsCollection>} props
   */
  async fetchServerSideFormFieldProps(
    params: FetchFormFieldPropsArguments<GetServerSidePropsContext>
  ): Promise<FormFieldPropsCollection> {
    const { formFieldModule, rendering, layoutData, context } = params;

    const fetchFunctionFactory = async (fieldName: string) => {
      const formModule = await formFieldModule(fieldName);

      return formModule?.getServerSideProps;
    };
    return this.fetchFormFieldProps<GetServerSidePropsContext>(
      fetchFunctionFactory,
      rendering,
      layoutData,
      context
    );
  }

  /**
   * SSG mode
   * Fetch field props using getStaticProps function
   * @param {FetchFieldtPropsArguments<GetStaticPropsContext>} params fetch arguments
   * @returns {Promise<FormFieldPropsCollection>} props
   */
  async fetchStaticFormFieldProps(
    params: FetchFormFieldPropsArguments<GetStaticPropsContext>
  ): Promise<FormFieldPropsCollection> {
    const { formFieldModule, rendering, layoutData, context } = params;

    const fetchFunctionFactory = async (fieldName: string) => {
      const formModule = await formFieldModule(fieldName);

      return formModule?.getStaticProps;
    };

    return this.fetchFormFieldProps<GetStaticPropsContext>(
      fetchFunctionFactory,
      rendering,
      layoutData,
      context
    );
  }

  /**
   * Traverse Form data tree and call side effects on field level.
   * Side effect function can be: getStaticProps (SSG) or getServerSideProps (SSR)
   * @param {FetchFunctionFactory<NextContext>} fetchFunctionFactory fetch function factory
   * @param {FormData} formData form data
   * @param {NextContext} context next context
   * @returns {Promise<FormFieldPropsCollection>} field props
   */
  protected async fetchFormFieldProps<NextContext>(
    fetchFunctionFactory: FetchFunctionFactory<NextContext>,
    rendering: ComponentRendering,
    layoutData: LayoutServiceData,
    context: NextContext
  ): Promise<FormFieldPropsCollection> {
    // Array of side effect functions
    const requests = await this.collectRequests({
      pages: rendering.fields?.children as Item[],
      fetchFunctionFactory,
      rendering,
      layoutData,
      context,
    });

    return await this.execRequests(requests);
  }

  /**
   * Go through form data, check all fields using templateName, which should make some side effects.
   * Write result in requests variable
   * @param {Object} params params
   * @param {Item[]} [params.pages]
   * @param {FetchFunctionFactory<NextContext>} params.fetchFunctionFactory
   * @param {LayoutServiceData} params.layoutData
   * @param {NextContext} params.context
   * @param {FormFieldPropsRequest<NextContext>[]} params.requests
   * @returns {FormFieldPropsRequest<NextContext>[]} array of requests
   */
  protected async collectRequests<NextContext>(params: {
    pages?: Item[];
    fetchFunctionFactory: FetchFunctionFactory<NextContext>;
    rendering: ComponentRendering;
    layoutData: LayoutServiceData;
    context: NextContext;
    requests?: FormFieldPropsRequest<NextContext>[];
  }): Promise<FormFieldPropsRequest<NextContext>[]> {
    const { pages = [], fetchFunctionFactory, rendering, layoutData, context } = params;

    // Will be called on first round
    params.requests ??= [];

    const fields = this.flatFormFields(pages);

    const actions = fields.map(async (field) => {
      const templateName = field.templateName?.replaceAll(' ', '');
      if (!templateName) {
        return;
      }

      const fetchFunc = await fetchFunctionFactory(templateName);

      if (fetchFunc) {
        if (params.requests) {
          params.requests.push({
            fetch: fetchFunc,
            field,
            rendering,
            layoutData,
            context,
          });
        }
      }
    });

    await Promise.all(actions);

    return params.requests;
  }

  /**
   * Execute request for component props
   * @param {ComponentPropsRequest<NextContext>[]} requests requests
   * @returns {Promise<ComponentPropsCollection>} requests result
   */
  protected async execRequests<NextContext>(
    requests: FormFieldPropsRequest<NextContext>[]
  ): Promise<FormFieldPropsCollection> {
    const formFieldProps: FormFieldPropsCollection = {};

    const promises = requests.map((req) => {
      const { id } = req.field;

      if (!id) {
        console.log(
          `Form field ${req.field.templateName} doesn't have id, can't store data for this field`
        );
        return;
      }

      return req
        .fetch(req.field, req.rendering, req.layoutData, req.context)
        .then((result) => {
          // Set component specific data in componentProps store
          formFieldProps[id] = result;
        })
        .catch((error) => {
          const errLog = `Error during preload data for form field ${
            req.field.templateName
          } (${id}): ${error.message ?? error}`;

          console.error(chalk.red(errLog));

          formFieldProps[id] = {
            error: error.message ?? errLog,
            fieldName: req.field.templateName,
          };
        });
    });

    await Promise.all(promises);

    return formFieldProps;
  }

  /**
   * Take fields from all pages and returns a flat array of fields.
   *
   * @param {Item[]} pages the form pages
   * @returns {FormFieldProps[]} fields
   */
  protected flatFormFields(pages: Item[]): FormFieldProps[] {
    const allFields: FormFieldProps[] = [];

    pages.forEach((page: Item) => {
      const fields = page.fields?.children as FormFieldProps[];
      allFields.push(...fields);
    });

    return allFields;
  }
}
