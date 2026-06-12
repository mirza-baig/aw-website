'use client';

import { RouteData } from '@sitecore-content-sdk/nextjs';
import Component from 'helpers/Component/Component';
import ModalWrapper, { AnimationStyle, ModalSize } from 'helpers/ModalWrapper/ModalWrapper';
import { FormsConstants } from 'lib/constants/forms-constants';
import { useModalIdContext } from 'lib/context/GenericModalIDContext';
import { getEnum } from 'lib/utils/get-enum';
import { JSX, ReactNode, useEffect, useState } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type GenericModalProps = Sitecore.Components.Modal.GenericModal.GenericModal & {
  fields?: {
    children: RouteData[];
  };
  placeholder: ReactNode;
};

export function GenericModalClient(props: GenericModalProps): JSX.Element {
  const { fields } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedModalId, setSelectedModalId, prevFocusedElementRef } = useModalIdContext();

  const desktopAnimationStyle = getEnum<AnimationStyle>(fields?.desktopAnimationStyle) ?? null;
  const mobileAnimationStyle = getEnum<AnimationStyle>(fields?.mobileAnimationStyle) ?? null;

  const displayCloseBar = fields?.displayCloseBar?.value ?? false;

  function HandleOpenModal() {
    setIsModalOpen(true);
  }

  function HandleCloseModal() {
    setIsModalOpen(false);
    setSelectedModalId('');
    prevFocusedElementRef?.current?.focus();
  }

  const modalSize = getEnum<ModalSize>(fields?.modalSize) ?? 'large';

  useEffect(() => {
    if (selectedModalId) {
      if (selectedModalId === fields?.modalId.value) {
        HandleOpenModal();
      }
    }
    if (selectedModalId === '') {
      HandleCloseModal();
    }
    // "props.fields?.modalId.value" is coming directly from layout service.
    // "handleCloseModal" is a function which is not going to be changed.
    // We can ignore both suggested deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModalId]);

  useEffect(() => {
    function handleOpenGenericModalEvent(e: CustomEvent) {
      if (e?.detail?.modalId) {
        setSelectedModalId(e.detail.modalId);
      }
      if (e.detail?.form) {
        document.dispatchEvent(
          new CustomEvent(FormsConstants.Enterprise.openFormEvent, { detail: e.detail })
        );
      }
    }
    document.addEventListener(
      FormsConstants.Enterprise.openModalEvent,
      handleOpenGenericModalEvent
    );

    return () => {
      document.removeEventListener(
        FormsConstants.Enterprise.openModalEvent,
        handleOpenGenericModalEvent
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Component dataComponent="modal/genericmodal" {...props}>
      <ModalWrapper
        size={modalSize}
        handleClose={HandleCloseModal}
        modalLabel={fields?.modalId.value}
        isModalOpen={isModalOpen}
        desktopAnimationStyle={desktopAnimationStyle}
        mobileAnimationStyle={mobileAnimationStyle}
        displayCloseBar={displayCloseBar}
        isEditing={props.page.mode.isEditing}
      >
        {isModalOpen && props.placeholder}
      </ModalWrapper>
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `function openModal(modalId, formDetails) { document.dispatchEvent(new CustomEvent('${FormsConstants.Enterprise.openModalEvent}', { detail: { modalId: modalId, form: formDetails }})); }`,
        }}
      />
    </Component>
  );
}
