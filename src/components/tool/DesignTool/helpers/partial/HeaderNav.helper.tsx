// Global
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { useAsPath } from 'lib/hooks/use-as-path';
import Link from 'next/link';
import { useContext } from 'react';
import { useTheme } from 'src/lib/context/ThemeContext';

// Components
import { DesignToolContext } from '../DesignToolContext.helper';
import { HeaderNavTheme, HeaderNavThemeSubType } from './HeaderNav.theme';

export const HeaderNav = () => {
  const { designToolRouter } = useContext(DesignToolContext);
  const { themeData } = useTheme(HeaderNavTheme());
  const theme = themeData as HeaderNavThemeSubType;
  const asPath = useAsPath();

  return (
    <ul className={theme.classes.nav}>
      <li className={theme.classes.navBack}>
        <Link
          href={designToolRouter.getBackRoute(asPath) ?? '#/'}
          className={theme.classes.navBackLink}
          aria-label="Go to previous step"
          title="Go to previous step"
        >
          <>
            <SvgIcon icon={'arrow-left'} className={theme.classes.navBackLinkIcon}></SvgIcon>
            Previous
          </>
        </Link>
      </li>
      <li className={theme.classes.navReset}>
        <Link
          href="#/"
          className={theme.classes.navResetLink}
          aria-label="Start over"
          title="Start over"
        >
          <>
            <SvgIcon icon={'reset'} className={theme.classes.navResetLinkIcon}></SvgIcon>Start Over
          </>
        </Link>
      </li>
    </ul>
  );
};
