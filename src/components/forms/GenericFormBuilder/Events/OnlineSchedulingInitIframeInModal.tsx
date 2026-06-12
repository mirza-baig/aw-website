'use client';

import { getCookies } from 'cookies-next';
import { FormikValues, useFormikContext } from 'formik';
import ModalWrapper, { ModalSize } from 'helpers/ModalWrapper/ModalWrapper';
import { Spinner } from 'helpers/Spinner';
import { ComponentProps } from 'lib/component-props';
import { OnlineSchedulingConstants } from 'lib/constants/online-scheduling';
import { useModalIdContext } from 'lib/context/GenericModalIDContext';
import { FormFieldProps } from 'lib/custom-forms/FormFieldProps';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import React, { JSX, useEffect, useRef, useState } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type OSInitIframeProps = ComponentProps &
  Sitecore.Forms.Events.OnlineSchedulingInitIframeInModal &
  FormFieldProps;

const RBA_PREFIX = 'rba';

function OnlineSchedulingInitIframeInModal_Default(props: OSInitIframeProps): JSX.Element {
  const { values } = useFormikContext<FormikValues>();
  const elementRef = useRef<HTMLElement>(null);
  const [isModalOpen] = useState(true);
  const { setIsGenericModalOpen } = useModalIdContext();
  const osExperience = useRef(null);

  function scrollToTop() {
    if (!elementRef.current) {
      return;
    }
    const scrollableElement = Array.from(elementRef.current.querySelectorAll('*')).find(
      (e) => e.scrollTop > 0 || e.scrollHeight > e.clientHeight
    );

    scrollableElement?.scrollTo(0, 0);
  }

  function initOS() {
    // get sourcing querystring and cookie values
    const valuesCopy = { ...values };
    const rbaCookies = getCookies() as Record<string, string>;
    Object.entries(rbaCookies).forEach(([key, value]) => {
      if (key.toLowerCase().startsWith(RBA_PREFIX)) {
        valuesCopy[key] = value;
      }
    });

    const rbaParameters = new URLSearchParams(window.location.search);
    rbaParameters.forEach((value: string, key: string) => {
      if (key.toLowerCase().startsWith(RBA_PREFIX)) {
        valuesCopy[key] = value;
      }
    });
    // @ts-ignore This class comes from the osiframe.js external script
    osExperience.current = new OnlineSchedulingExperience('os-root', {
      leadData: valuesCopy,
      contentVersion: contentVersion,
      events: {
        onReady: hideSpinner,
        onPageChange: scrollToTop,
      },
    });
  }

  useEffect(() => {
    if ('osScript' in window) {
      initOS();
      setIsGenericModalOpen(true);
    }
  }, []);

  if (!props.fields) {
    return <></>;
  }

  const modalSize = getEnum<ModalSize>(props.fields.modalSize) ?? 'extra-large';
  const contentVersion = getEnum<string>(props.fields.contentVersion);

  function hideSpinner() {
    document.getElementById('os-root')?.classList.remove('invisible');
    const spinners = document.getElementsByClassName('animate-spin');

    if (spinners.length > 0) {
      spinners[0].classList.add('invisible');
    }
  }

  function closeModal() {
    if (osExperience.current) {
      // @ts-ignore sendMessage is defined in osiframe.js
      osExperience.current.sendMessage({ type: OnlineSchedulingConstants.events.closeModal });
    }
    elementRef.current?.classList.add('invisible');
    document.body.classList.remove('overflow-y-hidden!');
    setIsGenericModalOpen(false);
  }

  return (
    <span ref={elementRef}>
      {isModalOpen && (
        <ModalWrapper
          size={modalSize}
          isModalOpen={isModalOpen}
          handleClose={closeModal}
          closeIconWrapperClasses="absolute flex h-[40px] w-full justify-end"
        >
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <Spinner size={48} />
          </div>
          <div id="os-root" className="invisible"></div>
        </ModalWrapper>
      )}
    </span>
  );
}

export const Default = withDatasourceCheck(OnlineSchedulingInitIframeInModal_Default);
