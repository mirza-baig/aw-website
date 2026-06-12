import classNames from 'classnames';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

const Pagination = ({
  totalPages,
  currentPageIndex,
  setCurrentPageIndex,
  paginationClasses,
}: {
  totalPages: number;
  currentPageIndex: number;
  setCurrentPageIndex: Dispatch<SetStateAction<number>>;
  paginationClasses: { [key: string]: string };
}) => {
  const pagesToShow = 5;
  const [startIndexOfPages, setStartIndexOfPages] = useState(0);

  useEffect(() => {
    if (currentPageIndex >= pagesToShow) {
      setStartIndexOfPages(currentPageIndex - pagesToShow + 1);
    } else {
      setStartIndexOfPages(0);
    }
  }, [currentPageIndex]);

  const PageNumber = (props: { pageNumber: number }) => {
    const { pageNumber } = props;
    return (
      <button
        className={classNames(
          paginationClasses?.pageNumber,
          pageNumber === currentPageIndex && paginationClasses?.activePageNumber
        )}
        onClick={() => setCurrentPageIndex(pageNumber)}
      >
        {pageNumber + 1}
      </button>
    );
  };
  return (
    <div className={paginationClasses?.paginationWrapper}>
      <button
        className={classNames(
          paginationClasses?.navigationArrows,
          paginationClasses?.previousArrow
        )}
        onClick={() => {
          setCurrentPageIndex(currentPageIndex - 1);
        }}
        disabled={currentPageIndex === 0}
      >
        <SvgIcon icon="arrow-left" />
      </button>
      {Array.from(Array(Math.ceil(totalPages / pagesToShow)).keys()).map(
        (pageIndex) =>
          pageIndex > startIndexOfPages - 1 &&
          pageIndex < startIndexOfPages + 5 && (
            <div key={pageIndex}>
              <PageNumber pageNumber={pageIndex} />
            </div>
          )
      )}
      <button
        className={classNames(paginationClasses?.navigationArrows, paginationClasses?.nextArrow)}
        onClick={() => {
          setCurrentPageIndex(currentPageIndex + 1);
        }}
        disabled={
          totalPages <= pagesToShow || currentPageIndex === Math.ceil(totalPages / pagesToShow) - 1
        }
      >
        <SvgIcon icon="arrow-right" />
      </button>
    </div>
  );
};
export default Pagination;
