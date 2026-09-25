import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query';

import { API_TIMEOUT, AUTH_KEYWORD, BASE_URL, MOBILE_PREFIX } from '../constants';
import { notifyGlobalError, ReduxApiError, toReduxError } from './errorHandler';
import type { RootState } from '../store';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  timeout: API_TIMEOUT,
  responseHandler: 'content-type',
  prepareHeaders: (headers, { getState }) => {
    const employeeId = (getState() as RootState).authentication.user?.employeeId;
    if (employeeId != null) {
      headers.set('employeeId', String(employeeId));
    }
    return headers;
  },
});

const baseQuery: BaseQueryFn<FetchArgs, unknown, ReduxApiError> = async (args, api, extraOptions) => {
  const url = args.url.includes(AUTH_KEYWORD) ? args.url : `${args.url}${MOBILE_PREFIX}`;
  const { data, error } = await rawBaseQuery({ ...args, url }, api, extraOptions);

  if (error) {
    const apiError = toReduxError(error);
    if (!api.signal.aborted) {
      notifyGlobalError(apiError);
    }
    return { error: apiError };
  }

  return { data };
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});