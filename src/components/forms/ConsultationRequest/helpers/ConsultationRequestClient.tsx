'use client';

import { ComponentPropsCollection } from '@sitecore-content-sdk/nextjs';
import config from 'aw.config.client';
import { GenericFormBuilderClient } from 'components/forms/GenericFormBuilder/GenericFormBuilder/helpers/GenericFormBuilderClient';
import { getEnum } from 'lib/utils/get-enum';
import { useExternalScript } from 'lib/utils/use-external-script';
import { ReactNode } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type ConsultationRequestProps =
  Sitecore.Forms.Custom.ConsultationRequestForm.ConsultationRequestForm &
    Sitecore.Forms.GenericFormBuilder.GenericFormBuilder & {
      placeholder: ReactNode;
      componentProps: ComponentPropsCollection;
    };

export function ConsultationRequestClient(props: ConsultationRequestProps) {
  const scriptVersion = getEnum<string>(props.fields.scriptVersion)?.trim() ?? 'v1';
  const key = config.onlineScheduling.key;
  const domain = config.onlineScheduling.domain.split(',')[0].trim();
  const script = `${domain}/os/${scriptVersion}/osiframe.js?key=${key}`;
  useExternalScript(script);

  return <GenericFormBuilderClient {...props} />;
}
