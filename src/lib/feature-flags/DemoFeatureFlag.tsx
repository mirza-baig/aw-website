import classNames from 'classnames';
import { WebsiteStaticState } from 'lib/website/website-state';
import { JSX } from 'react';

export function DemoFeatureFlag({
  websiteStaticState,
}: Readonly<{
  websiteStaticState: WebsiteStaticState;
}>): JSX.Element | null {
  if (websiteStaticState.siteInfo?.name != 'AndersenSandbox') {
    return null;
  }
  return (
    <section>
      <div className="w-full theme-white p-4">
        <div
          className={classNames('p-4 border border-solid ', {
            'border-amber-500 bg-amber-50': !websiteStaticState.featureFlags.releaseExampleFeature,
            'border-green-500 bg-green-50': websiteStaticState.featureFlags.releaseExampleFeature,
          })}
        >
          {`The example feature flag is ${websiteStaticState.featureFlags.releaseExampleFeature ? 'enabled' : 'disabled'}`}
        </div>
      </div>
    </section>
  );
}
