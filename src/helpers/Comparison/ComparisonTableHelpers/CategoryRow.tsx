import { Link } from '@sitecore-content-sdk/nextjs';
import PriceLevel from 'helpers/PriceLevel/PriceLevel';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import { isSvgUrl } from 'lib/utils/url-utils/is-svg-url';
import Image from 'next/image';

import { CategoryDataItem, CategoryDataProps } from './ComparisonTable.Types';
import { Swatches } from './Swatches';

const guidRegex =
  /^\{[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\}$/;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderNestedEntry = (_item: any, _itemIndex: number) => {
  if (typeof _item === 'string') {
    if (guidRegex.test(_item)) {
      return null;
    }
    return (
      <RichTextWrapper key={_itemIndex} classes="text-small!" field={{ value: _item ?? '' }} />
    );
  }
  if ('src' in _item) {
    return (
      <Image
        key={_itemIndex}
        src={_item.src}
        width={_item.width}
        height={_item.height}
        unoptimized={isSvgUrl(_item.src)}
        alt={_item.alt}
      />
    );
  }
  return null;
};

/** One entry of an array value: nested array, link object, or plain string. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderArrayEntry = (item: any) => {
  if (Array.isArray(item)) {
    return item.map(renderNestedEntry);
  }
  if (item?.href) {
    // Render array of links
    return (
      <div className="text-primary">
        <Link field={item} />
      </div>
    );
  }
  return <RichTextWrapper classes="text-small!" field={{ value: (item as string) || '-' }} />;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderArrayValue = (data: any[]) => {
  if (data.length === 0) {
    return '-';
  }
  return data.map((item, index) => (
    <div className="py-xxxs" key={index}>
      {/* There can be array of items or item as a string */}
      {renderArrayEntry(item)}
    </div>
  ));
};

const renderPriceLevelValue = (priceLevel: string | undefined) => {
  if (!priceLevel) {
    return '-';
  }
  return (
    <PriceLevel
      priceLevel={Number.parseInt(priceLevel)}
      priceClasses="text-gray text-sm-xxs font-medium font-sans!"
      priceLevelClasses="text-black font-heavy"
    />
  );
};

const renderCellContent = (data: NonNullable<CategoryDataItem>) => {
  if (data.hasOwnProperty('priceLevel')) {
    return renderPriceLevelValue(data.priceLevel);
  }
  if (Array.isArray(data)) {
    return renderArrayValue(data);
  }
  if (typeof data === 'string') {
    return <RichTextWrapper classes="text-small!" field={{ value: data || '-' }} />;
  }
  if ('swatches' in data) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Swatches swatchesCollection={data} />
        {data.swatchCollectionComments && (
          <RichTextWrapper
            classes="text-small! mt-xxs"
            field={{ value: data.swatchCollectionComments }}
          />
        )}
      </div>
    );
  }
  if ('href' in data && 'text' in data) {
    return (
      <div className="text-primary">
        <Link field={data} />
      </div>
    );
  }
  return null;
};

/**
 * Renders a single comparison-table cell value. Shared with ComparisonSeriesChart
 * (the redesigned series chart) so both layouts render the same object data
 * shapes produced by getComparisonObject/getValueByKey identically.
 */
export const renderComparisonCellValue = (data: CategoryDataItem) => {
  if (!data) {
    return <div className="flex min-h-[48px] items-center justify-center">-</div>;
  }
  return <div>{renderCellContent(data)}</div>;
};

export const CategoryRow = (
  props: { data: CategoryDataProps } & { totalNumberOfSeries: number }
) => {
  return (
    <div className="flex w-full">
      {props.data?.length > 0 &&
        props.data.map((_data, index) => (
          <div
            className="relative my-xxs flex min-w-[50.1%] items-center justify-center border-r border-gray p-xs text-center text-small last:border-none ml:w-full ml:min-w-0"
            key={index}
          >
            {renderComparisonCellValue(_data)}
            {props.data?.length < props.totalNumberOfSeries && index === props.data?.length - 1 && (
              <div className="absolute left-full top-0 w-full pl-xxs pr-xs">&nbsp;</div>
            )}
          </div>
        ))}
    </div>
  );
};
