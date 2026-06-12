import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { ItemFields } from 'lib/graphql/item-fetcher/item';
import { ItemBatch } from 'lib/graphql/item-fetcher/item-batch';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { AWSitecoreClient } from 'lib/sitecore-client';
import scConfig from 'sitecore.config';

import { Sitecore } from '.sitecore/AndersenWindows.model';
import componentMap from '.sitecore/component-map';

type PlaceholderContainerProps = ComponentProps &
  Sitecore.Components.Container.PlaceholderContainer.PlaceholderContainer;

async function PlaceholderContainer_Default(props: PlaceholderContainerProps) {
  const phKeyDataSource = props?.params?.placeholderName ?? '';
  const pageEditMode = props?.page?.layout?.sitecore?.context?.pageEditing;
  if (!phKeyDataSource && pageEditMode) {
    return (
      <div style={{ border: '1px dashed red', padding: '10px' }}>
        Placeholder Name field is not set in rendering parameters.
      </div>
    );
  }

  const phKeyItem = await getItemById(phKeyDataSource);
  if (!phKeyItem && pageEditMode) {
    return (
      <div style={{ border: '1px dashed red', padding: '10px' }}>Placeholder Name item error</div>
    );
  }

  const phKey = phKeyItem?.fields?.['Placeholder Key'];
  if (!phKey && pageEditMode) {
    return (
      <div style={{ border: '1px dashed red', padding: '10px' }}>
        Placeholder Key field is empty on Placeholder Name item.
      </div>
    );
  }

  if (!phKeyDataSource || !phKeyItem || !phKey) {
    return (
      <div style={{ border: '1px dashed red', padding: '10px' }}>Error rendering component</div>
    );
  }

  return (
    <AppPlaceholder
      name={phKey}
      rendering={props.rendering}
      page={props.page}
      componentMap={componentMap}
    />
  );
}

async function getItemById(itemId: string, language: string = 'en') {
  if (!itemId) {
    return null;
  }
  const sitecoreClient = new AWSitecoreClient({ ...scConfig });
  const itemBatch = new ItemBatch(sitecoreClient);

  const itemPromise = itemBatch.item(itemId, language);

  await itemBatch.execute();

  const item = itemPromise?.result;

  return {
    fields: {
      ...mapItemFieldResultsToObject(item?.fields as unknown as ItemFields[], 'value'),
    },
  };
}

export const Default = PlaceholderContainer_Default;
