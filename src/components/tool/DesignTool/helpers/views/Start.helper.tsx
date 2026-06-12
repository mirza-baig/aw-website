// Global
import { Text } from '@sitecore-content-sdk/nextjs';
// Components
import BouncyCard from 'helpers/BouncyCard/BouncyCard';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { JSX } from 'react';
import { useTheme } from 'src/lib/context/ThemeContext';

import { DesignToolDataProps, DesignToolOptionDataProps } from '../DesignTool.helper';
import { DesignToolProps } from '../DesignTool.types';
import { StartTheme, StartThemeSubType } from './Start.theme';

export type DesignToolStartProps = DesignToolProps;

const GetStartOptions = (
  options: Array<DesignToolOptionDataProps | null> | undefined
): DesignToolOptionDataProps[] => {
  return (
    options
      ?.filter((option) => !option?.parentId)
      ?.map((option: DesignToolOptionDataProps) => option) ?? []
  );
};

export const Start = (props: DesignToolDataProps): JSX.Element => {
  const { themeData } = useTheme(StartTheme());
  const theme = (themeData as StartThemeSubType).classes;
  window.scrollTo(0, 0);

  return (
    <div className={theme.stepStart}>
      <div className={theme.stepContainer}>
        <h1 className={theme.stepHeading}>
          <Text field={props.heading} encode={false} />
        </h1>
        <div className={theme.stepWrapper}>
          {props.options &&
            GetStartOptions(props.options)?.map(
              (option: DesignToolOptionDataProps, index: number) => (
                <BouncyCard
                  {...option}
                  key={index}
                  mobileFullWidth={true}
                  additionalButtonClassName={theme.bouncyCardShadow}
                  additionalHeadingClassName={theme.bouncyCardHeadingAdditionalClass}
                  additionalCtaClassName=" hidden md:block "
                  ctaAlwaysVisible={true}
                >
                  <div className={theme.mobileOnlyCta}>
                    <Text field={option.heading}></Text>
                    <SvgIcon
                      icon="arrow-right"
                      size="18"
                      className={theme.mobileOnlyCtaIcon}
                    ></SvgIcon>
                  </div>
                </BouncyCard>
              )
            )}
        </div>
      </div>
    </div>
  );
};
