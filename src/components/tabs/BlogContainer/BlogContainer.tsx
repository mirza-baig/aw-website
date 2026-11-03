import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { BlogContainerClient } from './helpers/BlogContainerClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';
import componentMap from '.sitecore/component-map';

type BlogContainerProps = ComponentProps & Sitecore.Components.Tabs.BlogContainer.BlogContainer;

function BlogContainer_Default(props: BlogContainerProps): JSX.Element {
  const phKey = `blogcontainer-${props.params?.DynamicPlaceholderId}`;
  return (
    <BlogContainerClient fields={props.fields} rendering={props.rendering} page={props.page}>
      <AppPlaceholder
        name={phKey}
        rendering={props.rendering}
        page={props.page}
        componentMap={componentMap}
      />
    </BlogContainerClient>
  );
}

export const Default = withDatasourceCheck(BlogContainer_Default);
