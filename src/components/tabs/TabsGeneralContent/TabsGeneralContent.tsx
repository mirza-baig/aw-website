import {
  AppPlaceholder,
  ComponentRendering,
  LayoutServiceData,
  NextjsContentSdkComponent,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { NestedComponentPropsService, NextContext } from 'lib/utils/nested-component-props-service';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';

import { Tab } from './helpers/tab';
import { TabsGeneralContentClient } from './helpers/TabsGeneralContentClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';
import components, { componentMap } from '.sitecore/component-map';

type TabsGeneralContentProps = ComponentProps &
  Sitecore.Components.Tabs.TabsGeneralContent.TabsGeneralContent & {
    tabs: Tab[];
  };

async function TabsGeneralContent_Default(props: Omit<TabsGeneralContentProps, 'tabs'>) {
  const tabs = await getComponentServerProps(
    props.rendering,
    props.layout,
    props.context,
    components
  );

  const dynamicPlaceholderId = props.params?.DynamicPlaceholderId;
  const phKey = dynamicPlaceholderId ? `tabs-general-content-${dynamicPlaceholderId}` : undefined;

  return (
    <TabsGeneralContentClient
      fields={props.fields}
      rendering={props.rendering}
      page={props.page}
      tabs={tabs}
      placeholder={
        phKey ? (
          <AppPlaceholder
            name={phKey}
            rendering={props.rendering}
            page={props.page}
            componentMap={componentMap}
          />
        ) : null
      }
    />
  );
}

export const Default = withDatasourceCheck(TabsGeneralContent_Default);

async function getComponentServerProps(
  rendering: ComponentRendering,
  _layout: LayoutServiceData,
  context: NextContext,
  components: Map<string, NextjsContentSdkComponent>
) {
  const tabPropsService = new NestedComponentPropsService<
    Tab[],
    Tab,
    Sitecore.Components.Tabs.TabsGeneralContent.TabsGeneralContent['fields']
  >(
    [],
    (field, props) => {
      props.push(field);
    },
    'getStaticTabProps',
    'getStaticTabProps',
    false
  );

  const tabs = await tabPropsService.fetchStaticProps({
    source: rendering,
    context,
    components,
  });

  return tabs;
}
