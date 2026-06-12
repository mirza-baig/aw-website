// Global
// Components
import classNames from 'classnames';
import { SliderWrapper } from 'helpers/SliderWrapper/SliderWrapper';
import { AttributeRendererProps, SwatchAttributeViewModel } from 'lib/renoworks';
import empty from 'src/assets/img/empty.png';
import { useTheme } from 'src/lib/context/ThemeContext';
import { RenoworksKeys } from 'src/lib/renoworks/renoworks';

import { SwatchAttributeTheme, SwatchAttributeThemeSubType } from './PDT_SwatchAttribute.theme';

const SwatchAttribute = ({
  viewModel,
  onUpdateOption,
}: AttributeRendererProps<SwatchAttributeViewModel>) => {
  const { themeName, themeData } = useTheme(SwatchAttributeTheme());
  const theme = (themeData as SwatchAttributeThemeSubType).classes;

  const numberOfPages = () => {
    const result = Math.ceil(viewModel.options.length / pageSize);
    return result;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optionClicked = (option: any, collection?: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onUpdateOption && onUpdateOption(option, collection);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optionsForPage = (page: any) => {
    if (page === 0) {
      return viewModel.options.slice(0, pageSize);
    } else {
      const start = pageSize + (page - 1) * pageSize;
      return viewModel.options.slice(start, start + pageSize);
    }
  };

  const getPageSizeOverride = (renoworksKey: string) => {
    switch (renoworksKey) {
      case RenoworksKeys.GrilleStyle.name:
      case RenoworksKeys.ExteriorTrimProfile.name:
        return 4;
      default:
    }

    return viewModel.pageSize;
  };

  const pageSize = getPageSizeOverride(viewModel.renoworksKeyName);

  const getInitialSlide = () => {
    const numOfPages = pageSize > 0 ? numberOfPages() : 0;

    if (numOfPages > 1) {
      const slidePages = numOfPages;
      for (let currentPage = 0; currentPage <= slidePages; currentPage++) {
        const options = optionsForPage(currentPage);
        if (
          options.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (option: any) => {
              return !!option.isSelected || !!option.isClicked;
            }
          )
        ) {
          return currentPage;
        }
      }
    }

    return 0;
  };

  const sliderSettings = {
    infinite: false,
    className: theme.swiperContainer,
    prevArrow: undefined,
    nextArrow: undefined,
    initialSlide: getInitialSlide(),
  };

  return (
    <div className={theme.attributeOption}>
      {viewModel.description && <p className={theme.copy}>{viewModel.description}</p>}
      {pageSize > 0 ? (
        <SliderWrapper sliderSettings={sliderSettings} theme={themeName}>
          {[...Array(numberOfPages())].map((page: number, index: number) => (
            <div key={'slider_ul' + page + index}>
              <ul className={theme.optionsList}>
                {optionsForPage(index).map((option, index: number) => (
                  <li className={theme.optionsListItem} key={`${option?.title}-${index}`}>
                    <button
                      className={theme.optionsListButton}
                      onClick={() => optionClicked(option, optionsForPage(index))}
                    >
                      {option.image && (
                        <span
                          className={`${theme.optionsListImageWrapper} ${
                            option.isSelected || option.isClicked
                              ? theme.selected
                              : theme.unselected
                          }`}
                          style={{ background: '#' + option.colorRgb }}
                        >
                          {option.image != 'empty' ? (
                            <img
                              className={classNames(theme.optionsListImage, 'h-full w-full')}
                              src={option.image}
                              alt={option.title}
                              width={option.title === 'None' ? 101 : 94}
                              height={option.title === 'None' ? 101 : 150}
                            ></img>
                          ) : (
                            <img
                              className={theme.optionsListImage}
                              src={empty.src}
                              alt={option.title}
                              style={{ background: '#' + option.colorRgb }}
                            ></img>
                          )}
                        </span>
                      )}
                      <span className={theme.optionsListButtonText}>{option.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </SliderWrapper>
      ) : (
        <ul className={theme.optionsList}>
          {viewModel.options.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (option: any, index: number) => {
              return (
                <li className={theme.optionsListItem} key={`${option?.title}-${index}`}>
                  <button
                    className={theme.optionsListButton}
                    onClick={() => optionClicked(option, viewModel.options)}
                  >
                    {option.image && (
                      <span
                        className={`${theme.optionsListImageWrapper} ${
                          option.isSelected || option.isClicked ? theme.selected : theme.unselected
                        }`}
                        style={{ background: '#' + option.colorRgb }}
                      >
                        {option.image != 'empty' ? (
                          <img
                            className={theme.optionsListImage}
                            src={option.image}
                            alt={option.title}
                            width={option.title === 'None' ? 101 : 94}
                            height={option.title === 'None' ? 101 : 150}
                          ></img>
                        ) : (
                          <img
                            className={theme.optionsListImage}
                            src={empty.src}
                            alt={option.title}
                            style={{ background: '#' + option.colorRgb }}
                          ></img>
                        )}
                      </span>
                    )}
                    <span className={theme.optionsListButtonText}>{option.title}</span>
                  </button>
                </li>
              );
            }
          )}
        </ul>
      )}
      {viewModel.note && <p className={theme.disclaimer}>{viewModel.note}</p>}
    </div>
  );
};

SwatchAttribute.nameString = 'SwatchAttribute';

export default SwatchAttribute;
