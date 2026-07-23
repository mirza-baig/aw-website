'use server';

import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import {
  PricePreviewCardClient,
  type PricePreviewCardClientProps,
} from './helpers/PricePreviewCardClient';

type PricePreviewCardProps = ComponentProps & PricePreviewCardClientProps;

async function PricePreviewCard_Default(props: PricePreviewCardProps): Promise<JSX.Element> {
  return <PricePreviewCardClient fields={props.fields} />;
}

export const Default = withDatasourceCheck(PricePreviewCard_Default);
