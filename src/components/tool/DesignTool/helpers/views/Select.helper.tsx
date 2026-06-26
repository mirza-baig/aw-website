// Global
import { Text } from '@sitecore-content-sdk/nextjs';
// Components
import BouncyCard from 'helpers/BouncyCard/BouncyCard';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { useAsPath } from 'lib/hooks/use-as-path';
import { JSX, useContext, useEffect } from 'react';
import { useTheme } from 'src/lib/context/ThemeContext';

import { DesignToolOptionDataProps } from '../DesignTool.helper';
import { DesignToolProductProps, DesignToolProps } from '../DesignTool.types';
import { DesignToolContext } from '../DesignToolContext.helper';
import { GetUrlParts } from '../js/utils';
import { Product } from '../partial/Product.helper';
import { SelectTheme, SelectThemeSubType } from './Select.theme';

export type DesignToolSelectProps = DesignToolProps;
export const Select = (props: DesignToolOptionDataProps): JSX.Element => {
  const { designToolRouter } = useContext(DesignToolContext);
  const options = designToolRouter?.routeData?.options ?? [];
  const products = designToolRouter?.routeData?.products ?? [];
  const asPath = useAsPath();
  const { themeData } = useTheme(SelectTheme());
  const theme = (themeData as SelectThemeSubType).classes;
  // Use this after Render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  if (props == null) {
    return <></>;
  }

  return (
    <div className={theme.stepSelect}>
      <div className={theme.stepContainer}>
        <h2 className={theme.stepHeading}>
          <Text field={props.step.heading} encode={false} />
        </h2>
        <div className={theme.stepCopy}>
          <RichTextWrapper field={props.step.copy} refer="" />
        </div>
        <h3 className={theme.stepSubhead}>
          <Text field={props.step.subhead} encode={false} />
        </h3>
        {options.length > 0 && (
          <div className={theme.stepWrapperOptions}>
            {options.map((option: DesignToolOptionDataProps, index: number) => (
              <BouncyCard
                {...option}
                key={index}
                additionalButtonClassName={theme.bouncyCardShadow}
                ctaOnClick={() => {
                  const urlParts = GetUrlParts(asPath);
                  globalThis.history.pushState(null, '', `${urlParts.pathName}#/${option.id}`);
                }}
              />
            ))}
          </div>
        )}
        {products.length > 0 && (
          <div className={theme.stepWrapperProducts}>
            {products.map((product: DesignToolProductProps, index: number) => (
              <Product {...product} key={index} />
            ))}
          </div>
        )}
      </div>
      <a
        href="#/"
        className={theme.mobileResetBtn}
        onClick={(e) => {
          e.preventDefault();
          designToolRouter.goToStart(asPath);
        }}
        title="Start Over"
        aria-label="Start Over"
      >
        <SvgIcon icon={'reset'} size="28" className={theme.mobileResetBtnIcon}></SvgIcon>
      </a>
    </div>
  );
};
