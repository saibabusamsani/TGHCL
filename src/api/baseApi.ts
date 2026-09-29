import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query';

import { AUTH_KEYWORD, MOBILE_PREFIX } from '../constants';
import { notifyGlobalError, ReduxApiError, toReduxError } from './errorHandler';
import { rawBaseQuery } from './rawBaseQuery';
import { refreshTokens } from './refreshTokens';

const baseQuery: BaseQueryFn<FetchArgs, unknown, ReduxApiError> = async (args, api, extra) => {
  const isAuthCall = args.url.includes(AUTH_KEYWORD);
  const request = { ...args, url: isAuthCall ? args.url : `${args.url}${MOBILE_PREFIX}` };

  let result = await rawBaseQuery(request, api, extra);

  if (result.error?.status === 401 && !isAuthCall ) {
     const refreshed = await refreshTokens(api, extra);
    if (refreshed) result = await rawBaseQuery(request, api, extra); 

  }

  if (result.error) {
    const apiError = toReduxError(result.error);
    if (!api.signal.aborted) notifyGlobalError(apiError);
    return { error: apiError };
  }

  return { data: result.data };
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});