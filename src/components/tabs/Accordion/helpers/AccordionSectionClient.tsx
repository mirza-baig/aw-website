'use client';

import { Field, Item } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { Subheadline } from 'helpers/Subheadline';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { useTheme } from 'lib/context/ThemeContext';
import { getHeadingLevel } from 'lib/utils/get-heading-level';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { JSX, ReactNode, useEffect, useState } from 'react';

import { AccordionTheme } from './Accordion.theme';

type AccordionSectionProps = Readonly<{
  fields: {
    sectionTitle: Field<string>;
    sectionAnchorName: Field<string>;
    headlineLevel: Item;
  };
  placeholder: ReactNode;
}>;

export default function AccordionSectionClient(props: AccordionSectionProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const { themeData } = useTheme(AccordionTheme);
  const { currentScreenWidth } = useCurrentScreenType();

  const defaultTag = 'h3';
  const headlineLevel = getHeadingLevel(defaultTag, props?.fields?.headlineLevel);
  const sectionAnchorName = props?.fields?.sectionAnchorName?.value;
  useEffect(() => {
    const onHashChanges = () => {
      if (typeof window !== 'undefined' && window.location.hash !== '') {
        const hash = window.location.hash.replace('#', '');
        if (sectionAnchorName === hash) {
          setIsExpanded(true);
        }
      }
    };

    onHashChanges();
    window.addEventListener('hashchange', onHashChanges);
    return () => {
      window.removeEventListener('hashchange', onHashChanges);
    };
  }, [sectionAnchorName]);

  const renderSectionIcon = (isExpanded: boolean) => {
    const isLargeScreen = currentScreenWidth >= getBreakpoint('md');
    const Iconsize = isLargeScreen ? 'xxl' : 'lg';

    return isExpanded ? (
      <SvgIcon icon="minus" size={Iconsize} className={themeData.classes.sectionIcon} />
    ) : (
      <SvgIcon icon="plus" size={Iconsize} className={themeData.classes.sectionIcon} />
    );
  };

  return (
    <section
      className={classNames(
        !isExpanded
          ? '[&:last-child_.sectionTitleWrapper]:border-b'
          : themeData.classes.accordionSection
      )}
      id={props.fields?.sectionAnchorName?.value}
    >
      <button
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded(!isExpanded)}
        className={themeData.classes.sectionTitleWrapper}
        type="button"
      >
        {props?.fields && (
          <Subheadline
            useTag={headlineLevel}
            classes={themeData.classes.sectiontitle}
            fields={{
              subheadlineText: props?.fields?.sectionTitle,
            }}
          />
        )}

        {renderSectionIcon(isExpanded)}
      </button>

      <div className={classNames('accordion-content', isExpanded ? 'block' : 'hidden')}>
        {props.placeholder}
      </div>
    </section>
  );
}
