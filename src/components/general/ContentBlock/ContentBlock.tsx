'use client';

import classNames from 'classnames';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import { cta1ToButtonProps, cta2ToButtonProps, cta3ToButtonProps } from 'helpers/Button/Utils';
import ButtonGroup from 'helpers/ButtonGroup/ButtonGroup';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import { ComponentProps } from 'lib/component-props';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { getTheme } from 'lib/website/theme';
import { JSX } from 'react';

import { ContentBlockTheme } from './helpers/ContentBlock.theme';
import { BackgroundColor } from './helpers/ContentBlock.types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type ContentBlockProps = ComponentProps & Sitecore.Components.General.ContentBlock.ContentBlock;

function ContentBlock_Default(props: ContentBlockProps): JSX.Element {
  const backgroundColor = getEnum<BackgroundColor>(props.fields?.backgroundColor) ?? 'white';
  const legalCopyFont = props?.fields?.useLegalCopyFont?.value ?? false;
  const themeData = getTheme(
    props.page.customProps.theme,
    ContentBlockTheme(backgroundColor, props.fields)
  );

  return (
    <Component
      variant="full"
      gap="gap-x-0"
      padding="px-0"
      sectionWrapperClasses=""
      backgroundVariant={getEnum(props.fields?.backgroundColor) ?? ''}
      dataComponent="general/contentblock"
      {...props}
    >
      <div className={themeData.classes.contentWrapper}>
        <Headline useTag="h2" classes={themeData.classes.headlineClass} {...props} />
        <BodyCopy
          classes={classNames(themeData.classes.bodyClass)}
          refer={legalCopyFont ? 'legal-copy' : 'body-copy'}
          {...props}
        />
        <ButtonGroup
          cta1={cta1ToButtonProps(props, themeData.classes.buttonGroupClass.cta1Classes)}
          cta2={cta2ToButtonProps(props, themeData.classes.buttonGroupClass.cta2Classes)}
          cta3={cta3ToButtonProps(props, themeData.classes.buttonGroupClass.cta3Classes)}
          wrapperClasses={themeData.classes.buttonGroupClass.wrapper}
          ctaAlignment={props.fields?.ctaAlignment}
        />
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(ContentBlock_Default);
