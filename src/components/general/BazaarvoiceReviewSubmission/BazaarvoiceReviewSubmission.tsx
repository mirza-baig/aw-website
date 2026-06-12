import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { Suspense } from 'react';

import { BazaarvoiceReviewSubmissionClient } from './helpers/BazaarvoiceReviewSubmissionClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type BazaarvoiceReviewSubmissionProps = ComponentProps &
  Sitecore.Components.General.BazaarvoiceReviewSubmission.BazaarvoiceReviewSubmission;

function BazaarvoiceReviewSubmission_Default(props: BazaarvoiceReviewSubmissionProps) {
  return (
    <Suspense>
      <BazaarvoiceReviewSubmissionClient fields={props.fields} rendering={props.rendering} />
    </Suspense>
  );
}

export const Default = withDatasourceCheck(BazaarvoiceReviewSubmission_Default);
