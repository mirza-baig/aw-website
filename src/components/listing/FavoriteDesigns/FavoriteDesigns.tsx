'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import { Spinner } from 'helpers/Spinner';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { useExternalScript } from 'lib/utils/use-external-script';
import { useFavoriteDesigns } from 'lib/website/favorite-designs/use-favorite-designs';
import React, { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { NoResults } from '../FavoriteProducts/helpers/NoResults.helper';
import FavoriteDesignCard from './helpers/FavoriteDesignCard.helper';
import { shareServicesToExclude } from './helpers/FavoriteDesigns.helper';
import { DesignProps } from './helpers/FavoriteDesignsTypes.helper';
import { Sitecore } from '.sitecore/AndersenWindows.model';

declare global {
  let a2a_config: A2AConfig | undefined;
}

interface A2AConfig {
  onclick?: number;
  num_services?: number;
  exclude_services?: string[];
  templates?: Record<string, any>;
  callbacks?: any[];
}

type FavoriteDesignsProps = ComponentProps & Sitecore.Components.Listing.Favorites.FavoriteDesigns;

function FavoriteDesigns_Default(props: FavoriteDesignsProps) {
  /** -------- USE FAVORITES HOOK -------- */
  const { favoriteDesigns, isLoading, error } = useFavoriteDesigns();

  const designs = favoriteDesigns as DesignProps[];

  /** -------- PRINT SETUP -------- */
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Favorite Designs',
    onBeforePrint: () => Promise.resolve(console.log('onBeforePrint')),
    onAfterPrint: () => console.log('onAfterPrint'),
  });

  /** -------- EXTERNAL SCRIPT -------- */
  const externalScript = 'https://static.addtoany.com/menu/page.js';
  const state = useExternalScript(externalScript);

  const { fields } = props;

  /** -------- ADDTOANY CONFIG -------- */
  useEffect(() => {
    const globalScope = globalThis as typeof globalThis & { a2a_config: A2AConfig };

    if (globalScope.a2a_config) {
      globalScope.a2a_config.onclick = 1;
      globalScope.a2a_config.num_services = 8;
      globalScope.a2a_config.exclude_services = shareServicesToExclude;

      globalScope.a2a_config.templates = {
        email: {
          subject: 'Check out my Favorites from Andersen Windows',
          body: 'Link to my Favorites on AndersenWindows.com ${link}',
        },
        sms: {
          body: 'Link to my Favorites on AndersenWindows.com ${link}',
        },
      };

      globalScope.a2a_config.callbacks = globalScope.a2a_config.callbacks || [];
    }
  }, [state]);

  /** -------- UTILS -------- */
  const getCreatedAtDate = (dateString: string): string => {
    const date = new Date(dateString);
    const locale = 'en-us';
    const weekday = date.toLocaleDateString(locale, { weekday: 'long' });
    const month = date.toLocaleDateString(locale, { month: 'long' });
    const day = date.toLocaleDateString(locale, { day: '2-digit' });
    const year = date.toLocaleDateString(locale, { year: 'numeric' });

    return `Created ${weekday} ${month}, ${day} ${year}`;
  };

  if (!fields) {
    return null;
  }

  /** -------- RENDER -------- */
  return (
    <Component variant="lg" dataComponent="general/favoritedesigns" {...props}>
      <div className="col-span-12">
        <div className="flex justify-between">
          <Headline {...props} />
          {designs.length > 0 && !error && (
            <button
              id="print-icon"
              className="hidden cursor-pointer items-center justify-center text-darkprimary ml:flex"
              onClick={handlePrint}
            >
              <SvgIcon icon="print" />
              <span className="ml-xxs">Print</span>
            </button>
          )}
        </div>
      </div>

      <div className="col-span-12" ref={componentRef}>
        {designs.length === 0 && !error && <NoResults fields={fields} />}

        {Boolean(error) && (
          <div className="font-sans text-sm-m font-medium ml:text-m">
            {
              "We're sorry, we couldn't process your request at this time. Please refresh or try again later."
            }
          </div>
        )}

        {Boolean(isLoading) && !error && (
          <div className="loader flex min-h-[40vh] w-full items-center justify-center">
            <Spinner size={48} />
          </div>
        )}

        {designs.length > 0 &&
          designs.map((designData) => (
            <div key={designData.createdDate} className="mb-4">
              <span className="font-serif text-small print:hidden">
                {getCreatedAtDate(designData.createdDate)}
              </span>
              <div className="relative border border-gray">
                <FavoriteDesignCard {...designData} />
              </div>
            </div>
          ))}
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(FavoriteDesigns_Default);
