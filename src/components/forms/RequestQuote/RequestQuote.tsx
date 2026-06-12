import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { Suspense } from 'react';

import { RequestQuoteClient } from './helpers/RequestQuoteClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';
import componentMap from '.sitecore/component-map';

type RequestQuoteProps = ComponentProps & Sitecore.Forms.Custom.RequestAQuote.RequestAQuote;

function RequestQuote_Default(props: RequestQuoteProps) {
  const dynamicId = props.params?.DynamicPlaceholderId;

  return (
    <Suspense>
      <RequestQuoteClient
        fields={props.fields}
        cardsPlaceholders={{
          newConstruction: (
            <AppPlaceholder
              name={`newConstruction-${dynamicId}`}
              rendering={props.rendering}
              page={props.page}
              componentMap={componentMap}
              render={(components: React.ReactNode[] = []) => (
                <div className="grid grid-cols-12 gap-s">
                  {components.map((component, index) => (
                    <div
                      key={index}
                      data-cards-index={index}
                      className="col-span-12 bg-light-gray p-6 md:col-span-4"
                    >
                      {component}
                    </div>
                  ))}
                </div>
              )}
            />
          ),
          windowsOrDoorReplacement: (
            <AppPlaceholder
              name={`windowsOrDoorReplacement-${dynamicId}`}
              rendering={props.rendering}
              page={props.page}
              componentMap={componentMap}
              render={(components: React.ReactNode[] = []) => (
                <div className="grid grid-cols-12 gap-s">
                  {components.map((component, index) => (
                    <div
                      key={index}
                      data-cards-index={index}
                      className="col-span-12 bg-light-gray p-6 md:col-span-4"
                    >
                      {component}
                    </div>
                  ))}
                </div>
              )}
            />
          ),
          remodeling: (
            <AppPlaceholder
              name={`remodeling-${dynamicId}`}
              rendering={props.rendering}
              page={props.page}
              componentMap={componentMap}
              render={(components: React.ReactNode[] = []) => (
                <div className="grid grid-cols-12 gap-s">
                  {components.map((component, index) => (
                    <div
                      key={index}
                      data-cards-index={index}
                      className="col-span-12 bg-light-gray p-6 md:col-span-4"
                    >
                      {component}
                    </div>
                  ))}
                </div>
              )}
            />
          ),
        }}
      />
    </Suspense>
  );
}

export const Default = withDatasourceCheck(RequestQuote_Default);
