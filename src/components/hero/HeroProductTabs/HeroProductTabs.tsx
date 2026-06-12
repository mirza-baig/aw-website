import {
  AppPlaceholder,
  ComponentRendering,
  Field,
  Item,
  LayoutServiceData,
  NextjsContentSdkComponent,
} from '@sitecore-content-sdk/nextjs';
import { NestedComponentPropsService, NextContext } from 'lib/utils/nested-component-props-service';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { CurrentTabProvider } from './helpers/CurrentTab';
import { Tab } from './helpers/HeroProductTabs.types';
import { HeroProductTabsClient } from './helpers/HeroProductTabsClient';
import { TabPanelClient } from './helpers/TabPanelClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';
import componentMap from '.sitecore/component-map';

type FavoriteProductType = Record<string, unknown>;

type WithFavorites = {
  favoriteProducts?: FavoriteProductType[];
};
type HeroProductTabsProps = Sitecore.Components.Hero.HeroProductTabs.HeroProductTabs &
  WithFavorites & {
    tabs: Tab[];
    fields?: {
      headline?: Field<string>;
      headlineLevel?: Item;
      sticky?: Field<boolean>;
    };
    params?: Record<string, unknown>;
    rendering?: ComponentRendering<SitecoreComponentFields>; // now properly typed
  };
// Define the type of Sitecore rendering component fields to include required fields
export type SitecoreComponentFields = {
  _AW_TemplateId: Field<string>;
  hideByDefault: Field<boolean>;
  itemPersonalizationRules: Field<string>;
  componentMargin?: Item;
  componentPadding?: Item;
  componentSpacing?: Item;
  sectionId: Field<string>;
} & Record<string, unknown>; // allow additional fields

/* --------------------------------------------------
 Component
---------------------------------------------------*/
async function HeroProductTabs_Default(props: HeroProductTabsProps): Promise<JSX.Element> {
  const { tabs } = await getComponentServerProps(
    props.rendering,
    props.layoutData,
    props.context,
    componentMap
  );

  return (
    <CurrentTabProvider>
      <HeroProductTabsClient
        fields={props.fields}
        rendering={props.rendering}
        tabs={tabs}
        placeholder={
          <AppPlaceholder
            name={`heroproducttabs-${props.params?.DynamicPlaceholderId}`}
            rendering={props.rendering}
            render={(components) => {
              return components.map((component, index) => {
                const key = `tab-panel-${index}`;
                return (
                  <TabPanelClient key={key} index={index}>
                    {component}
                  </TabPanelClient>
                );
              });
            }}
            page={props.page}
            componentMap={componentMap}
          />
        }
      />
    </CurrentTabProvider>
  );
}

export const Default = withDatasourceCheck(HeroProductTabs_Default);

async function getComponentServerProps(
  rendering: ComponentRendering,
  _layout: LayoutServiceData,
  context: NextContext,
  components: Map<string, NextjsContentSdkComponent>
) {
  const datasource = rendering as unknown as ComponentRendering<SitecoreComponentFields>;

  const tabPropsService = new NestedComponentPropsService<
    Tab[],
    Tab,
    Sitecore.Components.Hero.HeroProductTabs.HeroProductTabs['fields']
  >([], (field, props) => props.push(field), 'getStaticTabProps', 'getStaticTabProps', false);

  const tabs = await tabPropsService.fetchStaticProps({
    source: datasource,
    context,
    components,
  });

  return { tabs };
}
