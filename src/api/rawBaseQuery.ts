import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_TIMEOUT, BASE_URL } from '../constants';
import { tokenStorage } from '../services/tokenStorage';
import type { RootState } from '../store';

export const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  timeout: API_TIMEOUT,
  responseHandler: 'content-type',
  prepareHeaders: (headers, { getState }) => {
    const employeeId = (getState() as RootState).authentication.user?.employeeId;
    if (employeeId != null) headers.set('employeeId', String(employeeId));

    const token = tokenStorage.getAccessToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);

    return headers;
  },
});