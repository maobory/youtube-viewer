import React, { useState, useEffect } from 'react';
import { Stack, Divider, Link } from '@mui/material';
import { Layout } from 'ui/components/shared';
import { HomeView, SettingType, VideosSeniority } from 'types';
import Field from './Field';
import { useAppDispatch, useAppSelector } from 'store';
import { selectSettings } from 'store/selectors/settings';
import { setSettings } from 'store/reducers/settings';
import Alerts from './Alerts';
import { isWebExtension, sendMessage } from 'helpers/webext';
import {
  humanInterval,
  TimeAgo,
  memorySizeOf,
  formatByteSize,
} from 'helpers/utils';
import { defaults as channelCheckerDefaults } from 'ui/components/webext/Background/ChannelChecker';
import { selectVideos } from 'store/selectors/videos';
import ClearVideosData from './ClearVideosData';

interface SettingsProps {}

export function Settings(props: SettingsProps) {
  const [lastCheckTime, setLastCheckTime] = useState(null);
  const settings = useAppSelector(selectSettings);
  const videos = useAppSelector(selectVideos);
  const savedVideosSize = memorySizeOf(videos);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isWebExtension) {
      sendMessage('getLastCheckDate').then((date: string) => {
        if (date) {
          const time = new Date(date).getTime();
          setLastCheckTime(TimeAgo.inWords(time));
        }
      });
    }
  }, []);

  return (
    <Layout>
      <Alerts settings={settings} />
      <Stack sx={{ px: 3, overflow: 'auto' }} divider={<Divider />}>
        <Field
          label="Default view"
          value={settings.defaultView}
          onChange={(defaultView: HomeView) => {
            dispatch(setSettings({ defaultView }));
          }}
          options={[
            {
              label: 'All',
              value: HomeView.All,
            },
            {
              label: 'Recent',
              value: HomeView.Recent,
            },
            {
              label: 'Watch later',
              value: HomeView.WatchLater,
            },
          ]}
          type={SettingType.List}
        />
        <Field
          label="Recent videos seniority"
          value={settings.recentVideosSeniority}
          onChange={(recentVideosSeniority: VideosSeniority) => {
            dispatch(setSettings({ recentVideosSeniority }));
          }}
          options={[
            {
              label: '1 day',
              value: VideosSeniority.OneDay,
            },
            {
              label: '3 days',
              value: VideosSeniority.ThreeDays,
            },
            {
              label: '7 days',
              value: VideosSeniority.SevenDays,
            },
          ]}
          type={SettingType.List}
        />
        <Field
          label="Dark mode"
          value={settings.darkMode}
          onChange={(darkMode: boolean) => {
            dispatch(setSettings({ darkMode }));
          }}
          type={SettingType.Boolean}
        />
        <Field
          label="Auto play videos"
          value={settings.autoPlayVideos}
          onChange={(autoPlayVideos: boolean) => {
            dispatch(setSettings({ autoPlayVideos }));
          }}
          type={SettingType.Boolean}
        />
        {isWebExtension ? (
          <Field
            label="Enable notifications"
            description={`Checking for new videos is performed every ${humanInterval(
              channelCheckerDefaults.checkInterval,
              'minute'
            )}${lastCheckTime ? ` (Last check: ${lastCheckTime})` : ''}`}
            value={settings.enableNotifications}
            onChange={(enableNotifications: boolean) => {
              dispatch(setSettings({ enableNotifications }));
            }}
            type={SettingType.Boolean}
          />
        ) : null}
        <Field
          label="Youtube API key"
          description={
            <span>
              Don't have an API key yet?{' '}
              <Link
                href="https://www.slickremix.com/docs/get-api-key-for-youtube/"
                target="_blank"
                color="secondary"
                rel="noopener"
              >
                Get your own!
              </Link>
            </span>
          }
          value={settings.apiKey}
          onChange={(apiKey: string) => {
            dispatch(setSettings({ apiKey }));
          }}
          type={SettingType.Secret}
        />
        {savedVideosSize > 0 ? (
          <Field
            label="Saved videos data"
            description={`Estimated size: ${formatByteSize(savedVideosSize)}`}
            type={SettingType.Custom}
            render={() => <ClearVideosData />}
          />
        ) : null}
      </Stack>
    </Layout>
  );
}
