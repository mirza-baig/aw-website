// Global
// Components
import { AttributeRendererProps, BrandHardwareAttributeViewModel } from 'lib/renoworks';
import {} from 'lib/utils/linq/array';
import React from 'react';
import { useTheme } from 'src/lib/context/ThemeContext';

import {
  BrandHardwareAttributeTheme,
  BrandHardwareAttributeThemeSubType,
} from './PDT_BrandHardwareAttribute.theme';

const PDT_BrandHardwareAttribute = ({
  viewModel,
  onUpdateOption,
}: AttributeRendererProps<BrandHardwareAttributeViewModel>) => {
  const { themeData } = useTheme(BrandHardwareAttributeTheme());
  const theme = (themeData as BrandHardwareAttributeThemeSubType).classes;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optionClicked = (option: any, collection?: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onUpdateOption && onUpdateOption(option, collection);
  };

  let tabDescription = viewModel.description ? viewModel.description : '';
  tabDescription = tabDescription.toString().toLowerCase();

  return (
    <div className={theme.attributeOption}>
      <ul className={theme.optionsList}>
        {viewModel.options.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (option: any, index: number) => {
            return (
              <li
                className={
                  tabDescription !== 'brand collections'
                    ? theme.optionsListItem
                    : theme.brandCollectionOptionsListItem
                }
                key={`${option?.title}-${index}`}
              >
                <button
                  className={theme.optionsListButton}
                  onClick={() => optionClicked(option, viewModel.options)}
                >
                  {option.image && (
                    <span
                      className={`${theme.optionsListImageWrapper} ${
                        option.isSelected || option.isClicked ? theme.selected : theme.unselected
                      }`}
                    >
                      <div style={{ background: '#' + option.colorRgb }}>
                        <img
                          className={theme.optionsListImage}
                          src={option.image}
                          alt={option.title}
                          width={tabDescription !== 'brand collections' ? 96 : 300}
                          height={tabDescription !== 'brand collections' ? 166 : 300}
                        ></img>
                      </div>
                    </span>
                  )}
                  {tabDescription !== 'brand collections' && (
                    <span className={theme.optionsListButtonText}>{option.title}</span>
                  )}
                </button>
              </li>
            );
          }
        )}
      </ul>
      {viewModel.note && <p className={theme.disclaimer}>{viewModel.note}</p>}
    </div>
  );
};

PDT_BrandHardwareAttribute.nameString = 'BrandHardwareAttribute';

export default PDT_BrandHardwareAttribute;
