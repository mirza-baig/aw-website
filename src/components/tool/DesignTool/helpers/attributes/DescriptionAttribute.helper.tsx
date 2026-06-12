// Global
import { useTheme } from 'src/lib/context/ThemeContext';
import { AttributeRendererProps } from 'src/lib/renoworks';

// Components
import { DescriptionAttributeViewModel } from '../js/designtool';
import {
  DescriptionAttributeTheme,
  DescriptionAttributeThemeSubType,
} from './DescriptionAttribute.theme';

const DescriptionAttribute = ({ props }: AttributeRendererProps<DescriptionAttributeViewModel>) => {
  const { themeData } = useTheme(DescriptionAttributeTheme());
  const theme = (themeData as DescriptionAttributeThemeSubType).classes;

  return (
    <div className={theme.attributeOption}>
      <div className={theme.copy} dangerouslySetInnerHTML={{ __html: props.description }}></div>
    </div>
  );
};

DescriptionAttribute.nameString = 'DescriptionAttribute';

export default DescriptionAttribute;
