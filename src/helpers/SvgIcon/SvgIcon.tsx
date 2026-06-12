'use client';

import dynamic from 'next/dynamic';
import React, { JSX, memo } from 'react';
//  Icon contents should be stored in the icons subdirectory using the naming scheme 'icon--[name].tsx'

export type IconTypes =
  | undefined
  | 'check'
  | 'close'
  | 'cube'
  | 'ellipsis'
  | 'hamburger'
  | 'minus'
  | 'new-tab'
  | 'new-tab-black'
  | 'plus'
  | 'arrow'
  | 'arrow-drop-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'external-link'
  | 'download'
  | 'smallclose'
  | 'smallplus'
  | 'star'
  | 'orange-triangle'
  | 'quote'
  | 'caret'
  | 'facebook'
  | 'instagram'
  | 'pinterest'
  | 'twitter'
  | 'youtube'
  | 'houzz'
  | 'linkedin'
  | 'search'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-right-sm'
  | 'chevron-left-sm'
  | 'play'
  | 'pause'
  | 'location-pin'
  | 'favorite'
  | 'pdf'
  | 'pdf-aw'
  | 'zoom-pinch'
  | 'caret-right'
  | 'caret-primary'
  | 'print'
  | 'share'
  | 'reset'
  | 'share'
  | 'pencil'
  | 'dropdown-arrow'
  | 'tick'
  | 'tooltip'
  | 'chat'
  | 'chat-outline'
  | 'phone'
  | 'form-link'
  | 'checkround'
  | 'checktick'
  | 'step-check'
  | 'double-arrow-right'
  | 'unlock';

export interface SvgIconProps {
  className?: string;
  icon: IconTypes;
  defs?: JSX.Element;
  fillId?: string;
  size?: Sizes;
}

export interface IconProps {
  fillId?: string;
  size?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Sizes = 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | '40' | any;

const IconSize: Record<Sizes, string> = {
  sm: '8',
  md: '12',
  lg: '16',
  xl: '20',
  xxl: '24',
  40: '40',
};

const SvgIcon = ({ icon, className, defs, fillId, size = 'md' }: SvgIconProps): JSX.Element => {
  if (!icon) {
    return <></>;
  }

  const IconContent = dynamic<IconProps>(
    () =>
      import(`./icons/icon--${icon}`).then((mod) => mod.default as React.ComponentType<IconProps>),
    { ssr: false }
  );

  const props: IconProps = {
    fillId: fillId,
    size: IconSize[size] || size,
  };

  return (
    <span className={className}>
      <IconContent {...props} />
      {defs}
    </span>
  );
};

export default memo(SvgIcon);
