import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { Suspense } from 'react';

import { SelectionGuideSignUpClient } from './helpers/SelectionGuideSignUpClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type SelectionGuideSignUpProps = ComponentProps &
  Sitecore.Forms.Custom.SelectionGuideSignUpForm.SelectionGuideSignUpForm;

function SelectionGuideSignUp_Default(props: SelectionGuideSignUpProps) {
  return (
    <Suspense>
      <SelectionGuideSignUpClient fields={props.fields} rendering={props.rendering} />
    </Suspense>
  );
}

export const Default = withDatasourceCheck(SelectionGuideSignUp_Default);
