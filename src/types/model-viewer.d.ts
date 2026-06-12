import { ModelViewerElement } from '@google/model-viewer';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

// Model-viewer specific properties. This gives us all the standard
// props like `className`, `style`, `children`, etc., plus the component-specific ones.
type ModelViewerProps = DetailedHTMLProps<
  HTMLAttributes<ModelViewerElement>,
  ModelViewerElement
> & {
  src?: string;
  poster?: string;
  alt?: string;
  loading?: 'eager' | 'lazy' | 'auto';
  reveal?: 'auto' | 'interaction' | 'manual';
  'ios-src'?: string;
  'ar'?: '' | boolean | string;
  'ar-modes'?: string;
  'ar-scale'?: 'auto' | 'fixed';
  'ar-status'?: string;
  'auto-rotate'?: boolean;
  'auto-rotate-delay'?: string; // number as string
  'shadow-intensity'?: string; // number as string
  'environment-image'?: string;
  'animation-name'?: string;
  autoplay?: boolean;
  'quick-look-browsers'?: string;
  'camera-controls'?: '' | boolean | string;
  'camera-orbit'?: string;

  // Add other model-viewer specific props here as needed
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerProps;
    }
  }
}
