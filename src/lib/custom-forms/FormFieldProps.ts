import { ComponentRendering, LayoutServiceData } from '@sitecore-content-sdk/nextjs';
import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';

/**
 * Represents the components of a HTML form field
 */
/* We can ignore no-explicit-any warning for this file, used type any as fields props can vary per Form Field Component  */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type FormFieldProps = {
  name: string;
  id: string;
  url: string;
  fields: any;
  templateId: string;
  templateName: string;
  displayName: string;
};

/**
 * Type of side effect function which could be invoked on field level (getStaticProps/getServerSideProps)
 */
export type FormFieldPropsFetchFunction<NextContext, FetchedProps = unknown> = (
  field: FormFieldProps,
  rendering: ComponentRendering,
  layoutData: LayoutServiceData,
  context: NextContext
) => Promise<FetchedProps>;

/**
 * Shape of getServerSideProps function on component level
 */
export type GetServerSideFormFieldProps = FormFieldPropsFetchFunction<GetServerSidePropsContext>;

/**
 * Shape of getStaticProps function on field level
 */
export type GetStaticFormFieldProps = FormFieldPropsFetchFunction<GetStaticPropsContext>;

export type FormFieldPropsError = { error: string; fieldName: string };
