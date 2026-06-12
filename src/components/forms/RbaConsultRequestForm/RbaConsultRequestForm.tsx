import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { Suspense } from 'react';

import { RbaConsultRequestFormClient } from './helpers/RbaConsultRequestFormClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type RbaConsultRequestFormProps = ComponentProps &
  Sitecore.Forms.Custom.RbaConsultRequestForm.RbaConsultRequestForm;

function RbaConsultRequestForm_Default(props: RbaConsultRequestFormProps) {
  return (
    <Suspense>
      <RbaConsultRequestFormClient fields={props.fields} rendering={props.rendering} />
    </Suspense>
  );
}

export const Default = withDatasourceCheck(RbaConsultRequestForm_Default);
