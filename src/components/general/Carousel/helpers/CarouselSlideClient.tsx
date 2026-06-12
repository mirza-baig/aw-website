'use client';

import { Field } from '@sitecore-content-sdk/nextjs';
import { Caption } from 'helpers/Caption';
import { useTheme } from 'lib/context/ThemeContext';
import { JSX, ReactNode } from 'react';

import { CarouselTheme } from './Carousel.theme';

type CarouselSlideProps = Readonly<{
  fields: {
    caption: Field<string>;
  };
  placeholder: ReactNode;
}>;

export function CarouselSlideClient(props: CarouselSlideProps): JSX.Element {
  const { themeData } = useTheme(CarouselTheme);
  return (
    <>
      <div className="[&_.section-grid]:px-1 [&_.promo-generic-wrapper]:px-1">
        {props.placeholder}
      </div>
      <Caption
        caption={props.fields.caption}
        italic={false}
        isImageCaption={false}
        classes={themeData.classes.slideCaption}
      />
    </>
  );
}
