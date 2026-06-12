import { ImageFieldValue } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { JSX, KeyboardEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import ImageWrapper from 'src/helpers/Media/ImageWrapper';
import SvgIcon from 'src/helpers/SvgIcon/SvgIcon';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export const Swatches = ({
  swatchesCollection,
}: Sitecore.Components.General.SwatchCollections.SwatchCollections) => {
  const { swatches } = swatchesCollection;
  const { currentScreenWidth } = useCurrentScreenType();

  const [isSwatchPanelVisible, setIsSwatchPanelVisible] = useState(false);
  const [leftAlignedSwatchPanel, setLeftAlignedSwatchPanel] = useState(true);

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickOutside = (event: any) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsSwatchPanelVisible(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleClickOutside);
    };
  }, []);

  const maxPreviewSwatchToShow = currentScreenWidth <= getBreakpoint('ml') ? 2 : 4;

  const renderPreviewSwatches = () => {
    const previewSwatches = [];

    for (let i = 0; i < maxPreviewSwatchToShow; i++) {
      if (swatches[i]) {
        previewSwatches.push(<Swatch {...swatches[i]} />);
      } else {
        break;
      }
    }

    return previewSwatches;
  };

  const Swatch = (props: ImageFieldValue) => (
    <div className="mx-xxxs h-[30px] w-[30px] overflow-hidden rounded-full">
      <ImageWrapper
        imageLayout="intrinsic"
        image={{
          value: {
            src: props.src ?? '',
            alt: props.alt ?? '',
            width: 30,
            height: 30,
          },
        }}
      />
    </div>
  );

  const SwatchesPanel = ({
    isLeftAlignedSwatchPanel,
  }: {
    isLeftAlignedSwatchPanel: boolean;
  }): JSX.Element => {
    return (
      <>
        <span className="absolute top-2/3 left-0 z-[9] h-4 w-4 rotate-45 transform border border-white bg-white"></span>
        <div
          className={classNames(
            'absolute top-full z-[8] rounded-xl bg-white px-[30px] pt-xs shadow-[0px_2px_5px_rgba(0,0,0,0.25)]',
            isLeftAlignedSwatchPanel ? '-left-[100px]' : '-right-[15px]'
          )}
        >
          <div className="relative flex  w-[230px] cursor-pointer flex-wrap items-center justify-start">
            <div
              tabIndex={0}
              onClick={() => {
                setIsSwatchPanelVisible(false);
              }}
            >
              <SvgIcon className="absolute top-0 -right-m" icon="close" />
            </div>
            {swatches.map((swatch: ImageFieldValue, index: number) => (
              <div key={index} className="mb-xs">
                <Swatch {...swatch} />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const toggleSwatchPanel = (e: MouseEvent | KeyboardEvent) => {
    if (e.currentTarget) {
      setLeftAlignedSwatchPanel(
        (e.currentTarget as HTMLDivElement).getBoundingClientRect().x < currentScreenWidth / 2
      );
      setIsSwatchPanelVisible(!isSwatchPanelVisible);
    }
  };

  return (
    <div className="flex items-center justify-center">
      {renderPreviewSwatches()}
      {swatches.length - maxPreviewSwatchToShow > 0 && (
        <div
          className="relative mx-xxxs"
          onClick={(e) => toggleSwatchPanel(e)}
          onKeyDown={(e) => e.code === 'Enter' && toggleSwatchPanel(e)}
          ref={panelRef}
          tabIndex={0}
        >
          <span className="cursor-pointer">+{swatches.length - maxPreviewSwatchToShow}</span>
          {isSwatchPanelVisible && (
            <SwatchesPanel isLeftAlignedSwatchPanel={leftAlignedSwatchPanel} />
          )}
        </div>
      )}
    </div>
  );
};
