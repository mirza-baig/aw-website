import classNames from 'classnames';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { MouseEvent, ReactNode, useEffect, useRef, useState } from 'react';

export type ModalSize = 'extra-large' | 'large' | 'medium' | 'fluid' | 'genericCard';

export type AnimationStyle = 'slide-in-top' | 'slide-in-bottom';

interface ModalWrapperProps {
  size?: ModalSize;
  modalLabel?: string;
  customContentWrapperclass?: string;
  children: ReactNode;
  customOverlayclass?: string;
  handleClose: () => void;
  isModalOpen: boolean;
  desktopAnimationStyle?: AnimationStyle | null;
  mobileAnimationStyle?: AnimationStyle | null;
  displayCloseBar?: boolean;
  closeIconClasses?: string;
  closeIconWrapperClasses?: string;
  showCloseButton?: boolean;
  isEditing?: boolean;
}

const ModalWrapper = ({
  size = 'large',
  children,
  handleClose,
  modalLabel,
  customOverlayclass,
  customContentWrapperclass,
  isModalOpen,
  desktopAnimationStyle,
  mobileAnimationStyle,
  displayCloseBar = false,
  closeIconClasses,
  closeIconWrapperClasses,
  showCloseButton = true,
  isEditing,
}: ModalWrapperProps) => {
  const modalWrapperRef = useRef<HTMLDialogElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const { currentScreenWidth } = useCurrentScreenType();

  const [headerHeight, setHeaderHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(currentScreenWidth <= getBreakpoint('md'));

  const getHeaderBottomPosition = () => {
    // Add 'headerBottomPosElement' class to sticky header wrapper or bottom element of AW header
    return document.querySelector('.headerBottomPosElement')?.getBoundingClientRect().bottom ?? 0;
  };

  useEffect(() => {
    // To remove this error "The ref value 'modalWrapperRef.current' will likely have changed by the time this effect cleanup function runs. If this ref points to a node rendered by React, copy 'modalWrapperRef.current' to a variable inside the effect, and use that variable in the cleanup function. Added this const."
    const modalWrapperElement = modalWrapperRef.current;

    setHeaderHeight(getHeaderBottomPosition());

    if (isMobile || (!isMobile && !desktopAnimationStyle)) {
      setHeaderHeight(0);
    }

    if (modalWrapperElement) {
      modalWrapperElement.focus();
      modalWrapperElement?.addEventListener('keydown', handleKeyDown);

      // on first load, we remove the hidden class from modal, which was added to hide intitial translate transition on page load
      if (
        ((desktopAnimationStyle && !isMobile) || (mobileAnimationStyle && isMobile)) &&
        size === 'extra-large'
      ) {
        modalWrapperElement.classList.remove('hidden');
        modalWrapperElement.classList.add('flex');
      }
      return () => {
        modalWrapperElement?.removeEventListener('keydown', handleKeyDown);
      };
    }

    return () => {};

    // 'desktopAnimationStyle' and 'mobileAnimationStyle', Here these defined as AnimationStyle, here onScroll we are passing null as value, so there is no need to add in dependencies.
    // "handleKeyDown" is function, so we can ignore react-hooks/exhaustive-deps warning for this suggested dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalWrapperRef, isMobile, size]);

  useEffect(() => {
    // Add overflow-hidden class to the body when the modal is opened
    setIsMobile(currentScreenWidth <= getBreakpoint('md'));

    if (isModalOpen) {
      document.body.classList.add('overflow-y-hidden!');
    }
    if (!isModalOpen) {
      modalContentRef.current?.scrollTo?.({ top: 0, behavior: 'smooth' });
    }

    // set bottom position of header on scroll
    const handleScroll = () => {
      const isMobileScreen = currentScreenWidth <= getBreakpoint('md');

      // If no animation style for this screen type, always reset height
      if (
        (isMobileScreen && !mobileAnimationStyle) ||
        (!isMobileScreen && !desktopAnimationStyle)
      ) {
        setHeaderHeight(0);
        return;
      }

      const headerBottom = getHeaderBottomPosition();

      if (headerBottom >= 0 && !isMobileScreen) {
        setHeaderHeight(headerBottom);
      } else {
        setHeaderHeight(0);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component is unmounted
    // Remove eventListener and overflow-hidden class from the body when the modal is closed
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.classList.remove('overflow-y-hidden!');
    };

    // 'desktopAnimationStyle' and 'mobileAnimationStyle', Here these defined as AnimationStyle, here onScroll we are passing null as value, so there is no need to add in dependencies.
    // "handleKeyDown" is function, so we can ignore react-hooks/exhaustive-deps warning for this suggested dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, currentScreenWidth, modalContentRef]);

  const ModalSizeClasses: Record<ModalSize, string> = {
    'extra-large': 'w-screen h-screen',
    large: 'w-full md:w-[50vw] h-auto max-h-[540px] md:max-h-[680px]',
    medium: 'w-full md:w-[33vw] h-auto max-h-[540px] md:max-h-[540px]',
    fluid: 'w-auto h-auto max-w-[1200px] max-h-[90vh]',
    genericCard: 'w-full md:w-[65vw] md:max-w-[1199px] h-auto max-h-[540px] md:max-h-[753px]',
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  const handleOverlayClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const transformStyle: Record<AnimationStyle, { [key: string]: string }> = {
    'slide-in-top': {
      height: `calc(100vh - ${headerHeight}px)`,
      transform: isModalOpen ? `translateY(${headerHeight}px)` : `translateY(calc(-120%))`,
    },
    'slide-in-bottom': {
      height: `calc(100vh - ${headerHeight}px)`,
      transform: isModalOpen
        ? `translateY(${headerHeight}px)`
        : `translateY(calc(120% + ${headerHeight}px))`,
    },
  };

  // function to return inline style of height and transform based on animation style
  function getAnimationCss() {
    let animationCss = {};

    if (
      currentScreenWidth <= getBreakpoint('md') &&
      mobileAnimationStyle &&
      size === 'extra-large'
    ) {
      animationCss = transformStyle[mobileAnimationStyle];
    }
    if (
      currentScreenWidth > getBreakpoint('md') &&
      desktopAnimationStyle &&
      size === 'extra-large'
    ) {
      animationCss = transformStyle[desktopAnimationStyle];
    }
    return animationCss;
  }

  function getDisplayClass(): 'flex' | 'hidden' | 'inline! relative! h-auto! w-full!' {
    let display: 'hidden' | 'flex' = 'hidden';

    if (
      ((!isMobile && desktopAnimationStyle) || (isMobile && mobileAnimationStyle)) &&
      size === 'extra-large'
    ) {
      return display;
    }

    if (isEditing) {
      return 'inline! relative! h-auto! w-full!';
    }

    display = isModalOpen ? 'flex' : 'hidden';
    return display;
  }

  return (
    <dialog
      id={modalLabel ?? ''}
      style={{
        ...getAnimationCss(),
      }}
      className={classNames(
        'fixed top-0 left-0 z-10001 h-screen w-screen transform items-center justify-center bg-transparent',
        getDisplayClass(),
        'transform transition-transform duration-500 ease-in-out',
        // z-index less then header (999) if sliding from top
        desktopAnimationStyle === 'slide-in-top' && size === 'extra-large'
          ? 'md:z-998'
          : 'md:z-1000'
      )}
      aria-modal="true"
      aria-label={`Close ${modalLabel ?? 'modal'}`}
      ref={modalWrapperRef}
    >
      {/* Backdrop for overlay clicks */}
      <input
        type="button"
        className={classNames('absolute inset-0 bg-black bg-opacity-75', customOverlayclass)}
        onClick={handleOverlayClick}
        aria-label="Close modal"
        style={{ cursor: 'pointer' }}
      />
      <div
        ref={modalContentRef}
        style={
          ((isMobile && mobileAnimationStyle) || (!isMobile && desktopAnimationStyle)) &&
          size === 'extra-large'
            ? { height: `calc(100vh - ${headerHeight}px)` }
            : {}
        }
        className={classNames(
          'relative z-10 flex flex-col overflow-y-auto bg-white md:mx-auto',
          size !== 'extra-large' && 'mx-4',
          ModalSizeClasses[size] ?? '',
          customContentWrapperclass
        )}
      >
        {showCloseButton ? (
          <div
            className={classNames(closeIconWrapperClasses ?? 'flex h-[40px] w-full justify-end')}
          >
            <button
              className={classNames(closeIconClasses ?? 'mt-m mr-m')}
              onClick={(e) => {
                e.preventDefault();
                handleClose();
              }}
            >
              <SvgIcon icon="close" size="lg" />
            </button>
          </div>
        ) : null}
        <div
          className={classNames(
            displayCloseBar ? '!pb-l' : '',
            desktopAnimationStyle ? 'md:pb-l' : 'md:pb-0',
            mobileAnimationStyle ? 'pb-l' : 'pb-0'
          )}
        >
          {children}
        </div>
        {displayCloseBar && (
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClose();
            }}
            className="sticky bottom-0 z-10 mt-auto flex w-full items-center justify-center gap-xxxs border-t border-gray bg-white py-2.5 md:bg-primary"
          >
            <span className="font-serif text-button font-bold">Close</span>
            <SvgIcon icon="dropdown-arrow" />
          </button>
        )}
      </div>
    </dialog>
  );
};

export default ModalWrapper;
