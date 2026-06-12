'use client';

import classNames from 'classnames';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { useRecentlyViewed } from 'lib/utils/use-recently-viewed';
import { useState } from 'react';

import { RecentlyViewedDocumentsTheme } from './helpers/RecentlyViewedDocuments.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type RecentlyViewedDocumentsProps = ComponentProps &
  Sitecore.Components.Listing.RecentlyViewedDocuments.RecentlyViewedDocuments;

function RecentlyViewedDocuments_Default(props: RecentlyViewedDocumentsProps) {
  const { themeData, themeName } = useTheme(RecentlyViewedDocumentsTheme);
  const [showAll, setShowAll] = useState(false);
  const recentlyViewedItems = useRecentlyViewed();
  return (
    <Component variant="lg" dataComponent="listing/recentlyvieweddocuments" {...props}>
      {recentlyViewedItems.recentLinks.length > 0 && (
        <>
          <div className={themeData.classes.headlineBorder}>
            <div className="mt-s flex md:mt-xxs">
              {themeName === 'aw' && (
                <div className="m-xxxs mt-px flex">
                  <SvgIcon icon="orange-triangle" />
                </div>
              )}
              <Headline classes={themeData.classes.headlineClass} {...props} />
            </div>
          </div>

          <div className="col-span-12 border-t border-solid border-gray md:col-span-8">
            <ul className={`flex flex-col`}>
              {recentlyViewedItems.recentLinks.length > 0 &&
                recentlyViewedItems.recentLinks.map(
                  (item: RecentlyViewedDocumentsProps, index: number) => {
                    return (
                      item && (
                        <li key={item.id} className={classNames(!showAll && index > 3 && 'hidden')}>
                          <LinkWrapper
                            field={item}
                            className="flex border-b border-solid border-gray py-s text-body text-darkprimary hover:underline"
                            target="_blank"
                            ariaLabel={{
                              value: item ?? 'Recently Viewed Items',
                            }}
                          />
                        </li>
                      )
                    );
                  }
                )}
            </ul>
            {recentlyViewedItems.recentLinks.length > 4 && (
              <button
                type="button"
                className="mt-s cursor-pointer border-none bg-transparent p-0 font-sans text-text-link font-heavy underline"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'View Less' : 'View All'}
              </button>
            )}
          </div>
        </>
      )}
    </Component>
  );
}

export const Default = withDatasourceCheck(RecentlyViewedDocuments_Default);
