import { JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export type TabsProps = Sitecore.Components.Tabs.TabsFeaturedPromo.TabCollection;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Tabs = (props: any): JSX.Element => {
  const { currentTabIndex, classes } = props;

  return (
    <div className={classes.tabWrapper}>
      {/* TabTitles Component */}
      <div className={classes.tabTitlesList}>{props.children[0]}</div>
      {/* TabPanel Component */}
      <div className={classes.tabPanel}>{props.children[1][currentTabIndex]}</div>
      {/* Add the rest of the tabs to the HTML so Google can crawl it even though its not visible */}
      {props.children[1].map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (_child: any, childIndex: number) =>
          childIndex !== currentTabIndex && (
            <div key={_child.id} className="invisible h-0 w-0">
              {props.children[1][childIndex]}
            </div>
          )
      )}
    </div>
  );
};

export default Tabs;
