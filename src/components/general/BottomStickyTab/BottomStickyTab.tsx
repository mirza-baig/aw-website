'use client';

import { Field, Text } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import Component from 'helpers/Component/Component';
import IconDropdownArrow from 'helpers/SvgIcon/icons/icon--dropdown-arrow';
import { ComponentProps } from 'lib/component-props';
import { useModalIdContext } from 'lib/context/GenericModalIDContext';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { MouseEvent } from 'react';

import { bottomStickyTabTheme, TabStyle } from './helpers/BottomStickyTab.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type BottomStickyTabProps = ComponentProps &
  Sitecore.Components.General.BottomStickyTab.BottomStickyTab;

function BottomStickyTab_Default(props: BottomStickyTabProps) {
  const { fields } = props;
  const { setSelectedModalId, prevFocusedElementRef, selectedModalId } = useModalIdContext();
  const tabStyle = getEnum<TabStyle>(fields?.tabStyle) ?? 'black';
  const { themeData } = useTheme(bottomStickyTabTheme(tabStyle));

  if (!fields) {
    return <></>;
  }

  const modalId = (fields.genericModal?.fields.modalId as Field<string>)?.value;

  const handleModalClick = (e: MouseEvent) => {
    if (modalId && selectedModalId != modalId) {
      setSelectedModalId(modalId);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      prevFocusedElementRef &&
        (prevFocusedElementRef.current = e.currentTarget as HTMLButtonElement);
    } else {
      setSelectedModalId('');
    }
  };

  return (
    <Component
      backgroundVariant=""
      sectionWrapperClasses="relative"
      variant="lg"
      dataComponent="general/bottomstickytab"
      {...props}
    >
      <div
        className={classNames(
          'fixed bottom-0 left-0 right-0  bg-theme-bg text-theme-text ',
          tabStyle === 'black' ? 'theme-secondary' : 'theme-primary',
          modalId === selectedModalId || selectedModalId === '' ? 'z-1001' : 'z-998'
        )}
      >
        <div className=" relative h-full w-full md:h-1.5 ">
          <button
            onClick={(e) => handleModalClick(e)}
            className={classNames(themeData.classes.stickyTab, 'max-md:border-x-0')}
          >
            <span
              className={classNames('flex items-center justify-center', themeData.classes.tabText)}
            >
              <span
                className={classNames('duration-500', {
                  'text-[0px] leading-none opacity-0': selectedModalId !== modalId,
                })}
              >
                <Text field={{ value: 'Close' }} tag="" />
              </span>
              <span
                className={classNames('inline-flex duration-500', {
                  'translate-x-full text-[0px] leading-none opacity-0  ease-in-out':
                    selectedModalId === modalId,
                })}
              >
                <Text field={fields.tabTitle} tag="" />
              </span>
            </span>
            <span
              className={classNames(
                'duration-500',
                selectedModalId == modalId ? 'rotate-0' : 'rotate-180',
                themeData.classes.tabIcon
              )}
            >
              <IconDropdownArrow />
            </span>
          </button>
        </div>
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(BottomStickyTab_Default);
