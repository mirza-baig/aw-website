import { ComponentProps } from 'lib/component-props';
import { DataSource } from 'lib/types/data-source';

type ClientComponentProps<TFields = unknown> = ComponentProps & DataSource<TFields>;

/**
 * Filters a component's props to properties that are safe for a client component.
 *
 * Allowed props are: fields, page, rendering, and params.
 *
 * @typeParam TFields The type of the component's data-source fields.
 * @param props Component props containing fields, page, rendering, and params.
 * @returns A new object containing only the client component props.
 */
export function getClientComponentProps<TFields = unknown>(
  props: ClientComponentProps<TFields>
): ClientComponentProps<TFields> {
  const { fields, page, rendering, params } = props;
  return { fields, page, rendering, params };
}
