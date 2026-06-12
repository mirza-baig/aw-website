import { useWebsiteContext } from 'lib/website/WebsiteContext';

export const useModalIdContext = () => {
  const { isGenericModalOpen, prevFocusedElementRef, selectedModalId, dispatch } =
    useWebsiteContext();

  return {
    isGenericModalOpen,
    prevFocusedElementRef,
    selectedModalId,
    setSelectedModalId: (selectedModalId: string) => dispatch({ selectedModalId }),
    setIsGenericModalOpen: (isGenericModalOpen: boolean) => dispatch({ isGenericModalOpen }),
  };
};
