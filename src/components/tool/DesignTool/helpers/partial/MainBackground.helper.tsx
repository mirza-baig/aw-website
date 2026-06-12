// Global
import ImageWrapper from 'helpers/Media/ImageWrapper';
import { useAsPath } from 'lib/hooks/use-as-path';
import { useContext } from 'react';
import { useTheme } from 'src/lib/context/ThemeContext';

// Components
import { DesignToolDataProps } from '../DesignTool.helper';
import { DesignToolContext } from '../DesignToolContext.helper';
import { MainBackgroundTheme, MainBackgroundThemeSubType } from './MainBackground.theme';
export const MainBackground = (props: DesignToolDataProps) => {
  const { designToolRouter } = useContext(DesignToolContext);

  const asPath = useAsPath();
  const currentStep = designToolRouter.getStep(asPath);

  const { themeData } = useTheme(MainBackgroundTheme(currentStep));
  const theme = themeData as MainBackgroundThemeSubType;

  return (
    <div className={theme.classes.wrapper}>
      <ImageWrapper
        image={props?.backgroundImage}
        additionalDesktopClasses={theme.classes.image}
      ></ImageWrapper>
      <div className={theme.classes.overlay}></div>
    </div>
  );
};
