import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { CardsWrapper } from './helpers/CardsWrapper';
import { DesktopVideoDisplayStyleType, XupDisplayStyle } from './helpers/XupCardCollection.types';
import { XupCardCollectionClient } from './helpers/XupCardCollectionClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';
import componentMap from '.sitecore/component-map';

type XupCardCollectionProps = ComponentProps &
  Sitecore.Components.Listing.XupCardCollection.XupCardContainer;

function XupCardCollection_Default(props: XupCardCollectionProps): JSX.Element {
  // Limit cards on tablet to a maximum of 3 per row to avoid overcrowding, even if desktop allows more.
  // This ensures a better user experience across devices.
  const MAX_CARDS_PER_ROW_TABLET_DEFAULT = 3;

  const dynamicPlaceholderId = props.params?.DynamicPlaceholderId;
  const phKey = dynamicPlaceholderId ? `cards-${dynamicPlaceholderId}` : undefined;

  const desktopVideoDisplayStyle =
    getEnum<DesktopVideoDisplayStyleType>(props.fields?.desktopVideoDisplayStyle) ?? 'in-line';

  const desktopDisplayStyle =
    getEnum<XupDisplayStyle>(props?.fields?.desktopDisplayStyle) ?? 'grid';
  const mobileDisplayStyle = getEnum<XupDisplayStyle>(props?.fields?.mobileDisplayStyle) ?? 'grid';

  const maxCardsPerRow: number = Number.parseInt(
    getEnum<string>(props?.fields?.cardsPerRow) ?? '3'
  );
  const tabletMaxCardsPerRow = Math.min(maxCardsPerRow, MAX_CARDS_PER_ROW_TABLET_DEFAULT);

  return (
    <XupCardCollectionClient
      fields={props.fields}
      rendering={props.rendering}
      page={props.page}
      cards={
        phKey ? (
          <AppPlaceholder
            name={phKey}
            rendering={props.rendering}
            page={props.page}
            componentMap={componentMap}
            render={(cards) => (
              <CardsWrapper
                cards={cards}
                maxCardsPerRow={maxCardsPerRow}
                tabletMaxCardsPerRow={tabletMaxCardsPerRow}
                desktopDisplayStyle={desktopDisplayStyle}
                mobileDisplayStyle={mobileDisplayStyle}
                desktopVideoDisplayStyle={desktopVideoDisplayStyle}
                isEditing={props.page.mode.isEditing}
              />
            )}
          />
        ) : null
      }
    />
  );
}

export const Default = withDatasourceCheck(XupCardCollection_Default);
