'use client';

import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Button from 'helpers/Button/Button';
import Headline from 'helpers/Headline/Headline';
import ModalWrapper from 'helpers/ModalWrapper/ModalWrapper';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'lib/component-props';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { mapSearchResults } from 'lib/graphql/mappers/map-search-results';
import { IntegratedGraphQlResult } from 'lib/graphql/types/integrated-graphql-result';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import { ItemSearchResults } from 'lib/graphql/types/item-search-results';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX, useState } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type RequestAQuoteElementProps = ComponentProps &
  Sitecore.Forms.GenericFormBuilder.Elements.RequestAQuote.RequestAQuoteElement & {
    fields: {
      //Using any[] here as generic children type since specific type isn't exported
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      children: any[];
    };
  };

type FontColor = 'black' | 'white' | 'orange';

function RequestAQuoteElement_Default(props: RequestAQuoteElementProps): JSX.Element | null {
  const [isModalOpen, setIsModalOpen] = useState(true);

  props = {
    ...props,
    ...getComponentServerProps(props.rendering),
  };

  if (props.fields == undefined) {
    return null;
  }

  // Get font color from Sitecore field, default to black
  const fontColor = getEnum<FontColor>(props.fields.fontColor) ?? 'orange';

  // Map font color to Tailwind classes
  const fontColorClasses: Record<FontColor, string> = {
    black: 'text-black',
    white: 'text-white',
    orange: 'text-primary',
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Modal */}
      <ModalWrapper
        size="fluid"
        isModalOpen={isModalOpen}
        handleClose={handleCloseModal}
        modalLabel="Request a Quote Modal"
        showCloseButton={true}
        customContentWrapperclass="!p-0"
      >
        <div className="flex flex-col">
          <div className="flex flex-col items-center px-m py-s md:px-m md:py-s bg-white">
            {/* Orange Checkmark Icon */}
            <div className="mb-m flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <SvgIcon icon="checktick" className="text-white text-xxl" size={40} />
            </div>

            <Headline
              classes={`font-sans text-sm-m md:text-m font-extrabold text-bold mb-s text-center ${fontColorClasses[fontColor]}`}
              useTag="h1"
              {...props.fields.children[0]}
            />
            <BodyCopy
              {...props.fields.children[1]}
              classes="text-center font-serif text-body font-regular text-dark-gray max-w-[500px]"
            />
          </div>

          {/* Request a Quote Section - Darker Gray Background */}
          <div className="flex flex-col items-center px-m py-l md:px-m md:py-l bg-[#E8E6E2]">
            <Headline
              classes="font-sans text-sm-s md:text-s font-extrabold mb-s text-center text-black"
              useTag="h1"
              {...props}
            />
            <BodyCopy
              classes="text-center font-serif text-body font-regular text-dark-gray mb-m max-w-[500px]"
              {...props}
            />
            <Button
              field={props.fields.cta1Link}
              classes=""
              ariaLabel={{ value: 'Request A Quote' }}
            />
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}

export const Default = withDatasourceCheck(RequestAQuoteElement_Default);

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
    fields: ItemFieldResult[];
    children: ItemSearchResults<{
      id: string;
      fields: ItemFieldResult[];
    }>;
  };
}>;

function getComponentServerProps(rendering: ComponentRendering) {
  if (rendering.fields === undefined || !('data' in rendering.fields)) {
    return {};
  }
  const fields = rendering.fields as unknown as IntegratedGraphQl;

  const result = {
    fields: {
      ...mapItemFieldResultsToObject(fields.data.item.fields),
      children: mapSearchResults(fields.data.item.children, (child) => ({
        ...(child.id && { id: child.id }),
        fields: {
          ...mapItemFieldResultsToObject(child.fields),
        },
      })),
    },
  };
  return result;
}
