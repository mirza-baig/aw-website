import { AttributeRendererProps, AttributeViewModelBase } from 'lib/renoworks';
import { FC } from 'react';

import BrandHardwareAttribute from './BrandHardwareAttribute.helper';
import BrandHardwareFinishAttribute from './BrandHardwareFinishAttribute.helper';
import DependentSwatchAttribute from './DependentSwatchAttribute.helper';
import DescriptionAttribute from './DescriptionAttribute.helper';
import HardwareAttribute from './HardwareAttribute.helper';
import RadioAttribute from './RadioAttribute.helper';
import SizingAttribute from './SizingAttribute.helper';
import SummaryAttribute from './SummaryAttribute.helper';
import SwatchAttribute from './SwatchAttribute.helper';
import TabbedSwatchAttribute from './TabbedSwatchAttribute.helper';
import TextAttribute from './TextAttribute.helper';

export const rendererMap = new Map<string, FC<AttributeRendererProps<AttributeViewModelBase>>>();
rendererMap.set('DependentSwatchAttribute', DependentSwatchAttribute);
rendererMap.set('DescriptionAttribute', DescriptionAttribute);
rendererMap.set('HardwareAttribute', HardwareAttribute);
rendererMap.set('BrandHardwareAttribute', BrandHardwareAttribute);
rendererMap.set('BrandHardwareFinishAttribute', BrandHardwareFinishAttribute);
rendererMap.set('RadioAttribute', RadioAttribute);
rendererMap.set('SizingAttribute', SizingAttribute);
rendererMap.set('SummaryAttribute', SummaryAttribute);
rendererMap.set('SwatchAttribute', SwatchAttribute);
rendererMap.set('TabbedSwatchAttribute', TabbedSwatchAttribute);
rendererMap.set('TextAttribute', TextAttribute);
