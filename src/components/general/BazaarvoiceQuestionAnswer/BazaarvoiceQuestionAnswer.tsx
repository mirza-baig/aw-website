'use client';

import { Field } from '@sitecore-content-sdk/nextjs';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { useBVScript } from 'lib/utils/use-bv-script';
import { useEffect, useRef, useState } from 'react';
import { environment } from 'startup/environment';

import styles from './helpers/bazaarvoice-question-answer.module.css';
import { BazaarvoiceQuestionAnswerTheme } from './helpers/BazaarvoiceQuestionAnswer.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type BazaarvoiceQuestionAnswerProps = ComponentProps &
  Sitecore.Components.General.BazaarvoiceQuestionAnswer.BazaarvoiceQuestionAnswer;

function BazaarvoiceQuestionAnswer_Default(props: BazaarvoiceQuestionAnswerProps) {
  const { themeName, themeData } = useTheme(BazaarvoiceQuestionAnswerTheme);
  const productItem = props?.fields?.productItem;
  const bazaarvoiceProductId = (
    productItem?.fields?.bazaarvoiceProductId as Field<string> | undefined
  )?.value;
  const componentId = 'bazaarvoice-question-answer-' + bazaarvoiceProductId;

  const [isOpen, setIsOpen] = useState(false);
  const [questionCount, setQuestionCount] = useState('');
  const intervalref = useRef<ReturnType<typeof setInterval> | null>(null);

  // Add the bazaarvoice script
  useBVScript({ environment, theme: themeName });

  useEffect(() => {
    if (intervalref.current !== null) {
      return;
    }

    let i = 0;

    const stopInterval = () => {
      if (intervalref.current) {
        clearInterval(intervalref.current);
        intervalref.current = null;
      }
    };

    // Start the interval
    // Wait for the element to be added to the page then set the question count
    intervalref.current = setInterval(() => {
      i += 1;

      const bvContainer = document.querySelector<HTMLElement>('#BVQAContainer');
      const bvContainerInnerText = bvContainer?.innerText || '';

      // The container exists, so try to get the count now
      if (bvContainerInnerText.length > 0) {
        const bvSelector = document.querySelector<HTMLElement>(
          '#BVQAContainer .bv-control-bar .bv-content-pagination-pages-current span'
        );
        const bvSpanInnerText = bvSelector?.innerText || '';

        if (bvSpanInnerText.length > 0) {
          // Get the last number from "1–10 of XX Questions" span tag
          const regex = /(\d+)(?!.*\d)/gm;
          const allMatched = Array.from(bvSpanInnerText.matchAll(regex));
          const firstMatch = allMatched[0];

          if (firstMatch === undefined) {
            setQuestionCount('0');
          } else {
            setQuestionCount(firstMatch[0]);
          }
        } else {
          // If there is one or fewer questions, the span tag with the counts does not exist,
          // so instead count how many appear in the list
          const bvQuestionCount = document.querySelectorAll<HTMLElement>(
            '#BVQAContainer .bv-content-list-container > ol > li'
          ).length;

          setQuestionCount(bvQuestionCount.toString());
        }

        stopInterval();
      }

      // Optional safety: stop after 50 attempts to avoid infinite loops
      if (i > 50) {
        stopInterval();
      }
    }, 100);

    // Cleanup on unmount
    return () => {
      stopInterval();
    };
  }, []);

  // Stop the interval

  // Use the useEffect hook to cleanup the interval when the component unmounts
  useEffect(() => {
    return () => {
      if (intervalref.current !== null) {
        clearInterval(intervalref.current);
      }
    };
  }, []);
  return (
    <Component
      gap="0"
      variant="lg"
      backgroundVariant=""
      sectionWrapperClasses={styles.bvQuestionAnswer}
      dataComponent="general/bazaarvoicequestionanswer"
      {...props}
    >
      <Headline classes={themeData.classes.headline} {...props} />
      <div className={themeData.classes.wrapperClass}>
        <div
          className={themeData.classes.accordionToggleContainer}
          data-anchor-name={`#${componentId}`}
        >
          <button
            type="button"
            className={themeData.classes.accordionHeadline}
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls={`accordion-panel-${componentId}`}
          >
            <div className={themeData.classes.readQuestion}>Read Questions</div>
            <div className={themeData.classes.readQuestionCount}>({questionCount})</div>
            <div className={themeData.classes.accordionToggleIndicator}>
              <SvgIcon
                icon={isOpen ? 'minus' : 'plus'}
                size="18"
                className={themeData.classes.iconClass}
              />
            </div>
          </button>
        </div>

        <div
          className={`content-container ${
            isOpen ? themeData.classes.contentOpen : themeData.classes.contentClosed
          }`}
          id={componentId}
        >
          <div className="content">
            <div data-bv-show="questions" data-bv-product-id={bazaarvoiceProductId}></div>
          </div>
        </div>
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(BazaarvoiceQuestionAnswer_Default);
