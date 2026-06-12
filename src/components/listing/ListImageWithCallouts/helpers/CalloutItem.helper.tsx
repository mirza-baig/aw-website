import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Headline from 'helpers/Headline/Headline';

import { Sitecore } from '.sitecore/AndersenWindows.model';
type CalloutItemProps =
  Sitecore.Components.Listing.ListImageWithCallouts.ListImagewithCalloutsItem & {
    callOutItemClasses: {
      calloutContainer?: string;
      calloutItemHeadline?: string;
      calloutBody?: string;
    };
  };

const CalloutItem = ({ fields, callOutItemClasses }: CalloutItemProps) => {
  return (
    <div className={callOutItemClasses?.calloutContainer}>
      <Headline classes={callOutItemClasses?.calloutItemHeadline ?? ''} fields={fields} />
      <BodyCopy classes={callOutItemClasses?.calloutBody ?? ''} fields={fields} />
    </div>
  );
};

export default CalloutItem;
