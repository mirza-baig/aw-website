import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { Suspense } from 'react';

import { ContactUsClient } from './helpers/ContactUsClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type ContactUsProps = ComponentProps & Sitecore.Forms.Custom.ContactUs.ContactUs;

function ContactUs_Default(props: ContactUsProps) {
  return (
    <Suspense>
      <ContactUsClient fields={props.fields} rendering={props.rendering} />
    </Suspense>
  );
}

export const Default = withDatasourceCheck(ContactUs_Default);
