import { ImageField } from '@sitecore-content-sdk/nextjs';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Headline from 'helpers/Headline/Headline';
import SingleButton from 'helpers/SingleButton/SingleButton';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';

import { FeaturedCard } from './FeaturedCard';
import { MashupTheme } from './Mashup.theme';
import { MashupStyle, ResultItem } from './Mashup.Types';
import { RegularCard } from './RegularCard';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type PageMashupProps = Sitecore.Components.General.PageMashup.PageMashup & ComponentProps;

const Mashup = (props: PageMashupProps) => {
  const { themeData } = useTheme(MashupTheme);

  const mashupStyle = getEnum<MashupStyle>(props.fields?.mashupStyle) ?? 'images-for-all';

  const displayMashupGrid = () => {
    const renderRegularCards = () => {
      return props.fields?.resultItems
        .slice(1)
        .map((resultItem: ResultItem, index: number) => (
          <RegularCard
            key={resultItem.id}
            resultItem={resultItem}
            mashupStyle={mashupStyle}
            itemIndex={index}
            placeholderImage={props.fields?.placeholderImage as ImageField}
            displayEyebrow={props.fields?.displayEyebrow.value}
          />
        ));
    };
    switch (mashupStyle) {
      case 'images-for-all':
        return (
          <>
            <FeaturedCard
              resultItem={props.fields?.resultItems[0] as ResultItem}
              mashupStyle={mashupStyle}
              placeholderImage={props.fields?.placeholderImage as ImageField}
              displayEyebrow={props.fields?.displayEyebrow.value}
            />
            {renderRegularCards()}
          </>
        );
      case 'feature-image-only':
      case 'no-images':
        return (
          <>
            <FeaturedCard
              resultItem={props.fields?.resultItems[0] as ResultItem}
              mashupStyle={mashupStyle}
              placeholderImage={props.fields?.placeholderImage as ImageField}
              displayEyebrow={props.fields?.displayEyebrow.value}
            />
            <div className="md:gap-lg col-span-12  grid grid-cols-12 gap-x-s gap-y-ml self-start border-t border-gray pt-s md:col-span-6">
              {renderRegularCards()}
            </div>
          </>
        );
      default:
        return <>Error in displaying mashup</>;
    }
  };

  return (
    <div className="col-span-12 py-l">
      <div className="grid-rows-auto grid grid-cols-12  gap-s px-m  md:max-w-(--breakpoint-lg) lg:mx-auto">
        <div className="col-span-12 md:col-span-6">
          <Headline {...props} classes={themeData.classes.sectionheadline} />
        </div>
        <div className="col-span-12 md:col-span-6">
          <BodyCopy {...props} classes={themeData.classes.sectionBody} />
          <SingleButton {...props} classes={themeData.classes.sectionCta} />
        </div>

        {displayMashupGrid()}
      </div>
    </div>
  );
};

export default Mashup;
