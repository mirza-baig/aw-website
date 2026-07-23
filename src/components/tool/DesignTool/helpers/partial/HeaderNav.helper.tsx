// Global
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { useAsPath } from 'lib/hooks/use-as-path';
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
  const backHref = designToolRouter.getBackRoute(asPath) ?? '#/';

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    globalThis.history.pushState(null, '', backHref);
  };

  const handleStartOverClick = (e: React.MouseEvent) => {
    e.preventDefault();
    designToolRouter.goToStart(asPath);
  };

  return (
    <ul className={theme.classes.nav}>
      <li className={theme.classes.navBack}>
        <a
          href={backHref}
          className={theme.classes.navBackLink}
          aria-label="Go to previous step"
          title="Go to previous step"
          onClick={handleBackClick}
        >
          <>
            <SvgIcon icon={'arrow-left'} className={theme.classes.navBackLinkIcon}></SvgIcon>
            Previous
          </>
        </a>
      </li>
      <li className={theme.classes.navReset}>
        <a
          href="#/"
          className={theme.classes.navResetLink}
          aria-label="Start over"
          title="Start over"
          onClick={handleStartOverClick}
        >
          <>
            <SvgIcon icon={'reset'} className={theme.classes.navResetLinkIcon}></SvgIcon>Start Over
          </>
        </a>
      </li>
    </ul>
  );
};
