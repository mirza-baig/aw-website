/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from '@sitecore-content-sdk/nextjs';
import { isSvgUrl } from 'lib/utils/url-utils/is-svg-url';
import Image from 'next/image';
import PriceLevel from 'src/helpers/PriceLevel/PriceLevel';
import { RichTextWrapper } from 'src/helpers/RichTextWrapper';

import { CategoryDataItem, CategoryDataProps } from './ComparisonTable.Types';
import { Swatches } from './Swatches';

export const CategoryRow = (props: {
  data: CategoryDataProps;
  totalNumberOfSeries: number;
  label?: string;
  rowIndex?: number;
}) => {
  const guidRegex =
    /^\{[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\}$/;

  const renderData = (data: CategoryDataItem) => {
    if (!data) {
      return <div className="flex min-h-[48px] items-center justify-center">—</div>;
    }
    return (
      <div>
        {data.hasOwnProperty('priceLevel') ? (
          data.priceLevel ? (
            <PriceLevel
              priceLevel={Number.parseInt(data.priceLevel)}
              priceClasses="text-[#ccc] text-sm-xxs font-medium !font-sans"
              priceLevelClasses="text-black font-heavy"
            />
          ) : (
            '—'
          )
        ) : Array.isArray(data) ? (
          data.length > 0 ? (
            data.map((item, index) => (
              <div className="py-xxxs" key={index}>
                {Array.isArray(item) ? (
                  item.map((_item: any, _itemIndex: number) =>
                    typeof _item === 'string' && guidRegex.test(_item) ? null : typeof _item ===
                      'string' ? (
                      <RichTextWrapper
                        key={_itemIndex}
                        classes="!text-small"
                        field={{ value: _item ?? '' }}
                      />
                    ) : (
                      'src' in _item && (
                        <Image
                          key={_itemIndex}
                          src={_item.src}
                          width={_item.width}
                          height={_item.height}
                          unoptimized={isSvgUrl(_item.src)}
                          alt={_item.alt}
                        />
                      )
                    )
                  )
                ) : item?.href ? (
                  <div className="text-primary">
                    <Link field={item} />
                  </div>
                ) : (
                  <RichTextWrapper
                    classes="!text-small"
                    field={{ value: (item as string) || '—' }}
                  />
                )}
              </div>
            ))
          ) : (
            '—'
          )
        ) : typeof data !== 'string' && 'swatches' in data ? (
          <div className="flex flex-col items-center justify-center">
            <Swatches swatchesCollection={data} />
            {data.swatchCollectionComments && (
              <RichTextWrapper
                classes="!text-small mt-xxs"
                field={{ value: data.swatchCollectionComments }}
              />
            )}
          </div>
        ) : typeof data !== 'string' && 'href' in data && 'text' in data ? (
          <div className="text-primary">
            <Link field={data} />
          </div>
        ) : (
          typeof data === 'string' && (
            <RichTextWrapper classes="!text-small" field={{ value: data || '—' }} />
          )
        )}
      </div>
    );
  };

  return (
    <div className="flex w-full items-stretch border-b border-[#e0e0e0] bg-white">
      {/* Row label column */}
      {props.label !== undefined && (
        <div className="flex min-w-[160px] max-w-[160px] items-center py-xs pl-s pr-xxs ml:min-w-[200px] ml:max-w-[200px]">
          <span className="!font-sans text-small font-regular text-[#333]">{props.label}</span>
        </div>
      )}
      {/* Data columns */}
      {props.data?.length > 0 &&
        props.data.map((_data, index) => (
          <div
            className="flex min-w-[50.1%] flex-1 items-center justify-center p-xs text-center text-small ml:min-w-0"
            key={index}
          >
            {renderData(_data)}
          </div>
        ))}
    </div>
  );
};
