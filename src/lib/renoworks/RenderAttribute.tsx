/***  Disabling no-explicit-any for whole file as this file is containing a whole lot of them,
 * and this utils are being used at multiple palces */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useAsPath } from 'lib/hooks/use-as-path';
import { AttributeViewModelBase } from 'lib/renoworks';
// Removing for temporary fix of using history: import { useRouter } from 'next/navigation';
import { JSX, RefObject, useEffect, useRef } from 'react';

export type RenderAttributeProps = {
  rendererMap: Map<string, React.FC<AttributeRendererProps<AttributeViewModelBase>>>;
  viewModel: AttributeViewModelBase;
  onUpdateOption: (option: any, collection?: any[]) => void;
  onUpdateOptionGroup: (optionGroup: any, collection?: any[]) => void;
  props?: any;
  selectedOptions?: any[];
  attributeIndex: number;
  maxAttributeIndex: number;
  modalRef?: RefObject<HTMLDivElement | null>;
  placeholder?: JSX.Element;
};

export type AttributeRendererProps<VM extends AttributeViewModelBase> = {
  viewModel: VM;
  onUpdateOption?: (option: any, collection?: any[]) => void;
  onUpdateOptionGroup?: (optionGroup: any, collection?: any[]) => void;
  props?: any;
  selectedOptions?: any[];
  attributeIndex: number;
  maxAttributeIndex: number;
  modalRef?: RefObject<HTMLDivElement | null>;
  placeholder?: JSX.Element;
};

export const RenderAttribute = (props: RenderAttributeProps): JSX.Element => {
  const { rendererMap, viewModel, ...rest } = props;

  // URL manipulation
  // Removing for temporary fix of using history: const router = useRouter();
  const asPath = useAsPath();
  const prevComponentRef = useRef<string | null>(null);

  useEffect(() => {
    if (!viewModel) {
      return;
    }
    const currentComponent = viewModel.component;
    const prevComponent = prevComponentRef.current;
    prevComponentRef.current = currentComponent;

    if (!asPath.includes('#')) {
      return;
    }
    const [pathWithoutHash, hash] = asPath.split('#');
    const hasSummary = hash.endsWith('/summary');
    // ✅ Entering Summary
    if (currentComponent === 'SummaryAttribute' && !hasSummary) {
      // Temporary fix for router.push(newPath); not working in 16.2, was router.push here
      globalThis.history.replaceState(null, '', `${pathWithoutHash}#${hash}/summary`);
    }
    // ✅ Leaving Summary
    if (
      prevComponent === 'SummaryAttribute' &&
      currentComponent !== 'SummaryAttribute' &&
      hasSummary
    ) {
      globalThis.history.replaceState(
        null,
        '',
        `${pathWithoutHash}#${hash.replace(/\/summary$/, '')}`
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewModel?.component]);

  if (!viewModel) {
    return <></>;
  }

  const attributeName = viewModel.component;
  const Element = rendererMap.get(attributeName);

  if (!Element) {
    return <>No renderer for {attributeName}</>;
  }
  return <Element viewModel={viewModel} {...rest} />;
};

export default RenderAttribute;
