// Global
// Components
import { AttributeRendererProps, TextAttributeViewModel } from 'lib/renoworks';
import { useTheme } from 'src/lib/context/ThemeContext';

import { TextAttributeTheme, TextAttributeThemeSubType } from './PDT_TextAttribute.theme';

const TextAttribute = ({
  viewModel,
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
      {viewModel.description && (
        <p className={`${theme.copy} ${theme.earmark}`}>{viewModel.description}</p>
      )}
      <ul className={theme.optionsList}>
        {viewModel.options.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (option: any, index: number) => (
            <li className={theme.optionsListItem} key={`${option?.title}-${index}`}>
              <button
                className={`${theme.optionsListButton} ${
                  option.isSelected || option.isClicked
                    ? theme.optionsListButtonSelected
                    : theme.optionsListButtonUnselected
                }`}
                onClick={() => optionClicked(option, viewModel.options)}
              >
                <span className={theme.optionsListButtonText}>{option.title}</span>
              </button>
            </li>
          )
        )}
      </ul>
      {viewModel.note && <p className={theme.disclaimer}>{viewModel.note}</p>}
    </div>
  );
};

TextAttribute.nameString = 'TextAttribute';

export default TextAttribute;
