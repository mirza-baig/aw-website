'use client';

import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import { cta1ToButtonProps, cta2ToButtonProps } from 'helpers/Button/Utils';
import ButtonGroup from 'helpers/ButtonGroup/ButtonGroup';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import useExperienceEditor from 'lib/utils/use-experience-editor';

import { PromoFlipsnackViewerTheme } from './helpers/PromoFlipsnackViewer.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type ImagePosition = 'right' | 'left';

type PromoFlipsnackViewerProps = ComponentProps &
  Sitecore.Components.Promo.PromoFlipsnackViewer.PromoFlipsnackViewer;

function PromoFlipsnackViewer_Default(props: PromoFlipsnackViewerProps) {
  const flipsnackLeftAlign =
    (getEnum<ImagePosition>(props?.fields?.flipsnackPlacement) ?? 'right') == 'left';
  const { themeData } = useTheme(PromoFlipsnackViewerTheme(flipsnackLeftAlign));

  const baseUrl =
    props?.fields?.flipsnackBaseSrc?.value?.length > 0
      ? props?.fields?.flipsnackBaseSrc?.value
      : `https://cdn.flipsnack.com/widget/v2/widget.html`;
  const srcUrl =
    baseUrl +
    (baseUrl.indexOf('?') >= 0 ? '&' : '?') +
    `hash=${props?.fields?.flipsnackId?.value}&t=${props?.fields?.flipsnackVersion?.value}`;
  const isEE = useExperienceEditor();

  // We want to use iframeTitle if it exists, otherwise fallback to headlineText including when
  // it is just a blank space.
  // sonarqube-disable-next-line typescript:S6606
  const iframeTitle = props?.fields?.iframeTitle?.value || props?.fields?.headlineText?.value;
  return (
    <Component variant="lg" dataComponent="promo/promoflipsnackviewer" {...props}>
      <div className={themeData.classes.iframeContainer}>
        <iframe
          className={themeData.classes.iframe}
          src={srcUrl}
          seamless={true}
          allowFullScreen={true}
          loading="lazy"
          title={iframeTitle}
          height={'200px'}
        ></iframe>
      </div>
      <div className={themeData.classes.copyContainer}>
        <Headline classes={themeData.classes.headline} {...props} />
        {(isEE || props.fields?.body) && <BodyCopy classes={themeData.classes?.body} {...props} />}
        {(isEE || props.fields?.cta1Link) && (
          <ButtonGroup
            cta1={cta1ToButtonProps(props, themeData.classes.buttonGroupClasses.cta1Classes)}
            cta2={cta2ToButtonProps(props, themeData.classes.buttonGroupClasses.cta2Classes)}
            wrapperClasses={themeData.classes.buttonGroupClasses.wrapper}
          />
        )}
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(PromoFlipsnackViewer_Default);
