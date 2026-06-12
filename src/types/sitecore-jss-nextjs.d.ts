import { ComponentParams } from '@sitecore-content-sdk/nextjs';
import { Rule } from 'src/lib/personalization/personalization-types';
import { BreadcrumbItem } from 'src/components/site/Breadcrumb/Breadcrumb';
import { JobDetails } from 'lib/utils/rba-career-utils';
import { FeatureToggles } from 'lib/feature-toggles/feature-toggles';

declare module '@sitecore-content-sdk/nextjs' {
  export interface Item {
    id: string;
    url: string;
  }

  export interface ImageFieldValue {
    width?: number;
    height?: number;
  }
}
