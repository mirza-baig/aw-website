import { AppPlaceholder, ComponentRendering, useSitecore } from '@sitecore-content-sdk/react';
import Headline from 'helpers/Headline/Headline';
import React, { JSX, Key, useEffect } from 'react';
import TagManager from 'react-gtm-module';

import componentMap from '.sitecore/component-map';

interface CardVariant {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface CardHelperProps {
  cardVariants?: CardVariant[];
  typeVariant?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rendering?: ComponentRendering<any>;
  params?: { DynamicPlaceholderId?: string };
}

const CardHelper = (props: CardHelperProps): JSX.Element => {
  const { page } = useSitecore();
  useEffect(() => {
    const eventName = `ty_impression_${props?.typeVariant ?? 'unknown'}`;
    TagManager.dataLayer({
      dataLayer: {
        event: eventName,
        form_name: 'Request A Quote',
      },
    });
  }, [props.typeVariant]);

  const variants = Array.isArray(props.cardVariants) ? props.cardVariants : [];

  return (
    <>
      <div className="col-span-12">
        <Headline
          classes="text-theme-text text-center text-sm-m font-heavy mb-s"
          fields={{
            headlineText: {
              value: 'In the meantime, here are some topics to explore!',
            },
          }}
        />
      </div>

      {variants.map((_card: CardVariant, index: Key) => {
        const numericIndex = typeof index === 'number' ? index : Number(index ?? 0);
        const placeholderName = `${props.typeVariant}-${props.params?.DynamicPlaceholderId}`;

        return (
          <div key={String(numericIndex)} className="col-span-12 bg-light-gray p-6 md:col-span-4">
            {props.rendering ? (
              <AppPlaceholder
                name={placeholderName}
                rendering={props.rendering}
                render={(components: React.ReactNode[] = []) => {
                  const componentForThisCard = components[numericIndex];
                  return (
                    <div className="h-full" data-cards-index={numericIndex}>
                      {componentForThisCard}
                    </div>
                  );
                }}
                page={page}
                componentMap={componentMap}
              />
            ) : null}
          </div>
        );
      })}
    </>
  );
};

export default CardHelper;
