import { AttributeRendererProps, AttributeViewModelBase } from 'lib/renoworks';
import { FC } from 'react';

import PDT_BrandHardwareAttribute from './PDT_BrandHardwareAttribute.helper';
import PDT_BrandHardwareFinishAttribute from './PDT_BrandHardwareFinishAttribute.helper';
import PDT_DependentSwatchAttribute from './PDT_DependentSwatchAttribute.helper';
import PDT_DescriptionAttribute from './PDT_DescriptionAttribute.helper';
import PDT_HardwareAttribute from './PDT_HardwareAttribute.helper';
import PDT_RadioAttribute from './PDT_RadioAttribute.helper';
import PDT_SizingAttribute from './PDT_SizingAttribute.helper';
import PDT_SummaryAttribute from './PDT_SummaryAttribute.helper';
import PDT_SwatchAttribute from './PDT_SwatchAttribute.helper';
import PDT_TabbedSwatchAttribute from './PDT_TabbedSwatchAttribute.helper';
import PDT_TextAttribute from './PDT_TextAttribute.helper';

export const rendererMap = new Map<string, FC<AttributeRendererProps<AttributeViewModelBase>>>();
rendererMap.set('DependentSwatchAttribute', PDT_DependentSwatchAttribute);
rendererMap.set('DescriptionAttribute', PDT_DescriptionAttribute);
rendererMap.set('HardwareAttribute', PDT_HardwareAttribute);
rendererMap.set('BrandHardwareAttribute', PDT_BrandHardwareAttribute);
rendererMap.set('BrandHardwareFinishAttribute', PDT_BrandHardwareFinishAttribute);
rendererMap.set('RadioAttribute', PDT_RadioAttribute);
rendererMap.set('SizingAttribute', PDT_SizingAttribute);
rendererMap.set('SummaryAttribute', PDT_SummaryAttribute);
rendererMap.set('SwatchAttribute', PDT_SwatchAttribute);
rendererMap.set('TabbedSwatchAttribute', PDT_TabbedSwatchAttribute);
rendererMap.set('TextAttribute', PDT_TextAttribute);
