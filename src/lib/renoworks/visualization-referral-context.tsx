'use client';

import { createContext, PropsWithChildren, useContext, useMemo } from 'react';

export type VisualizationReferralFields = {
  visualizationReferralHeadline?: { value?: string };
  visualizationReferralBody?: { value?: string };
  visualizationReferralImage?: {
    value?: {
      src?: string;
      alt?: string;
      width?: string;
      height?: string;
    };
  };
  visualizationCtaText?: { value?: string };
  visualizationCtaStyle?: unknown;
  visualizationCtaIcon?: unknown;
};

const VisualizationReferralContext = createContext<VisualizationReferralFields | undefined>(
  undefined
);

export function VisualizationReferralProvider({
  fields,
  children,
}: PropsWithChildren<{ fields?: VisualizationReferralFields }>) {
  const value = useMemo<VisualizationReferralFields | undefined>(
    () =>
      fields
        ? {
            visualizationReferralHeadline: fields.visualizationReferralHeadline,
            visualizationReferralBody: fields.visualizationReferralBody,
            visualizationReferralImage: fields.visualizationReferralImage,
            visualizationCtaText: fields.visualizationCtaText,
            visualizationCtaStyle: fields.visualizationCtaStyle,
            visualizationCtaIcon: fields.visualizationCtaIcon,
          }
        : undefined,
    [fields]
  );

  return (
    <VisualizationReferralContext.Provider value={value}>
      {children}
    </VisualizationReferralContext.Provider>
  );
}

export function useVisualizationReferral(): VisualizationReferralFields | undefined {
  return useContext(VisualizationReferralContext);
}
