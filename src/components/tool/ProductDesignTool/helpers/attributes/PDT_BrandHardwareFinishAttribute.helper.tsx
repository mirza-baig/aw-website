// Global
// Components
import { AttributeRendererProps, BrandHardwareFinishAttributeViewModel } from 'lib/renoworks';
import empty from 'src/assets/img/empty.png';
import { useTheme } from 'src/lib/context/ThemeContext';

import {
  BrandHardwareFinishAttributeTheme,
  BrandHardwareFinishAttributeThemeSubType,
} from './PDT_BrandHardwareFinishAttribute.theme';

const BrandHardwareFinishAttribute = ({
  viewModel,
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
        {viewModel.options.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (option: any, index: number) => {
            return (
              <li className={theme.listItem} key={`${option?.title}-${index}`}>
                <button
                  className={theme.listItemButton}
                  onClick={() => optionClicked(option, viewModel.options)}
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
      {viewModel.note && <p className={theme.disclaimer}>{viewModel.note}</p>}
    </div>
  );
};

BrandHardwareFinishAttribute.nameString = 'BrandHardwareFinishAttribute';

export default BrandHardwareFinishAttribute;
