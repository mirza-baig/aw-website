import { Page } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { WebsiteStaticState } from 'lib/website/website-state';
import { JSX } from 'react';

export function DemoFeatureFlag({
  page,
}: Readonly<{
  page: Page & { customProps: WebsiteStaticState };
}>): JSX.Element | null {
  if (page.siteName != 'AndersenSandbox') {
    return null;
  }
  return (
    <section>
      <div className="w-full theme-white p-4">
        <div
          className={classNames('p-4 border border-solid ', {
            'border-amber-500 bg-amber-50': !page.customProps.featureFlags.releaseExampleFeature,
            'border-green-500 bg-green-50': page.customProps.featureFlags.releaseExampleFeature,
          })}
        >
          {`The example feature flag is ${page.customProps.featureFlags.releaseExampleFeature ? 'enabled' : 'disabled'}`}
        </div>
      </div>
    </section>
  );
}
