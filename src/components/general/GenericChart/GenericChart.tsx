'use client';

import {
  ComponentRendering,
  ImageField,
  LinkField,
  RichTextField,
  Text,
  TextField,
} from '@sitecore-content-sdk/nextjs';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import ImageWrapper, { ImageWrapperProps } from 'helpers/Media/ImageWrapper';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { mapSearchResults } from 'lib/graphql/mappers/map-search-results';
import { IntegratedGraphQlResult } from 'lib/graphql/types/integrated-graphql-result';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import { ItemSearchResults } from 'lib/graphql/types/item-search-results';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { GenericChartTheme, GetTextAlignment } from './GenericChart.theme';
import { BackgroundColor, TextAlignment } from './GenericChart.types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

const MAX_CHART_ROWS = 25;

type GenericChartColumnProps = Sitecore.Components.General.GenericChart.GenericChartColumn & {
  id?: string;
};

type GenericChartProps = ComponentProps &
  Sitecore.Components.General.GenericChart.GenericChart & {
    fields: Sitecore.Components.General.GenericChart.GenericChart['fields'] & {
      children: GenericChartColumnProps[];
    };
  };

type ChartFields = GenericChartProps['fields'] | undefined;

/**
 * Rows are authored as numbered fields (row1Title, row2Title, ...), so they can only be read by
 * building the field name at runtime. The casts are kept here so callers stay strongly typed.
 */
function getRowField<TField>(fields: ChartFields, name: string): TField | undefined {
  return (fields as unknown as Record<string, TField | undefined> | undefined)?.[name];
}

function getColumnContent(
  column: GenericChartColumnProps | undefined,
  rowNumber: number
): RichTextField | undefined {
  return (column?.fields as unknown as Record<string, RichTextField | undefined> | undefined)?.[
    `row${rowNumber}Content`
  ];
}

type ChartHeadingProps = {
  ariaLabel: string;
  link?: LinkField;
  tag: 'h3' | 'h4' | 'h5';
  text?: TextField;
  underlineOnHover?: boolean;
};

/**
 * Renders a chart title/subtitle, optionally wrapped in its link. When only the link is authored
 * its text is used as the heading instead.
 */
function ChartHeading({
  ariaLabel,
  link,
  tag: Tag,
  text,
  underlineOnHover = false,
}: Readonly<ChartHeadingProps>): JSX.Element {
  const textContent = <Text field={text} encode={false} />;

  if (!link?.value?.href) {
    if (!text?.value) {
      return <></>;
    }
    return <Tag>{textContent}</Tag>;
  }

  let heading: JSX.Element;
  if (!text?.value) {
    heading = <Tag>{link.value.text}</Tag>;
  } else if (underlineOnHover) {
    heading = (
      <Tag>
        <span className="border-black hover:border-b-2">{textContent}</span>
      </Tag>
    );
  } else {
    heading = <Tag>{textContent}</Tag>;
  }

  return (
    <LinkWrapper field={link} ariaLabel={{ value: ariaLabel }}>
      {heading}
    </LinkWrapper>
  );
}

type ChartImageProps = Pick<ImageWrapperProps, 'additionalDesktopClasses' | 'imageLayout'> & {
  ariaLabel: string;
  image?: ImageField;
  link?: LinkField;
};

function ChartImage({ ariaLabel, image, link, ...imageProps }: ChartImageProps): JSX.Element {
  const wrappedImage = <ImageWrapper image={image} {...imageProps} />;

  if (!link?.value?.href) {
    return wrappedImage;
  }

  return (
    <LinkWrapper field={link} ariaLabel={{ value: ariaLabel }}>
      {wrappedImage}
    </LinkWrapper>
  );
}

function ChartColumnTitles({
  column,
}: Readonly<{ column?: GenericChartColumnProps }>): JSX.Element {
  if (!column?.fields) {
    return <></>;
  }

  return (
    <>
      <ChartHeading
        tag="h3"
        text={column.fields.title}
        link={column.fields.titleLink}
        ariaLabel={column.fields.title?.value || 'Title Link'}
        underlineOnHover
      />
      <ChartHeading
        tag="h4"
        text={column.fields.subtitle}
        link={column.fields.subtitleLink}
        ariaLabel={column.fields.subtitle?.value || 'Subtitle Link'}
        underlineOnHover
      />
    </>
  );
}

function GenericChart_Default(props: GenericChartProps): JSX.Element {
  const fields = getComponentServerProps(props.rendering).fields;

  const alignment = getEnum<TextAlignment>(fields?.textAlignment) || 'left';
  const titleRowBackgroundColor =
    getEnum<BackgroundColor>(fields?.titleRowBackgroundColor) || 'black';
  const titleColumnBackgroundColor =
    getEnum<BackgroundColor>(fields?.titleColumnBackgroundColor) || 'gray';
  const { themeData } = useTheme(
    GenericChartTheme(titleRowBackgroundColor, titleColumnBackgroundColor, alignment)
  );

  const columns: GenericChartColumnProps[] = fields?.children ?? [];

  // Rows are authored per column, so the chart is as tall as its most populated column.
  let rowCount = 0;
  for (const column of columns) {
    let filledRows = 0;
    for (let row = 1; row <= MAX_CHART_ROWS; row++) {
      if (getColumnContent(column, row)?.value) {
        filledRows++;
      }
    }
    if (filledRows > rowCount) {
      rowCount = filledRows;
    }
  }

  const rowNumbers = Array.from({ length: rowCount }, (_, index) => index + 1);

  // Used to determine if we should write a <th></th> at the beginning of each row
  const hasRowTitles = rowNumbers.some(
    (rowNumber) => !!getRowField<TextField>(fields, `row${rowNumber}Title`)?.value
  );

  const hasColumnTitles = rowNumbers.some(
    (rowNumber) =>
      !!columns[rowNumber]?.fields?.title?.value || !!columns[rowNumber]?.fields?.subtitle?.value
  );

  const hasSchemaText = !!fields?.schemaName?.value && !!fields?.schemaDescription?.value;
  const hasImageRow = columns.some((column) => !!column.fields?.image?.value?.src);
  const hasImageColumn = rowNumbers.some(
    (rowNumber) => !!getRowField<ImageField>(fields, `row${rowNumber}Image`)?.value?.src
  );

  return (
    <Component
      sectionWrapperClasses={themeData.classes.section}
      variant="lg"
      backgroundVariant=""
      grid=" w-full "
      dataComponent="general/genericchart"
      {...props}
      fields={fields}
    >
      <Headline
        {...props}
        fields={fields}
        classes={' text-[26px] font-demi leading-[1.25] mb-[12px] md:text-[34px] '}
      />
      <BodyCopy
        {...props}
        fields={fields}
        classes={' hidden md:block text-[18px] leading-1.5] mb-[10px] '}
      />
      <div className="comparison-chart-table">
        {hasSchemaText && (
          <>
            <meta itemProp="name" content={fields?.schemaName?.value} />
            <meta itemProp="description" content={fields?.schemaDescription?.value} />
          </>
        )}

        <table className={themeData.classes.table}>
          {hasColumnTitles && (
            <thead>
              <tr className={themeData.classes.theadRow}>
                {hasImageColumn && <th className={themeData.classes.imageColumnHeader}>&nbsp;</th>}
                {hasRowTitles && <th>&nbsp;</th>}
                {columns.map((column, index) => (
                  <th
                    className={themeData.classes.rowHeader}
                    key={column.id ?? `chart-column-title-${index}`}
                  >
                    <ChartColumnTitles column={column} />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {hasImageRow && (
              <tr className={themeData.classes.imageRow}>
                {hasImageColumn && <td className={themeData.classes.imageColumn}>&nbsp;</td>}
                {hasRowTitles && <th>&nbsp;</th>}
                {columns.map((column, index) => (
                  <td
                    key={column.id ?? `chart-column-image-${index}`}
                    className={themeData.classes.imageCell}
                  >
                    <ChartImage
                      image={column?.fields?.image}
                      link={column?.fields?.imageLink}
                      ariaLabel="GenericChart image"
                      additionalDesktopClasses="lazy"
                      imageLayout="intrinsic"
                    />
                  </td>
                ))}
              </tr>
            )}
            {rowNumbers.map((rowNumber) => {
              const rowTitle = getRowField<TextField>(fields, `row${rowNumber}Title`);
              const rowTitleLink = getRowField<LinkField>(fields, `row${rowNumber}Link`);
              const rowSubtitle = getRowField<TextField>(fields, `row${rowNumber}Subtitle`);
              const rowSubtitleLink = getRowField<LinkField>(fields, `row${rowNumber}SubtitleLink`);
              const rowImage = getRowField<ImageField>(fields, `row${rowNumber}Image`);
              const rowImageLink = getRowField<LinkField>(fields, `row${rowNumber}ImageLink`);

              return (
                <tr className={themeData.classes.tableRow} key={`content-row-${rowNumber}`}>
                  {hasImageColumn && (
                    <td className={themeData.classes.imageColumn}>
                      {rowImage?.value?.src && (
                        <ChartImage image={rowImage} link={rowImageLink} ariaLabel="Row Image" />
                      )}
                    </td>
                  )}
                  {hasRowTitles && (
                    <th className={themeData.classes.columnHeader}>
                      <ChartHeading
                        tag="h4"
                        text={rowTitle}
                        link={rowTitleLink}
                        ariaLabel={rowTitleLink?.value?.text || 'Row Title Link'}
                      />
                      <ChartHeading
                        tag="h5"
                        text={rowSubtitle}
                        link={rowSubtitleLink}
                        ariaLabel={rowSubtitleLink?.value?.text || 'Row Subtitle Link'}
                      />
                    </th>
                  )}
                  {columns.map((column, index) => {
                    const textAlignment =
                      getEnum<TextAlignment>(column.fields?.textAlignment) || '';
                    const rowContent = getColumnContent(column, rowNumber) ?? { value: '' };

                    return (
                      <td
                        className={`${themeData.classes.tableData} ${GetTextAlignment(
                          textAlignment
                        )}`}
                        key={column.id ?? `chart-column-content-${index}`}
                      >
                        {hasColumnTitles && (
                          <div className={themeData.classes.mobileTitleColumn}>
                            <ChartColumnTitles column={column} />
                          </div>
                        )}
                        <RichTextWrapper
                          field={rowContent}
                          classes={themeData.classes.contentClass}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {fields?.footer?.value && (
        <div className={themeData.classes.footer}>
          <RichTextWrapper field={fields.footer} />
        </div>
      )}
    </Component>
  );
}

export const Default = withDatasourceCheck(GenericChart_Default);

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
    fields: ItemFieldResult[];
    children: ItemSearchResults<{
      id: string;
      template: { name: string };
      fields: ItemFieldResult[];
    }>;
  };
}>;

function getComponentServerProps(rendering: ComponentRendering): {
  fields?: GenericChartProps['fields'];
} {
  if (rendering.fields === undefined || !('data' in rendering.fields)) {
    return {};
  }

  const fields = rendering.fields as unknown as IntegratedGraphQl;

  const result = {
    fields: {
      ...mapItemFieldResultsToObject(fields.data.item.fields),
      children: mapSearchResults(fields.data.item.children, (child) => ({
        id: child.id,
        fields: {
          ...mapItemFieldResultsToObject(child.fields),
        },
      })),
    },
  };
  return result;
}
