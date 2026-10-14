import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query';

import { API_TIMEOUT, AUTH_KEYWORD, BASE_URL, MOBILE_PREFIX } from '../constants';
import { notifyGlobalError, ReduxApiError, toReduxError } from './errorHandler';
import { clearUser } from '../store/authSlice';
import type { RootState } from '../store';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  timeout: API_TIMEOUT,
  responseHandler: 'content-type',
  prepareHeaders: (headers, { getState }) => {
    const {user} = (getState() as RootState).authentication;
    if (user != null) {
      headers.set('employeeId', user.employeeId);
      headers.set('designationId', String(user.designationId));
    }
    return headers;
  },
});

const baseQuery: BaseQueryFn<FetchArgs, unknown, ReduxApiError> = async (args, api, extraOptions) => {
  const isAuthRequest = args.url.includes(AUTH_KEYWORD);
  const url = isAuthRequest ? args.url : `${MOBILE_PREFIX}${args.url}`;
  const { data, error } = await rawBaseQuery({ ...args, url }, api, extraOptions);

  if (error) {
    const apiError = toReduxError(error);

    if (!api.signal.aborted) {
      const { isLoggedIn } = (api.getState() as RootState).authentication;
      if (error.status === 401 && !isAuthRequest && isLoggedIn) {
        api.dispatch(clearUser());
      }
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