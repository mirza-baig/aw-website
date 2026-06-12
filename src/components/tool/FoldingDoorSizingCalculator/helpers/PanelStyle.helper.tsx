import classNames from 'classnames';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Headline from 'helpers/Headline/Headline';
import ImageWrapper from 'helpers/Media/ImageWrapper';
import { useTheme } from 'lib/context/ThemeContext';
import { ChangeEvent, KeyboardEvent, useContext } from 'react';

import { FoldingDoorSizingCalculatorProps } from './Calculator.helper';
import { FoldingDoorSizingCalculatorTheme } from './FoldingDoorSizingCalculator.theme';
import { FoldingDoorSizingCalculatorContext } from './FoldingDoorSizingCalculatorContext.helper';
import { StepButtons } from './StepButtons.helper';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export const PanelStyle = (props: FoldingDoorSizingCalculatorProps) => {
  const { themeData } = useTheme(FoldingDoorSizingCalculatorTheme());
  const { panelStyle, setPanelStyle } = useContext(FoldingDoorSizingCalculatorContext);
  const { setPanelStyleText } = useContext(FoldingDoorSizingCalculatorContext);

  const contemporaryPanelHeading: Sitecore.FieldSets.Headline = {
    fields: {
      headlineText: props.fields?.contemporaryPanelHeading,
      headlineLevel: {
        id: '0f556f3a-bbad-4aa5-952d-b79003b39cd6',
        url: '/sitecore/content/andersencorporation/enterprise-global/enums/headline-levels/heading-2',
        name: 'Heading 2',
        displayName: 'Heading 2',
        fields: {
          Value: {
            value: 'h2',
          },
        },
        //templateId: 'd2923fee-da4e-49be-830c-e27764dfa269',
        //templateName: 'Enum',
      },
    },
  };

  const traditionalPanelHeading: Sitecore.FieldSets.Headline = {
    fields: {
      headlineText: props.fields?.traditionalPanelHeading,
      headlineLevel: {
        id: '0f556f3a-bbad-4aa5-952d-b79003b39cd6',
        url: '/sitecore/content/andersencorporation/enterprise-global/enums/headline-levels/heading-2',
        name: 'Heading 2',
        displayName: 'Heading 2',
        fields: {
          Value: {
            value: 'h2',
          },
        },
        //templateId: 'd2923fee-da4e-49be-830c-e27764dfa269',
        //templateName: 'Enum',
      },
    },
  };

  const coastalPanelHeading: Sitecore.FieldSets.Headline = {
    fields: {
      headlineText: props.fields?.coastalPanelHeading,
      headlineLevel: {
        id: '0f556f3a-bbad-4aa5-952d-b79003b39cd6',
        url: '/sitecore/content/andersencorporation/enterprise-global/enums/headline-levels/heading-2',
        name: 'Heading 2',
        displayName: 'Heading 2',
        fields: {
          Value: {
            value: 'h2',
          },
        },
        //templateId: 'd2923fee-da4e-49be-830c-e27764dfa269',
        //templateName: 'Enum',
      },
    },
  };

  const handleInputSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const panelStyleValue = event.currentTarget.value;
    const panelStyleText = panelStyleValue.charAt(0).toUpperCase() + panelStyleValue.slice(1);

    setPanelStyle(panelStyleValue);
    setPanelStyleText(panelStyleText);
  };

  const handleKeyboardSelection = (e: KeyboardEvent<HTMLDivElement>, panelValue: string) => {
    if (e.key === ' ' || e.key === 'Enter') {
      const panelText = panelValue.charAt(0).toUpperCase() + panelValue.slice(1);

      setPanelStyle(panelValue);
      setPanelStyleText(panelText);
    }
  };

  return (
    <>
      <div className="mt-10 mb-6 hidden font-sans text-s font-heavy leading-[30px] md:block">
        Step One: Select Panel Style
      </div>
      <div className="flex flex-col flex-wrap md:flex-row">
        <div
          onKeyDown={(e) => handleKeyboardSelection(e, 'contemporary')}
          tabIndex={0}
          className={classNames(
            'mb-6 flex items-center rounded-[10px] bg-light-gray md:mb-0 md:mr-4 md:mt-4 md:w-[288px]',
            panelStyle === 'contemporary'
              ? 'border-[6px] border-primary'
              : 'border border-gray hover:border-2 hover:border-black'
          )}
        >
          <input
            id={'contemporaryPanelStyle'}
            type="radio"
            value="contemporary"
            name="panel_style"
            className="peer hidden"
            checked={panelStyle === 'contemporary'}
            onChange={handleInputSelection}
          />
          <label
            htmlFor="contemporaryPanelStyle"
            className="text-md text-gray-900 flex grow cursor-pointer flex-col items-center p-2 pt-8 pb-8 text-center font-bold uppercase md:h-full"
          >
            <div>
              <ImageWrapper
                imageLayout="intrinsic"
                image={{
                  value: {
                    src: props.fields?.contemporaryPanelImage?.value.src ?? '',
                    alt: props.fields?.contemporaryPanelImage?.value.alt ?? '',
                    width: 238,
                    height: 85,
                  },
                }}
              />
            </div>
            <div className="flex flex-col">
              <Headline
                classes={themeData.classes.headlineClass}
                fields={contemporaryPanelHeading.fields}
              />
              <BodyCopy
                classes={themeData.classes.bodyCopyClass}
                fields={{ body: props.fields?.contemporaryPanelDescription ?? { value: '' } }}
              />
            </div>
          </label>
        </div>
        <div
          onKeyDown={(e) => handleKeyboardSelection(e, 'traditional')}
          tabIndex={0}
          className={classNames(
            'mb-6 flex items-center rounded-[10px] bg-light-gray md:mb-0 md:mr-4 md:mt-4 md:w-[288px]',
            panelStyle === 'traditional'
              ? 'border-[6px] border-primary'
              : 'border border-gray hover:border-2 hover:border-black'
          )}
        >
          <input
            id={'traditionalPanelStyle'}
            type="radio"
            value="traditional"
            name="panel_style"
            className="peer hidden"
            checked={panelStyle === 'traditional'}
            onChange={handleInputSelection}
          />
          <label
            htmlFor="traditionalPanelStyle"
            className="text-md text-gray-900 flex grow cursor-pointer flex-col items-center p-2 pt-8 pb-8 text-center font-bold uppercase md:h-full"
          >
            <div>
              <ImageWrapper
                imageLayout="intrinsic"
                image={{
                  value: {
                    src: props.fields?.traditionalPanelImage?.value.src ?? '',
                    alt: props.fields?.traditionalPanelImage?.value.alt ?? '',
                    width: 238,
                    height: 85,
                  },
                }}
              />
            </div>
            <div className="flex flex-col">
              <Headline
                classes={themeData.classes.headlineClass}
                fields={traditionalPanelHeading.fields}
              />
              <BodyCopy
                classes={themeData.classes.bodyCopyClass}
                fields={{ body: props.fields?.traditionalPanelDescription ?? { value: '' } }}
              />
            </div>
          </label>
        </div>
        <div
          onKeyDown={(e) => handleKeyboardSelection(e, 'coastal')}
          tabIndex={0}
          className={classNames(
            'mb-6 flex items-center rounded-[10px] bg-light-gray focus-visible:border-0 md:mb-0 md:mr-4 md:mt-4 md:w-[288px]',
            panelStyle === 'coastal'
              ? 'border-[6px] border-primary'
              : 'border border-gray hover:border-2 hover:border-black'
          )}
        >
          <input
            id={'coastalPanelStyle'}
            type="radio"
            value="coastal"
            name="panel_style"
            className="peer hidden"
            checked={panelStyle === 'coastal'}
            onChange={handleInputSelection}
          />
          <label
            htmlFor="coastalPanelStyle"
            className="text-md text-gray-900 flex grow cursor-pointer flex-col items-center p-2 pt-8 pb-8 text-center font-bold uppercase md:h-full"
          >
            <div>
              <ImageWrapper
                imageLayout="intrinsic"
                image={{
                  value: {
                    src: props.fields?.coastalPanelImage?.value.src ?? '',
                    alt: props.fields?.coastalPanelImage?.value.alt ?? '',
                    width: 238,
                    height: 85,
                  },
                }}
              />
            </div>
            <div className="flex flex-col">
              <Headline
                classes={themeData.classes.headlineClass}
                fields={coastalPanelHeading.fields}
              />
              <BodyCopy
                classes={themeData.classes.bodyCopyClass}
                fields={{ body: props.fields?.coastalPanelDescription ?? { value: '' } }}
              />
            </div>
          </label>
        </div>
      </div>
      <StepButtons />
    </>
  );
};
