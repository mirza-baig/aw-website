// Global
// Components
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { useTheme } from 'src/lib/context/ThemeContext';
import { AttributeRendererProps } from 'src/lib/renoworks';

import { TextAttributeViewModel } from '../js/designtool';
import { TextAttributeTheme, TextAttributeThemeSubType } from './TextAttribute.theme';

const TextAttribute = ({
  props,
  onUpdateOption,
}: AttributeRendererProps<TextAttributeViewModel>) => {
  const { themeData } = useTheme(TextAttributeTheme());
  const theme = (themeData as TextAttributeThemeSubType).classes;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optionClicked = (option: any, collection?: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onUpdateOption && onUpdateOption(option, collection);
  };

  return (
    <div className={theme.attributeOption}>
      {props.description && <p className={theme.copy}>{props.description}</p>}
      <ul className={theme.optionsList}>
        {props.options.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (option: any, index: number) => (
            <li className={theme.optionsListItem} key={index}>
              <button
                className={theme.optionsListButton}
                onClick={() => optionClicked(option, props.options)}
              >
                <span className={theme.optionsListButtonText}>{option.title}</span>
              </button>
              {(option.isSelected || option.isClicked) && (
                <SvgIcon
                  icon={'check'}
                  size="16"
                  className={theme.optionsListImageSelected + theme.optionsListImageSelectedBg}
                ></SvgIcon>
              )}
            </li>
          )
        )}
      </ul>
    </div>
  );
};

TextAttribute.nameString = 'TextAttribute';

export default TextAttribute;
