'use client';

import { LinkField } from '@sitecore-content-sdk/nextjs';
import Component from 'helpers/Component/Component';
import SingleButton from 'helpers/SingleButton/SingleButton';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { hashCode } from 'lib/utils/string-utils/hash-code';
import { JSX } from 'react';

import { ComponentAlignment, FreeStandingCtaTheme } from './helpers/FreeStandingCta.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type FreeStandingCtaProps = ComponentProps &
  Sitecore.Components.General.FreeStandingCta.FreeStandingCta;

function FreeStandingCta_Default(props: FreeStandingCtaProps): JSX.Element {
  const linkField = props?.fields.cta1Link as LinkField;
  const alignment = getEnum<ComponentAlignment>(props.fields?.alignment) ?? 'left';
  const { themeData } = useTheme(FreeStandingCtaTheme(alignment));

  return (
    <Component
      variant="lg"
      dataComponent="general/freestandingcta"
      {...props}
      spacing={props.fields?.spacing}
    >
      <section
        className={themeData.classes.contentWrapper}
        id={props.fields?.sectionId?.value ?? `id${hashCode(props.rendering?.dataSource)}`}
      >
        <div className="mb-s flex items-start md:flex-row md:items-center md:space-x-4">
          {linkField.value.href && (
            <SingleButton {...props} classes={themeData.classes.sectionCta} />
          )}
        </div>
      </section>
    </Component>
  );
}

export const Default = withDatasourceCheck(FreeStandingCta_Default);
