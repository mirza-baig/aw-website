import { create } from 'zustand';

import { VideoItemProps } from './types';

type Store = {
  selectedVideoIndex: number;

  currentPlayingVideo: VideoItemProps | undefined;
  tabClicked: boolean;
  setSelectedVideoIndex: (index: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCurrentPlayingVideo: (video: any) => void;
  setTabClicked: (clicked: boolean) => void;
};

export const useCurrentVideoStore = create<Store>()((set) => ({
  selectedVideoIndex: 0,
  currentPlayingVideo: undefined,
  tabClicked: false,
  setSelectedVideoIndex: (index: number) => set(() => ({ selectedVideoIndex: index })),

  setCurrentPlayingVideo: (video: VideoItemProps) => set(() => ({ currentPlayingVideo: video })),
  setTabClicked: (clicked: boolean) => set(() => ({ tabClicked: clicked })),
}));
