// Global
import ImageWrapper from 'helpers/Media/ImageWrapper';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { useTheme } from 'src/lib/context/ThemeContext';

// Components
import { DesignToolDataProps } from '../DesignTool.helper';
import { HeaderLogoTheme, HeaderLogoThemeSubType } from './HeaderLogo.theme';

export type DesignToolHeaderLogoProps = {
  props: DesignToolDataProps;
  navigationVisible: boolean;
  setNavigationVisible: Dispatch<SetStateAction<boolean>>;
};

export const HeaderLogo = ({
  props,
  navigationVisible,
  setNavigationVisible,
}: DesignToolHeaderLogoProps) => {
  const { themeData } = useTheme(HeaderLogoTheme());
  const theme = themeData as HeaderLogoThemeSubType;
  const pathname = usePathname(); // e.g. "/design-tool"
  const searchParams = useSearchParams(); // URLSearchParams
  // Build a single string that mimics asPath
  const asPath = `${pathname ?? ''}${searchParams?.toString() ? `?${searchParams}` : ''}`;

  const showHeader = () => {
    const header = document.querySelector('header #header');
    header?.classList?.add('visible');
    const breadcrumbs = document.querySelector('header #header .my-8');
    breadcrumbs?.classList?.add('visible');

    document?.body?.classList?.add('design-tool-2-navigation-visible');
    setNavigationVisible(true);
  };

  return !navigationVisible ? (
    <Link
      href={asPath}
      className={theme.classes.logoLink}
      title="Show Navigation"
      aria-label="Show Navigation"
      onClick={showHeader}
    >
      <ImageWrapper
        image={props?.logoImage}
        imageLayout="intrinsic"
        additionalDesktopClasses={theme.classes.imageWrapper}
      ></ImageWrapper>
    </Link>
  ) : (
    <></>
  );
};
