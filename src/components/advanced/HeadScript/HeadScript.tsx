'use client';

import { ComponentProps } from 'lib/component-props';
import { getEnum } from 'lib/utils/get-enum';
import { isValidForEnvironment } from 'lib/utils/is-valid-for-environment';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { createUUID } from 'lib/utils/string-utils/create-uuid';
import { hashCode } from 'lib/utils/string-utils/hash-code';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import Script, { ScriptProps } from 'next/script';
import { JSX, useMemo } from 'react';
import { environment } from 'startup/environment';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type HeadScriptProps = ComponentProps & Sitecore.Components.Advanced.HeadScript.HeadScript;

function HeadScript_Default(props: HeadScriptProps): JSX.Element | null {
  const { fields, rendering } = props;

  const id = useMemo(
    (): string => fields?.id?.value ?? `id${hashCode(rendering.uid ?? createUUID())}`,
    [fields?.id?.value, rendering.uid]
  );
  const type = fields?.type?.value ?? 'text/javascript';
  const src = fields?.src?.value ?? '';
  const body = fields?.htmlBody?.value ?? '';
  const strategy = getEnum<ScriptProps['strategy']>(fields?.strategy) ?? 'beforeInteractive';
  //Leaving this to be implemented in the future to inject the comments.
  //const name = fields?.name?.value;
  //const beginCommment = document.createComment(` Begin ${name} Script `);
  //const closeComment = document.createComment(` Begin ${name} Script `);

  if (!isValidForEnvironment(props, environment) || (!src && !body)) {
    return null;
  }
  return !isNullOrWhitespace(src) ? (
    <Script id={id} type={type} src={src} strategy={strategy} />
  ) : (
    <Script id={id} type={type} strategy={strategy} dangerouslySetInnerHTML={{ __html: body }} />
  );
}

export const Default = withDatasourceCheck(HeadScript_Default);
