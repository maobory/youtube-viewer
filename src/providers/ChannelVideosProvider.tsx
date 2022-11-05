/* eslint-disable react-hooks/exhaustive-deps */
import { debounce } from 'helpers/utils';
import {
  createContext,
  FC,
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { views } from 'store/reducers/settings';
import { GetChannelVideosResponse } from 'store/services/youtube';
import { Channel, Video, HomeView } from 'types';

export interface ChannelData extends Omit<GetChannelVideosResponse, 'count'> {
  channel: Channel;
}

export interface ChannelVideosCount {
  displayed: number;
  total: number;
}

type ChannelVideosContextType = {
  videosCount: { [key: string]: ChannelVideosCount };
  setChannelData: (view: HomeView, data: ChannelData) => void;
  clearChannelsData: (view: HomeView) => void;
  getLatestChannelVideo: (
    view: HomeView,
    channelId: string,
  ) => Video | undefined;
  getChannelVideosCount: (view: HomeView, channelId: string) => number;
};

const initialVideosCount = views.reduce(
  (acc, view) => ({
    ...acc,
    [view]: {
      displayed: 0,
      total: 0,
    },
  }),
  {},
);

const initialChannelsMap = views.reduce(
  (acc, view) => ({ ...acc, [view]: new Map() }),
  {},
);

const ChannelVideosContext = createContext<
  ChannelVideosContextType | undefined
>(undefined);

export const ChannelVideosProvider: FC = memo(({ children }) => {
  const [videosCount, setVideosCount] =
    useState<ChannelVideosContextType['videosCount']>(initialVideosCount);
  const channelsMap = useRef<{ [key: string]: Map<string, ChannelData> }>(
    initialChannelsMap,
  );

  const updateCount = useCallback(
    debounce((view: HomeView, count: ChannelVideosCount) => {
      setVideosCount((state) => ({
        ...state,
        [view]: count,
      }));
    }, 200),
    [],
  );

  const setChannelData = (view: HomeView, data: ChannelData) => {
    // save channel data per view
    channelsMap.current[view].set(data.channel.id, data);
    // update videos count per view
    const channelsData = Array.from(channelsMap.current[view].values());
    const count = channelsData.reduce(
      (acc, cur) => ({
        displayed: acc.displayed + (cur.items?.length || 0),
        total: acc.total + (cur.total || 0),
      }),
      { displayed: 0, total: 0 },
    );
    updateCount(view, count);
  };

  const clearChannelsData = (view: HomeView) => {
    channelsMap.current[view].clear();
    setVideosCount((state) => ({
      ...state,
      [view]: {
        displayed: 0,
        total: 0,
      },
    }));
  };

  const getLatestChannelVideo = (view: HomeView, channelId: string) => {
    const channelData = channelsMap.current[view].get(channelId);
    return channelData?.items[0];
  };

  const getChannelVideosCount = (view: HomeView, channelId: string) => {
    const channelData = channelsMap.current[view].get(channelId);
    switch (view) {
      case HomeView.All:
        return channelData?.items.length || 0;
      default:
        return channelData?.total || 0;
    }
  };

  const value = useMemo(
    () => ({
      videosCount,
      setChannelData,
      clearChannelsData,
      getLatestChannelVideo,
      getChannelVideosCount,
    }),
    [videosCount],
  );

  return (
    <ChannelVideosContext.Provider value={value}>
      {children}
    </ChannelVideosContext.Provider>
  );
});

type ChannelVideosHookType = {
  videosCount: ChannelVideosCount;
  setChannelData: (data: ChannelData) => void;
  clearChannelsData: () => void;
  getLatestChannelVideo: (channelId: string) => Video | undefined;
  getChannelVideosCount: (channelId: string) => number;
};

export function useChannelVideos(view: HomeView): ChannelVideosHookType {
  const context = useContext(ChannelVideosContext);

  if (context === undefined) {
    throw new Error(
      'useChannelVideos must be used within a ChannelVideosContext',
    );
  }

  const {
    videosCount,
    setChannelData,
    clearChannelsData,
    getLatestChannelVideo,
    getChannelVideosCount,
  } = context;

  return {
    videosCount: videosCount[view],
    setChannelData: (data) => setChannelData(view, data),
    clearChannelsData: () => clearChannelsData(view),
    getLatestChannelVideo: (channelId) =>
      getLatestChannelVideo(view, channelId),
    getChannelVideosCount: (channelId) =>
      getChannelVideosCount(view, channelId),
  };
}
