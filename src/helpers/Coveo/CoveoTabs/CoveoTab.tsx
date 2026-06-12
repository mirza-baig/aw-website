import { Tab as HeadlessTab } from '@coveo/headless';
import React, { PropsWithChildren, useEffect, useState } from 'react';

type CoveoTabProps = PropsWithChildren<{
  controller: HeadlessTab;
  classes: {
    tabButton: string;
  };
}>;

export const CoveoTab = (props: CoveoTabProps) => {
  const { controller, classes } = props;
  const [state, setState] = useState(controller.state);

  useEffect(() => controller.subscribe(() => setState(controller.state)), [controller]);

  const handleClick = () => {
    controller.select();
  };

  return (
    <button className={classes.tabButton} disabled={state.isActive} onClick={handleClick}>
      {props.children}
    </button>
  );
};
