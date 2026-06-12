import { QueryError as HeadlessQueryError } from '@coveo/headless';
import { FunctionComponent, useEffect, useState } from 'react';

interface QueryErrorProps {
  controller: HeadlessQueryError;
}

export const QueryError: FunctionComponent<QueryErrorProps> = (props) => {
  const { controller } = props;
  const [state, setState] = useState(controller.state);

  useEffect(() => controller.subscribe(() => setState(controller.state)), [controller]);

  if (!state.hasError) {
    return null;
  }

  return (
    <div>
      <div>Oops {state?.error?.message}</div>
      <code>{JSON.stringify(state?.error)}</code>
    </div>
  );
};
