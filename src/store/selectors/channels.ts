import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from 'store';
import { Channel } from 'types';

export const selectChannels = (state: RootState) => state.channels.list;

export const selectActiveChannels = createSelector(selectChannels, (channels) =>
  channels.filter(({ isHidden }) => !isHidden)
);

export const selectHiddenChannels = createSelector(selectChannels, (channels) =>
  channels.filter(({ isHidden }) => isHidden)
);

export const selectNotificationEnabledChannels = createSelector(
  selectChannels,
  (channels) =>
    channels.filter(
      ({ isHidden, notifications }) => !isHidden && !notifications?.isDisabled
    )
);

export const selectActiveChannelsCount = createSelector(
  selectActiveChannels,
  (channels) => channels.length
);

export const selectChannelsCount = createSelector(
  selectActiveChannels,
  selectChannels,
  (activeChannels, channels) =>
    activeChannels.length === channels.length
      ? channels.length
      : `${activeChannels.length}/${channels.length}`
);

export const selectChannel = (channel: Channel) =>
  createSelector(selectChannels, (channels) =>
    channels.find(({ id }) => id === channel.id)
  );
