import { BreadcrumbManager as HeadlessBreadcrumbManager } from '@coveo/headless';
import { Field } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import Headline from 'helpers/Headline/Headline';
import { FunctionComponent, useEffect, useState } from 'react';

interface BreadcrumbManagerProps {
  controller: HeadlessBreadcrumbManager;
  breadcrumbClasses?: {
    [property: string]: string;
  };
  facetSectionHeading: Field<string>;
  clearAllLabel: Field<string>;
  isInlineBreadcrumb?: boolean;
}

export const BreadcrumbManager: FunctionComponent<BreadcrumbManagerProps> = (props) => {
  const {
    controller,
    breadcrumbClasses,
    facetSectionHeading,
    clearAllLabel,
    isInlineBreadcrumb = true,
  } = props;
  const [state, setState] = useState(controller.state);

  useEffect(() => {
    controller.subscribe(() => setState(controller.state));
  }, [controller]);

  const ClearAllButton = () => {
    return (
      <button
        className={classNames(breadcrumbClasses?.ctaClass, {
          'text-body! font-bold!': !isInlineBreadcrumb,
        })}
        disabled={state.facetBreadcrumbs.length < 1}
        onClick={() => controller.deselectAll()}
      >
        {clearAllLabel?.value}
      </button>
    );
  };

  return isInlineBreadcrumb ? (
    <div className={breadcrumbClasses?.wrapperClass}>
      <Headline
        classes={breadcrumbClasses?.titleClass}
        useTag="h3"
        fields={{
          headlineText: facetSectionHeading,
        }}
      />
      <ClearAllButton />
    </div>
  ) : (
    <ul className={breadcrumbClasses?.breadcrumbPillsWrapper}>
      {state.facetBreadcrumbs.map((facet) =>
        facet.values.map((breadcrumb, valueIndex) => (
          <li key={`${facet.facetId}-${valueIndex}`}>
            <button
              className={breadcrumbClasses?.breadcrumbPill}
              key={breadcrumb.value.value}
              onClick={() => breadcrumb.deselect()}
            >
              {breadcrumb.value.value}
              <span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 2.20857L11.7914 1L7 5.79143L2.20857 1L1 2.20857L5.79143 7L1 11.7914L2.20857 13L7 8.20857L11.7914 13L13 11.7914L8.20857 7L13 2.20857Z"
                    fill="black"
                    stroke="black"
                  />
                </svg>
              </span>
            </button>
          </li>
        ))
      )}
      <li className="py-xxs px-s">
        <ClearAllButton />
      </li>
    </ul>
  );
};
