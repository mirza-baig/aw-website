'use client';

import classNames from 'classnames';
import { ComponentProps } from 'lib/component-props';
import { getWidthClass } from 'lib/generic-form-builder/utils/get-width-class';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

function FillerElement_Default(
  props: ComponentProps & Sitecore.Forms.GenericFormBuilder.Elements.Filler.FillerElement
): JSX.Element | null {
  return (
    <div className={`relative mb-s hidden md:block ${classNames(getWidthClass(props))}`}></div>
  );
}

export const Default = withDatasourceCheck(FillerElement_Default);
