import classNames from 'classnames';
import { ApmErrorBoundary } from 'lib/apm/apm-error-boundary';
import { EnumField, getEnum } from 'lib/utils/get-enum';
import { hashCode } from 'lib/utils/string-utils/hash-code';
import { JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export const ComponentSizes = {
  ml: 'ml' as ComponentSizeVariants,
  lg: 'lg' as ComponentSizeVariants,
  xl: 'lg' as ComponentSizeVariants,
  full: 'full' as ComponentSizeVariants,
};

export type ComponentSizeVariants = 'ml' | 'lg' | 'xl' | 'full' | '';
export type ComponentBackgroundVariants =
  | ''
  | 'default'
  | 'black'
  | 'gray'
  | 'white'
  | 'primary'
  | 'secondary';

export type GapSizes = 'gap-s' | 'gap-x-0' | '';

export type ComponentWrapperProps = Sitecore.BaseTemplates.BaseComponent & {
  children?: React.ReactNode | React.ReactNode[];
  dataComponent?: string;
  variant: ComponentSizeVariants;
  backgroundVariant: ComponentBackgroundVariants;
  sectionWrapperClasses: string;
  className?: string;
  gap?: GapSizes;
  padding?: string;
  grid?: string;
};

const containerVariants: Record<ComponentWrapperProps['variant'], string> = {
  full: 'w-full',
  xl: 'xl:mx-auto md:max-w-(--breakpoint-xl)',
  lg: 'lg:mx-auto md:max-w-(--breakpoint-lg)',
  ml: 'md:mx-auto md:max-w-screen-ml',
};

const containerBgVariants: Record<ComponentWrapperProps['backgroundVariant'], string> = {
  black: 'theme-black bg-theme-bg',
  gray: 'theme-gray bg-light-gray',
  white: 'theme-white',
  primary: 'theme-primary',
  secondary: 'theme-secondary',
};

export function GetCompositeComponentSpacingClass(
  componentSpacingField: EnumField<ComponentSpacing>,
  componentPaddingFIeld: EnumField<ComponentPadding>,
  componentMarginField: EnumField<ComponentMargin>,
  defaultValue?: ComponentSpacing
) {
  // If the legacy field is set, use that field.
  if (componentSpacingField) {
    return GetComponentSpacingClass(componentSpacingField, defaultValue);
  }

  // Else use the new fields.
  let componentPaddingAndMarginClass = GetComponentPaddingClass(componentPaddingFIeld, 'undefined');
  componentPaddingAndMarginClass = classNames(
    componentPaddingAndMarginClass,
    GetComponentMarginClass(componentMarginField, 'undefined')
  );

  if (componentPaddingAndMarginClass) {
    return componentPaddingAndMarginClass;
  }

  // If neither the legacy nor the new fields are set, return the default value.
  return GetComponentSpacingClass(componentSpacingField, defaultValue);
}

export function GetComponentPaddingClass(
  componentPaddingFIeld: EnumField<ComponentPadding>,
  defaultValue?: ComponentPadding
) {
  const paddingEnumKey = getEnum<ComponentPadding>(componentPaddingFIeld) ?? defaultValue ?? 'none';
  return paddingValues[paddingEnumKey];
}

export function GetComponentMarginClass(
  componentMarginField: EnumField<ComponentMargin>,
  defaultValue?: ComponentMargin
) {
  const spacingEnumKey =
    getEnum<ComponentMargin>(componentMarginField) ?? defaultValue ?? 'standard';
  return marginValues[spacingEnumKey];
}

export function GetComponentSpacingClass(
  componentSpacingField: EnumField<ComponentSpacing>,
  defaultValue?: ComponentSpacing
) {
  const spacingEnumKey =
    getEnum<ComponentSpacing>(componentSpacingField) ?? defaultValue ?? 'standard';
  return spacingValues[spacingEnumKey];
}

export type ComponentSpacing =
  | 'standard'
  | 'reduced'
  | 'paddingStandard'
  | 'paddingReduced'
  | 'none'
  | 'undefined';
export type ComponentPadding =
  | 'paddingBoth'
  | 'paddingBottom'
  | 'paddingTop'
  | 'none'
  | 'undefined';
export type ComponentMargin = 'standard' | 'reduced' | 'none' | 'undefined';

const spacingValues: Record<ComponentSpacing, string> = {
  standard: 'my-8',
  reduced: 'my-4',
  paddingStandard: 'py-8',
  paddingReduced: 'py-4',
  none: 'my-0',
  undefined: '',
};

const paddingValues: Record<ComponentPadding, string> = {
  paddingBoth: 'py-4',
  paddingBottom: 'pb-4',
  paddingTop: 'pt-4',
  none: 'py-0',
  undefined: '',
};

const marginValues: Record<ComponentMargin, string> = {
  standard: 'my-9',
  reduced: 'my-3',
  none: 'my-0',
  undefined: '',
};

const Component = ({
  fields,
  rendering,
  children,
  variant,
  backgroundVariant,
  dataComponent,
  sectionWrapperClasses,
  className,
  gap,
  padding,
  grid,
}: ComponentWrapperProps): JSX.Element => {
  const gridClass = `${grid ?? 'section-grid grid grid-cols-2 md:grid-cols-12'} ${
    padding ?? 'px-m'
  } ${gap ?? 'gap-s md:gap-s'} ${dataComponent === 'product/productintro' ? 'relative' : ''}`;

  return (
    <ApmErrorBoundary disableSuspense={true}>
      <section
        className={classNames(sectionWrapperClasses, className)}
        data-component={dataComponent}
        id={fields?.sectionId?.value ?? `id${hashCode(rendering.dataSource)}`}
      >
        <div
          className={classNames(
            GetCompositeComponentSpacingClass(
              fields?.componentSpacing,
              fields?.componentPadding,
              fields?.componentMargin
            ),
            containerVariants[variant],
            containerBgVariants[backgroundVariant] ?? 'theme-white'
          )}
        >
          <div className={gridClass}>{children}</div>
        </div>
      </section>
    </ApmErrorBoundary>
  );
};
export default Component;
