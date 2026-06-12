// Global
import { SliderWrapper } from 'helpers/SliderWrapper';
import { SliderRefType, SliderType } from 'helpers/SliderWrapper/SliderWrapper';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { useRef } from 'react';
import empty from 'src/assets/img/empty.png';
import { useTheme } from 'src/lib/context/ThemeContext';
// Components
import { AttributeRendererProps } from 'src/lib/renoworks';

import { DependentSwatchAttributeViewModel } from '../js/designtool';
import {
  DependentSwatchAttributeTheme,
  DependentSwatchAttributeThemeSubType,
} from './DependentSwatchAttribute.theme';

const DependentSwatchAttribute = ({
  props,
  onUpdateOption,
}: AttributeRendererProps<DependentSwatchAttributeViewModel>) => {
  const { themeName, themeData } = useTheme(DependentSwatchAttributeTheme());
  const theme = (themeData as DependentSwatchAttributeThemeSubType).classes;

  const numberOfPages = () => {
    // Include +1 for the "more colors square"
    if (props.pageSize > 0) {
      return Math.ceil((props.options.length + 1) / props.pageSize);
    } else {
      return 0;
    }
  };

  const optionsForPage = (page: number) => {
    // The first page is one short to account for the "more colors square"
    if (page === 0) {
      return props.options.slice(0, props.pageSize - 1);
    } else {
      const start = props.pageSize - 1 + (page - 1) * props.pageSize;
      return props.options.slice(start, start + props.pageSize);
    }
  };

  const getInitialSlide = () => {
    const numOfPages = numberOfPages();
    if (numOfPages > 1) {
      const slidePages = numOfPages;
      for (let currentPage = 0; currentPage <= slidePages; currentPage++) {
        const options = optionsForPage(currentPage);
        if (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          options.find((option: any) => {
            return !!option.isSelected || !!option.isClicked;
          })
        ) {
          return currentPage;
        }
      }
    }

    return 0;
  };

  const moreCount = () => {
    return props.options.length - props.pageSize + 1;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optionClicked = (option: any, collection?: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onUpdateOption && onUpdateOption(option, collection);
  };

  const sliderSettings = {
    infinite: false,
    className: theme.swiperWrapper,
    prevArrow: undefined,
    nextArrow: undefined,
    initialSlide: getInitialSlide(),
  };

  const slider = useRef<SliderType>(null);

  const slideNext = () => {
    if (slider.current) {
      slider.current.slickNext();
    }
  };

  return (
    <div className={theme.attributeOption}>
      {props.description && <p className={theme.copy}>{props.description}</p>}
      <div className={theme.container}>
        <div className={theme.containerControl}>
          <span className={theme.title}>{props.selectedControlOption?.title}</span>
          {props.selectedControlOption && props.selectedControlOption.image && (
            <div style={{ background: '#' + props.selectedControlOption.colorRgb }}>
              <img
                className={theme.controlImage}
                src={props.selectedControlOption.image}
                alt={props.selectedControlOption.title}
                width={291}
                height={324}
              ></img>
            </div>
          )}
          <SvgIcon
            icon={'check'}
            size="16"
            className={theme.listItemImageSelected + theme.listItemImageSelectedBg}
          ></SvgIcon>
        </div>
        <div className={theme.swiperContainer}>
          {props.pageSize > 0 ? (
            <SliderWrapper
              sliderSettings={sliderSettings}
              sliderRef={slider as SliderRefType}
              theme={themeName}
            >
              {[...Array(numberOfPages())].map((page: number, index: number) => (
                <div key={'slider_wrapper_' + page + index}>
                  <ul className={theme.list}>
                    {optionsForPage(index).map(
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (option: any, index: number) => (
                        <li className={theme.listItem} key={index}>
                          <button
                            className={theme.listItemButton}
                            onClick={() => optionClicked(option, optionsForPage(index))}
                          >
                            {option.image && (
                              <span className={theme.listItemImageWrapper}>
                                <div style={{ background: '#' + option.colorRgb }}>
                                  {option.image != 'empty' ? (
                                    <img
                                      className={theme.listItemImage}
                                      src={option.image}
                                      alt={option.title}
                                      width={79}
                                      height={79}
                                    ></img>
                                  ) : (
                                    <img
                                      className={theme.listItemImage}
                                      src={empty.src}
                                      alt={option.title}
                                      style={{ background: '#' + option.colorRgb }}
                                    ></img>
                                  )}
                                </div>
                                {(option.isSelected || option.isClicked) && (
                                  <SvgIcon
                                    icon={'check'}
                                    size="16"
                                    className={
                                      theme.listItemImageSelected + theme.listItemImageSelectedBg
                                    }
                                  ></SvgIcon>
                                )}
                              </span>
                            )}
                            <span className={theme.listItemTitle}>{option.title}</span>
                          </button>
                        </li>
                      )
                    )}
                    {index === 0 && (
                      <li className={theme.listMore} onClick={slideNext}>
                        <span className={theme.listMoreImageWrapper}>
                          <span className={theme.listMoreText}>
                            <p className={theme.listMoreTextNumber}>+{moreCount()}</p>
                            <p className={theme.listMoreTextMore}>more</p>
                          </span>
                          <img
                            className={theme.listMoreImage}
                            loading="lazy"
                            src={empty.src}
                            alt={'+' + moreCount().toString()}
                          ></img>
                        </span>
                        <span></span>
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </SliderWrapper>
          ) : (
            <ul className={theme.list}>
              {props.options.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (option: any, index: number) => (
                  <li className={theme.listItem} key={index}>
                    <button
                      className={theme.listItemButton}
                      onClick={() => optionClicked(option, props.options)}
                    >
                      {option.image && (
                        <span className={theme.listItemImageWrapper}>
                          <div style={{ background: '#' + option.colorRgb }}>
                            {option.image != 'empty' ? (
                              <img
                                className={theme.listItemImage}
                                src={option.image}
                                alt={option.title}
                                width={79}
                                height={79}
                              ></img>
                            ) : (
                              <img
                                className={theme.listItemImage}
                                src={empty.src}
                                alt={option.title}
                                style={{ background: '#' + option.colorRgb }}
                              ></img>
                            )}
                          </div>
                          {(option.isSelected || option.isClicked) && (
                            <SvgIcon
                              icon={'check'}
                              size="16"
                              className={
                                theme.listItemImageSelected + theme.listItemImageSelectedBg
                              }
                            ></SvgIcon>
                          )}
                        </span>
                      )}
                      <span className={theme.listItemTitle}>{option.title}</span>
                    </button>
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

DependentSwatchAttribute.nameString = 'DependentSwatchAttribute';

export default DependentSwatchAttribute;
