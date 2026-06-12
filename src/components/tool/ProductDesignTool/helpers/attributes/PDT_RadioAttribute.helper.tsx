// Global
import { AttributeRendererProps, RadioAttributeViewModel } from 'lib/renoworks';
import { useTheme } from 'src/lib/context/ThemeContext';

// Components
import { RadioAttributeTheme, RadioAttributeThemeSubType } from './PDT_RadioAttribute.theme';
import styles from './product-design-tool.module.css';

const RadioAttribute = ({
  viewModel,
  onUpdateOption,
}: AttributeRendererProps<RadioAttributeViewModel>) => {
  const { themeData } = useTheme(RadioAttributeTheme());
  const theme = (themeData as RadioAttributeThemeSubType).classes;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optionClicked = (option: any, collection?: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onUpdateOption && onUpdateOption(option, collection);
  };

  return (
    <div className={theme.attributeOption}>
      {viewModel.description && <p className={theme.copy}>{viewModel.description}</p>}
      <div className={theme.radio}>
        <div className={theme.radioContainer}>
          <ul className={theme.radioList}>
            {viewModel.options.map(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (option: any, index: number) => (
                <li
                  className={`${theme.radioListItem} ${styles.radioItemMargin}`}
                  key={`${option?.title}-${index}`}
                >
                  <button
                    className={theme.radioListLabel}
                    onClick={() => optionClicked(option, viewModel.options)}
                  >
                    <span
                      className={
                        theme.radioText +
                        (option.isSelected || option.isClicked
                          ? styles.pdtRadioBorderSelected
                          : styles.pdtRadioBorderUnselected)
                      }
                    >
                      <span className={theme.radioName}>{option.title}</span>
                      <span className={theme.radioDesc}>{option.desc}</span>
                    </span>
                  </button>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
      {viewModel.note && <p className={theme.disclaimer}>{viewModel.note}</p>}
    </div>
  );
};

RadioAttribute.nameString = 'RadioAttribute';

export default RadioAttribute;
