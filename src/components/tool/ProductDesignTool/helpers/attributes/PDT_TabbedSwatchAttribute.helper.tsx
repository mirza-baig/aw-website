// Global
// Components
import { SliderWrapper } from 'helpers/SliderWrapper/SliderWrapper';
import { AttributeRendererProps, TabbedSwatchAttributeViewModel } from 'lib/renoworks';
import { useState } from 'react';
import empty from 'src/assets/img/empty.png';
import { useTheme } from 'src/lib/context/ThemeContext';

import {
  TabbedSwatchAttributeTheme,
  TabbedSwatchAttributeThemeSubType,
} from './PDT_TabbedSwatchAttribute.theme';

const TabbedSwatchAttribute = ({
  viewModel,
  onUpdateOption,
  attributeIndex,
  maxAttributeIndex,
}: AttributeRendererProps<TabbedSwatchAttributeViewModel>) => {
  const { themeName, themeData } = useTheme(TabbedSwatchAttributeTheme());
  const theme = (themeData as TabbedSwatchAttributeThemeSubType).classes;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const numberOfPages = (group: any) => {
    // Include +1 for the "more colors square"
    if (group.pageSize > 0) {
      return Math.ceil((group.options.length + 1) / group.pageSize);
    } else {
      return 0;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optionsForPage = (group: any, page: number) => {
    // The first page is one short to account for the "more colors square"
    if (page === 0) {
      return group.options.slice(0, group.pageSize - 1);
    } else {
      const start = group.pageSize - 1 + (page - 1) * group.pageSize;
      return group.options.slice(start, start + group.pageSize);
    }
  };

  const getInitialTab = () => {
    let returnValue: number | undefined = undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    viewModel.groups.forEach((group: any, index: number) => {
      if (returnValue != undefined) {
        return;
      }

      const numOfPages = numberOfPages(group);
      if (numOfPages > 1) {
        const slidePages = numOfPages;
        for (let currentPage = 1; currentPage <= slidePages; currentPage++) {
          const options = optionsForPage(group, currentPage);
          if (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            options.find((option: any) => {
              return !!option.isSelected || !!option.isClicked;
            })
          ) {
            returnValue = index;
          }
        }
      } else if (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        group.options.find((option: any) => {
          return !!option.isSelected || !!option.isClicked;
        })
      ) {
        returnValue = index;
      }
    });

    return returnValue ?? 0;
  };

  const getInitialSlide = () => {
    let returnValue = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    viewModel.groups.forEach((group: any) => {
      const numOfPages = numberOfPages(group);
      if (numOfPages > 1) {
        const slidePages = numOfPages;
        for (let currentPage = 0; currentPage <= slidePages; currentPage++) {
          const options = optionsForPage(group, currentPage);
          if (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            options.find((option: any) => {
              return !!option.isSelected || !!option.isClicked;
            })
          ) {
            returnValue = currentPage;
          }
        }
      }

      if (returnValue > 0) {
        return;
      }
    });

    return returnValue;
  };

  const initialTab = getInitialTab();

  const [currentTab, setCurrentTab] = useState({
    ...[...Array(maxAttributeIndex)]
      .map((_ind: number, index: number) => {
        return { [index as unknown as keyof typeof Object]: 0 };
      })
      .reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (accum: any, curr: any) => {
          return { ...accum, ...curr };
        }
      ),
    [attributeIndex as unknown as keyof typeof Object]: initialTab,
  });

  const selectTab = (index: number) => {
    setCurrentTab({ ...currentTab, [attributeIndex as unknown as keyof typeof Object]: index });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optionClicked = (option: any, collection?: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onUpdateOption && onUpdateOption(option, collection);
  };

  const sliderSettings = {
    infinite: false,
    className: theme.swiperContainer,
    prevArrow: undefined,
    nextArrow: undefined,
    initialSlide: getInitialSlide(),
  };
  return (
    <div className={`${theme.attributeOption} ${attributeIndex}`}>
      {viewModel.description && <p className={theme.copy}>{viewModel.description}</p>}
      {viewModel.groups.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (group: any, index: number) => (
          <span key={'span_group_button_' + index}>
            {viewModel.groups.length > 1 ? (
              <button
                onClick={() => selectTab(index)}
                className={
                  (currentTab[attributeIndex.toString()] == index
                    ? theme.tabActive
                    : theme.tabInactive) + theme.tabButton
                }
              >
                {group.title}
              </button>
            ) : (
              <p className={theme.copy}>{group.title}</p>
            )}
          </span>
        )
      )}
      {viewModel.groups.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (group: any, index: number) => (
          <span key={'span_group_' + index}>
            {currentTab[attributeIndex.toString()] === index && (
              <div>
                {group.pageSize > 0 ? (
                  <SliderWrapper sliderSettings={sliderSettings} theme={themeName}>
                    {[...Array(numberOfPages(group))].map(
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (page: any, indexOuter: number) => (
                        <ul className={theme.list} key={'ul' + page + indexOuter}>
                          {optionsForPage(group, indexOuter).map(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (option: any, indexInner: number) => (
                              <li className={theme.listItem} key={'li' + indexInner}>
                                <button
                                  className={theme.listItemButton}
                                  onClick={() =>
                                    optionClicked(option, optionsForPage(group, indexOuter))
                                  }
                                >
                                  {option.image && (
                                    <span
                                      className={`${theme.listItemImageWrapper} ${
                                        option.isSelected || option.isClicked
                                          ? theme.selected
                                          : theme.unselected
                                      }`}
                                    >
                                      <div
                                        style={{
                                          background: '#' + option.colorRgb,
                                          borderRadius: '50%',
                                        }}
                                      >
                                        {option.image != 'empty' ? (
                                          <img
                                            className={theme.listItemImage}
                                            src={option.image}
                                            alt={option.title}
                                            width={76}
                                            height={76}
                                          ></img>
                                        ) : (
                                          <div className={`${theme.listItemImage}`}>
                                            <img
                                              src={empty.src}
                                              alt={option.title}
                                              style={{ background: '#' + option.colorRgb }}
                                            ></img>
                                          </div>
                                        )}
                                      </div>
                                    </span>
                                  )}
                                  <span className={theme.listItemButtonText}>{option.title}</span>
                                </button>
                              </li>
                            )
                          )}
                        </ul>
                      )
                    )}
                  </SliderWrapper>
                ) : (
                  <ul className={theme.list}>
                    {group.options.map(
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (option: any, index: number) => (
                        <li className={theme.listItem} key={`${option?.title}-${index}`}>
                          <button
                            className={theme.listItemButton}
                            onClick={() => optionClicked(option, group.options)}
                          >
                            <span
                              className={`${theme.listItemImageWrapper} ${
                                option.isSelected || option.isClicked
                                  ? theme.selected
                                  : theme.unselected
                              }`}
                            >
                              <div
                                style={{ background: '#' + option.colorRgb, borderRadius: '50%' }}
                              >
                                {option.image != 'empty' ? (
                                  <img
                                    className={theme.listItemImage}
                                    src={option.image}
                                    alt={option.title}
                                    width={76}
                                    height={76}
                                  ></img>
                                ) : (
                                  <div className={`${theme.listItemImage}`}>
                                    <img src={empty.src} alt={option.title}></img>
                                  </div>
                                )}
                              </div>
                            </span>
                            <span className={theme.listItemButtonText}>{option.title}</span>
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                )}
                {group.note && <p className={theme.disclaimer}>{group.note}</p>}
              </div>
            )}
          </span>
        )
      )}
      {viewModel.note && <p className={theme.disclaimer}>{viewModel.note}</p>}
    </div>
  );
};

TabbedSwatchAttribute.nameString = 'TabbedSwatchAttribute';

export default TabbedSwatchAttribute;
