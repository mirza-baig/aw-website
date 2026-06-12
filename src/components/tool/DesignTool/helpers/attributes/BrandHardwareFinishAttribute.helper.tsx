// Global
import empty from 'src/assets/img/empty.png';
import { useTheme } from 'src/lib/context/ThemeContext';
// Components
import { AttributeRendererProps } from 'src/lib/renoworks';

import { BrandHardwareFinishAttributeViewModel } from '../js/designtool';
import {
  BrandHardwareFinishAttributeTheme,
  BrandHardwareFinishAttributeThemeSubType,
} from './BrandHardwareFinishAttribute.theme';

const BrandHardwareFinishAttribute = ({
  props,
  onUpdateOption,
}: AttributeRendererProps<BrandHardwareFinishAttributeViewModel>) => {
  const { themeData } = useTheme(BrandHardwareFinishAttributeTheme());
  const theme = (themeData as BrandHardwareFinishAttributeThemeSubType).classes;

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
              <li className={theme.listItem} key={index}>
                <button
                  className={theme.listItemButton}
                  onClick={() => optionClicked(option, props.options)}
                >
                  {option.image && (
                    <span
                      className={`${theme.listItemImageWrapper} ${
                        option.isSelected || option.isClicked ? theme.selected : theme.unselected
                      }`}
                    >
                      <div style={{ background: '#' + option.colorRgb, borderRadius: '50%' }}>
                        <img
                          className={theme.listItemImage}
                          src={option.image === 'empty' ? empty.src : option.image}
                          alt={option.title}
                          width={76}
                          height={76}
                        ></img>
                      </div>
                    </span>
                  )}
                  <span className={theme.listItemButtonText}>{option.title}</span>
                </button>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
};

BrandHardwareFinishAttribute.nameString = 'BrandHardwareFinishAttribute';

export default BrandHardwareFinishAttribute;
