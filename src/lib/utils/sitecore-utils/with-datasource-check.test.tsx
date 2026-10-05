import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { withDatasourceCheck, type WithDatasourceCheckProps } from './with-datasource-check';

describe('lib > utils > sitecore-utils > with-datasource-check', () => {
  const Component = (_props: WithDatasourceCheckProps) => <div>Rendered component</div>;
  const WrappedComponent = withDatasourceCheck(Component);

  it('renders the wrapped component when a datasource is present', () => {
    const props = {
      rendering: { dataSource: 'datasource-id' },
      page: { mode: { isEditing: false } },
    } as unknown as WithDatasourceCheckProps;

    expect(renderToStaticMarkup(<WrappedComponent {...props} />)).toBe(
      '<div>Rendered component</div>'
    );
  });

  it('renders the wrapped component in Design Library mode without a datasource', () => {
    const props = {
      rendering: {},
      page: { mode: { isDesignLibrary: true, isEditing: false } },
    } as unknown as WithDatasourceCheckProps;

    expect(renderToStaticMarkup(<WrappedComponent {...props} />)).toBe(
      '<div>Rendered component</div>'
    );
  });

  it('renders the editing error when a datasource is missing in editing mode', () => {
    const props = {
      rendering: {},
      page: { mode: { isEditing: true } },
    } as unknown as WithDatasourceCheckProps;

    expect(renderToStaticMarkup(<WrappedComponent {...props} />)).toBe(
      '<div class="sc-jss-editing-error" role="alert">Datasource is required. Please choose a content item for this component.</div>'
    );
  });

  it('renders nothing when a datasource is missing outside editing mode', () => {
    const props = {
      rendering: {},
      page: { mode: { isEditing: false } },
    } as unknown as WithDatasourceCheckProps;

    expect(renderToStaticMarkup(<WrappedComponent {...props} />)).toBe('');
  });
});
