import { AppPlaceholder, Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { CarouselSlideClient } from './helpers/CarouselSlideClient';
import componentMap from '.sitecore/component-map';

type CarouselSlideProps = ComponentProps & {
  fields: {
    caption: Field<string>;
  };
};

function CarouselSlide_Default(props: CarouselSlideProps): JSX.Element {
  return (
    <CarouselSlideClient
      fields={props.fields}
      placeholder={
        <AppPlaceholder
          name={`slide-${props.params?.DynamicPlaceholderId}`}
          rendering={props.rendering}
          page={props.page}
          componentMap={componentMap}
        />
      }
    />
  );
}

export const Default = withDatasourceCheck(CarouselSlide_Default);
