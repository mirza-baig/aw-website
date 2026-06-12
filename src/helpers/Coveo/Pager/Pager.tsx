import { Pager as HeadlessPager } from '@coveo/headless';
import classNames from 'classnames';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { FunctionComponent, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface PagerProps {
  controller: HeadlessPager;
  pagerClasses?: {
    [property: string]: string | undefined;
  };
}

export const Pager: FunctionComponent<PagerProps> = (props) => {
  const { controller, pagerClasses } = props;
  const [state, setState] = useState(controller?.state);

  useEffect(() => controller?.subscribe(() => setState(controller.state)), [controller]);

  if (controller?.state.currentPages.length <= 1) {
    return <></>;
  }

  const handleScroll = () => {
    const videoGalleryElement = document.getElementById('globalVideoGallery');
    if (videoGalleryElement) {
      setTimeout(() => {
        videoGalleryElement.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav className={pagerClasses?.pagerWrapper}>
      <button
        className={classNames(
          pagerClasses?.navButton,
          pagerClasses?.previousButton,
          !state?.hasPreviousPage && pagerClasses?.disabledNavButton
        )}
        disabled={!state?.hasPreviousPage}
        onClick={() => {
          controller.previousPage();
          handleScroll();
        }}
        title="btn-previous"
      >
        <SvgIcon icon="arrow-left" size="md" />
      </button>
      {state?.currentPages.map((page) => (
        <button
          key={page}
          disabled={controller.isCurrentPage(page)}
          onClick={() => {
            controller.selectPage(page);
            handleScroll();
          }}
          className={twMerge(
            pagerClasses?.pageNumber,
            controller.isCurrentPage(page) && pagerClasses?.currentPage
          )}
          title="btn-page-number"
        >
          {page}
        </button>
      ))}
      <button
        className={classNames(
          pagerClasses?.navButton,
          pagerClasses?.nextButton,
          !state?.hasNextPage && pagerClasses?.disabledNavButton
        )}
        disabled={!state?.hasNextPage}
        onClick={() => {
          controller.nextPage();
          handleScroll();
        }}
        title="btn-next"
      >
        <SvgIcon icon="arrow-right" size="md" />
      </button>
    </nav>
  );
};
