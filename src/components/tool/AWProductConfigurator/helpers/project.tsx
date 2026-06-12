import React, { JSX } from 'react';

interface Props {
  lineItemIds: string[];
  setAddNewLineItem: (addLine: boolean) => void;
  quoteNumber?: string;
}

export default function ProjectComponent({
  lineItemIds,
  setAddNewLineItem,
  quoteNumber,
}: Readonly<Props>): JSX.Element {
  // // Add the line item to the quote
  const handleAddNewLineItem = () => {
    // Set add line item to true
    setAddNewLineItem(true);
  };
  return (
    <div className="flex flex-col px-5 ml:px-12">
      <div className="mb-4 justify-center ml:justify-start">
        <span className="text-lg font-semibold">Line Item Ids Added to Quote # {quoteNumber}</span>
      </div>
      <div className="flex flex-col gap-3 bg-light-gray p-4">
        {lineItemIds.length > 0 && (
          <div className="added-to-quote-banner font-semibold">
            {lineItemIds.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-5">
        <button
          onClick={handleAddNewLineItem}
          className="cursor-pointer mr-m flex items-center justify-center whitespace-normal rounded-lg border-3 border-theme-btn-border bg-theme-btn-bg px-m py-2.25 font-sans text-button font-heavy text-black hover:border-theme-btn-border-hover hover:bg-theme-btn-bg-hover hover:text-theme-btn-text-hover"
        >
          <span className="mr-xxs">ADD ANOTHER</span>
          <span>
            <svg
              aria-label="Right Arrow Icon"
              width="15"
              height="12"
              viewBox="0 0 15 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.26343 1L13.2634 6L8.26343 11"
                stroke="currentColor"
                strokeWidth="2"
              ></path>
              <path d="M13.2634 6H0.263428" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
