'use client';

import classNames from 'classnames';
import Component, { ComponentWrapperProps } from 'helpers/Component/Component';
import { getEnum } from 'lib/utils/get-enum';
import { JSX, ReactNode } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type FormContainerProps = Sitecore.Components.Forms.FormContainer.FormContainer & {
  placeholder: ReactNode;
  leftBar: ReactNode;
};

type WidthStatus = 'one-third' | 'half' | '';
type leftSectionStatus = 'top' | 'bottom' | 'middle';
type rightSectionStatus = 'middle';
type MobileWidthStatus = 'top' | 'bottom';

export function FormContainerClient(props: FormContainerProps): JSX.Element {
  if (!props.fields) {
    return <></>;
  }

  const containerVariants: Record<ComponentWrapperProps['variant'], string> = {
    full: 'grid grid-cols-12',
    lg: 'grid-rows-auto grid grid-cols-12 gap-y-0 md:max-w-(--breakpoint-lg) md:grid-flow-row-dense md:grid-cols-12 md:gap-s md:px-m lg:mx-auto',
  };

  const leftColSpan: Record<WidthStatus, string> = {
    'one-third': 'col-span-12 ml:col-span-4 ml:-mr-s',
    half: 'col-span-12 ml:col-span-6 ml:-mr-s',
    '': 'col-span-12 ml:col-span-12 px-m',
  };

  const rightColSpan: Record<WidthStatus, string> = {
    'one-third': 'col-span-12 ml:col-span-8 pt-m ml:pt-0 ml:grid ml:grid-cols-6 ml:gap-s',
    half: 'col-span-12 ml:col-span-6 pt-m ml:pt-0 ml:grid ml:grid-cols-6 ml:gap-s',
    '': 'col-span-12 ml:col-span-12 px-m',
  };

  const leftSectionAlignmentMobile: Record<MobileWidthStatus, string> = {
    top: 'order-first ml:order-none',
    bottom: 'order-last ml:order-none',
  };

  const leftSectionAlignment: Record<leftSectionStatus, string> = {
    top: 'flex flex-col justify-start',
    bottom: 'flex flex-col justify-end',
    middle: 'flex flex-col justify-center',
  };

  const rightSectionAlignment: Record<rightSectionStatus, string> = {
    middle: 'flex flex-col justify-center',
  };

  const leftSectionBackground = getEnum<string>(props?.fields.leftSectionBackground);
  const rightSectionBackground = getEnum<string>(props?.fields.rightSectionBackground);
  const containerWidth = props?.fields?.edgeToEdgeContainer?.value === true ? 'full' : 'lg';
  const removeleftPadding = props?.fields?.removeLeftPadding?.value === true ? 'mr-l' : '-mr-m';

  return (
    <Component
      sectionWrapperClasses="-ml-m"
      variant="full"
      backgroundVariant={
        containerWidth !== 'full' &&
        leftSectionBackground === 'gray' &&
        rightSectionBackground === 'gray'
          ? 'gray'
          : ''
      }
      dataComponent="forms/formcontainer"
      {...props}
    >
      <div className={`col-span-12 ${removeleftPadding} `}>
        <div className={classNames(containerVariants[containerWidth])}>
          {/* Left section */}
          <div
            className={classNames(
              leftColSpan[getEnum<WidthStatus>(props?.fields?.width) ?? ''],
              leftSectionBackground === 'gray' ? 'bg-light-gray' : 'bg-white',
              leftSectionAlignment[
                getEnum<leftSectionStatus>(props?.fields?.leftSectionAlignment) ?? 'top'
              ],
              leftSectionAlignmentMobile[
                getEnum<MobileWidthStatus>(props?.fields?.leftSectionAlignmentMobile) ?? 'top'
              ]
            )}
          >
            {props.leftBar}
          </div>
          {/* Right section */}
          <div
            className={classNames(
              rightColSpan[getEnum<WidthStatus>(props?.fields?.width) ?? ''],
              rightSectionAlignment,
              rightSectionBackground === 'gray' ? 'bg-light-gray' : 'bg-white',
              '-mt-s ml:mt-0'
            )}
          >
            <div className="col-span-1"></div>
            <div
              className={
                props?.fields?.width === null
                  ? `ml:w-full`
                  : `col-span-5 py-s px-s ml:w-[80%] ml:px-0`
              }
            >
              {props.placeholder}
            </div>
          </div>
        </div>
      </div>
    </Component>
  );
}
