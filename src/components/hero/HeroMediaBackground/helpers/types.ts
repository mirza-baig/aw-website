import { ComponentProps } from 'lib/component-props';
import { DataSource } from 'lib/types/data-source';

import { Sitecore } from '.sitecore/AndersenWindows.sitecore';

export type HeroMediaBackgroundProps =
  DataSource<Sitecore.Components.Hero.HeroMediaBackground.HeroMediaBackground> & ComponentProps;
