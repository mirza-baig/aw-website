'use client';

import { Field, ImageField } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import ImagePrimary from 'helpers/Media/ImagePrimary';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { useEffect, useRef, useState } from 'react';

import { RichTextWrapper } from '../RichTextWrapper';

interface TooltipProps {
  fields?: {
    tooltipText?: Field<string>;
    tooltipImage?: ImageField;
  };
}

export const Tooltip = (props: TooltipProps) => {
  const [tooltipLocation, setTooltipLocation] = useState({ top: '0', bottom: '20px', left: '0' });
  const { currentScreenWidth } = useCurrentScreenType();
  const [isMobile, setIsMobile] = useState(currentScreenWidth <= getBreakpoint('mmd'));

  const toolTipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(currentScreenWidth <= getBreakpoint('mmd'));
  }, [currentScreenWidth]);

  if (!props.fields?.tooltipText?.value) {
    return <></>;
  }

  const showTooltip = () => {
    if (toolTipRef.current) {
      const tooltipElement = toolTipRef.current?.lastChild as HTMLDivElement;

      if (tooltipElement.getBoundingClientRect().width === 0) {
        return;
      }

      let _tooltipLocation = tooltipLocation;

      const toolTipTopCoordinate = tooltipElement?.getBoundingClientRect().top;

      const toolTipRightCoordinate = tooltipElement?.getBoundingClientRect().right;

      _tooltipLocation = {
        top: toolTipTopCoordinate <= 0 ? '20px' : '0',
        bottom: toolTipTopCoordinate > 0 ? '20px' : '0',
        left:
          toolTipRightCoordinate > window.outerWidth - 50
            ? `-${Math.abs(window.outerWidth - toolTipRightCoordinate - 30)}px`
            : '0',
      };

      setTooltipLocation({ ..._tooltipLocation });
    }
  };

  const hideTooltip = () => {
    setTooltipLocation({ top: '0', bottom: '20px', left: '0' });
  };

  return (
    <div
      ref={toolTipRef}
      className="group relative ml-xxs md:inline-flex"
      onMouseEnter={() => {
        if (!isMobile) {
          showTooltip();
        }
      }}
      onTouchStart={showTooltip}
      onMouseLeave={hideTooltip}
    >
      <SvgIcon icon="tooltip" className="cursor-pointer" />
      <div
        style={{
          top: tooltipLocation.top === '0' ? undefined : tooltipLocation.top,
          bottom: tooltipLocation.bottom === '0' ? undefined : tooltipLocation.bottom,
          left: tooltipLocation.left,
        }}
        className={classNames(
          'invisible absolute z-1000 w-max min-w-[86px] max-w-[288px] rounded-[8px] bg-white p-xxs text-body text-black opacity-0 shadow-[0_2px_5px_0px_rgba(0,0,0,0.25)] group-hover:visible group-hover:opacity-100'
        )}
      >
        <RichTextWrapper field={props.fields?.tooltipText} />
        <ImagePrimary
          imageLayout="responsive"
          {...{
            fields: {
              primaryImage: { ...props.fields.tooltipImage },
              primaryImageMobile: { ...props.fields.tooltipImage },
              primaryImageCaption: {
                value: '',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Tooltip;
