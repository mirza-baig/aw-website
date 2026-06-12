'use client';

import { ComponentProps } from 'lib/component-props';
import { getEnum } from 'lib/utils/get-enum';
import { isValidForEnvironment } from 'lib/utils/is-valid-for-environment';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { HTMLAttributeReferrerPolicy, JSX } from 'react';
import { environment } from 'startup/environment';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type HeadLinkProps = ComponentProps & Sitecore.Components.Advanced.HeadLink.HeadLink;

type CrossOrigin = '' | 'anonymous' | 'use-credentials';

function HeadLink_Default(props: HeadLinkProps): JSX.Element | null {
  const { fields } = props;

  const href = fields?.href?.value;
  const rel = fields?.rel?.value;
  const title = fields?.title?.value;
  const type = fields?.type?.value;
  const media = fields?.media?.value;
  const sizes = fields?.sizes?.value;
  const hreflang = fields?.hreflang?.value;
  const crossOrigin: CrossOrigin | undefined = getEnum<CrossOrigin>(fields?.crossOrigin);
  const referrerPolicy: HTMLAttributeReferrerPolicy | undefined =
    getEnum<HTMLAttributeReferrerPolicy>(fields?.referrerPolicy);
  const charSet = fields?.charset?.value;

  //If no environment matches, or the href is missing, return null to prevent rendering.
  if (!isValidForEnvironment(props, environment) || !href) {
    return null;
  }

  const linkAttributes = {
    href,
    rel,
    title,
    type,
    media,
    sizes,
    hreflang: hreflang,
    crossOrigin,
    referrerPolicy,
    charSet,
  };

  return (
    <link {...Object.fromEntries(Object.entries(linkAttributes).filter(([, value]) => value))} />
  );
}

export const Default = withDatasourceCheck(HeadLink_Default);
