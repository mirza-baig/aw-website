import { MutableRefObject } from 'react';

export type GenericModalState = {
  selectedModalId: string;
  isGenericModalOpen: boolean;
  prevFocusedElementRef: MutableRefObject<HTMLButtonElement | null> | null;
};
