import { DidYouMean as HeadlessDidYouMean } from '@coveo/headless';
import { Field } from '@sitecore-content-sdk/nextjs';
import { FunctionComponent, useEffect, useState } from 'react';

interface DidYouMeanProps {
  controller: HeadlessDidYouMean;
  noResultsText: Field<string>;
  autoCorrectionText: Field<string>;
  didYouMeanText: Field<string>;
  didYouMeanClasses?: {
    [key: string]: string;
  };
}

export const DidYouMean: FunctionComponent<DidYouMeanProps> = (props) => {
  const { controller, noResultsText, autoCorrectionText, didYouMeanText, didYouMeanClasses } =
    props;
  const [state, setState] = useState(controller.state);

  useEffect(() => controller.subscribe(() => setState(controller.state)), [controller]);

  if (!state.hasQueryCorrection) {
    return null;
  }

  if (state.wasAutomaticallyCorrected) {
    return (
      <div className="p-s">
        <div className={didYouMeanClasses?.wasAutomaticallyCorrected}>
          {noResultsText?.value} <span>{state.originalQuery}</span>
        </div>
        <div className={didYouMeanClasses?.wasAutomaticallyCorrected}>
          {autoCorrectionText?.value} <span>{state.wasCorrectedTo}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={didYouMeanClasses?.didYouMeanLabel}>
      <span>{didYouMeanText?.value} </span>

      <button
        onClick={() => controller.applyCorrection()}
        className={didYouMeanClasses?.correctedQuery}
      >
        {state.queryCorrection.correctedQuery}
      </button>
    </div>
  );
};
