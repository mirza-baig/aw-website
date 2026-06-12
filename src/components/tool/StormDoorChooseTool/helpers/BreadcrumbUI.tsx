'use client';

import { Text } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import React from 'react';

import { Question } from './StormDoorChooseTool.helper';

type BreadcrumbUIProps = {
  allQuestionID: Question[];
  showRecommendation: boolean;
  onClickBreadcrumb: (id: string) => void;
};

export const BreadcrumbUI = React.memo(function BreadcrumbUI({
  allQuestionID,
  showRecommendation,
  onClickBreadcrumb,
}: BreadcrumbUIProps) {
  return (
    <ul className="flex flex-wrap justify-center">
      {allQuestionID
        ?.filter((link) => link?.breadcrumbText?.value)
        .map((link, index, arr) => {
          const isLast = index === arr.length - 1 && !showRecommendation;
          return (
            <li key={link.id} className="pr-xxs flex items-center">
              {isLast ? (
                // Non-clickable (current step)
                <div className="mt-xxs mb-xxs font-sans text-small font-heavy uppercase ml:text-xxs text-darkprimary">
                  <Text field={{ value: link?.breadcrumbText?.value || '' }} />
                </div>
              ) : (
                // Clickable breadcrumb
                <button
                  type="button"
                  onClick={() => onClickBreadcrumb(link.id)}
                  className={classNames(
                    'mt-xxs mb-xxs font-sans text-small font-heavy uppercase ml:text-xxs text-darkprimary',
                    !isLast && 'underline cursor-pointer'
                  )}
                >
                  {/* Text between arrows */}

                  <Text field={{ value: link?.breadcrumbText?.value || '' }} />
                </button>
              )}

              {!isLast && <SvgIcon icon="caret-primary" className="ml-xxs text-primary" />}
            </li>
          );
        })}

      {/* ✅ SUMMARY */}
      {showRecommendation && (
        <li className="pr-xxs flex items-center">
          <div className="mt-xxs mb-xxs font-sans text-small font-heavy uppercase text-darkprimary ml:text-xxs">
            <Text field={{ value: 'Summary' }} />
          </div>
        </li>
      )}
    </ul>
  );
});
