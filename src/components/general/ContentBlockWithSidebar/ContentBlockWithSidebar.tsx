'use client';

import { Text } from '@sitecore-content-sdk/nextjs';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import RichTextWrapper from 'helpers/RichTextWrapper/RichTextWrapper';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';

import { ContentBlockWithSidebarTheme } from './helpers/ContentBlockWithSidebar.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type ContentBlockWithSidebarProps = ComponentProps &
  Sitecore.Components.General.ContentBlockWithSidebar.ContentBlockWithSidebar;

function ContentBlockWithSidebar_Default(props: ContentBlockWithSidebarProps) {
  const { themeData } = useTheme(ContentBlockWithSidebarTheme);

  return (
    <Component
      variant="lg"
      backgroundVariant=""
      sectionWrapperClasses=""
      gap=""
      dataComponent="general/contentblockwithsidebar"
      {...props}
    >
      <div className={themeData.classes.leftColumnClass}>
        <Headline useTag="h2" classes={themeData.classes.headlineClass} {...props} />
        <BodyCopy {...props} />
      </div>

      <div className={themeData.classes.rightColumnClass}>
        <Text
          tag={'h3'}
          className={themeData.classes.subheadlineClass}
          field={props.fields?.sideBarSubheading}
        />
        <div>
          <RichTextWrapper
            classes={themeData.classes.subBodyClass}
            field={props.fields?.sideBarBodyCopy}
          />
        </div>
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(ContentBlockWithSidebar_Default);
