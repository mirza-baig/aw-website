// Global
import { useContext } from 'react';
import { useTheme } from 'src/lib/context/ThemeContext';
// Components
import { AttributeRendererProps } from 'src/lib/renoworks';

import { DesignToolContext } from '../DesignToolContext.helper';
import { BrandHardwareAttributeViewModel } from '../js/designtool';
import {
  BrandHardwareAttributeTheme,
  BrandHardwareAttributeThemeSubType,
} from './BrandHardwareAttribute.theme';

const BrandHardwareAttribute = ({
  props,
  onUpdateOption,
}: AttributeRendererProps<BrandHardwareAttributeViewModel>) => {
  const { themeData } = useTheme(BrandHardwareAttributeTheme());
  const theme = (themeData as BrandHardwareAttributeThemeSubType).classes;
  const { previewImage } = useContext(DesignToolContext);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optionClicked = (option: any, collection?: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onUpdateOption && onUpdateOption(option, collection);
  };

  return (
    <div className={theme.attributeOption}>
      <ul className={theme.optionsList}>
        {props.options.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (option: any, index: number) => {
            return (
              <li
                className={
                  props.description.toLowerCase() !== 'brand collections'
                    ? theme.optionsListItem
                    : theme.brandCollectionOptionsListItem
                }
                key={index}
              >
                <button
                  className={theme.optionsListButton}
                  disabled={previewImage}
                  onClick={() => optionClicked(option, props.options)}
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
                          width={props.description.toLowerCase() !== 'brand collections' ? 96 : 300}
                          height={
                            props.description.toLowerCase() !== 'brand collections' ? 166 : 300
                          }
                        ></img>
                      </div>
                    </span>
                  )}
                  {props.description.toLowerCase() !== 'brand collections' && (
                    <span className={theme.optionsListButtonText}>{option.title}</span>
                  )}
                </button>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
};

BrandHardwareAttribute.nameString = 'BrandHardwareAttribute';

export default BrandHardwareAttribute;
