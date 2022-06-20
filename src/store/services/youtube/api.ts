import {
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { BaseQueryApi } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { RootState } from 'store';
import { FetchError } from 'types';

const defaultBaseQuery = fetchBaseQuery({
  baseUrl: 'https://www.googleapis.com/youtube/v3/',
  prepareHeaders: (headers, { getState }) => {
    const apiKey = (getState() as RootState).settings.apiKey;
    if (apiKey) {
      headers.set('X-Goog-Api-Key', apiKey);
    }
    return headers;
  },
});

const baseQuery = (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: { timeout?: number } = {}
) =>
  Promise.race([
    defaultBaseQuery(args, api, extraOptions),
    new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            error: { status: 'FETCH_ERROR', error: FetchError.TIMEOUT },
          }),
        extraOptions.timeout ?? 10000
      )
    ) as ReturnType<typeof defaultBaseQuery>,
  ]);

export const youtubeApi = createApi({
  reducerPath: 'youtubeApi',
  baseQuery,
  endpoints: () => ({}),
});
