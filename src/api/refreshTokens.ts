import type { BaseQueryApi } from '@reduxjs/toolkit/query';

import { ENDPOINTS } from './endpoints';
import { rawBaseQuery } from './rawBaseQuery';
import { tokenStorage } from '../services/tokenStorage';
import { clearUser } from '../store/authSlice';
import type { Tokens } from '../types/auth.type';

let inFlight: Promise<boolean> | null = null;

async function refresh(api: BaseQueryApi, extra: object): Promise<boolean> {
  const { data, error } = await rawBaseQuery(
    {
      url: ENDPOINTS.AUTH.REFRESH,
      method: 'POST',
      body: { refreshToken: tokenStorage.getRefreshToken() },
    },
    api,
    extra,
  );

  if (data) {
    await tokenStorage.setTokens(data as Tokens);
    return true;
  }

  // Log out only when the server rejects the refresh token, not on network errors
  if (error?.status === 401 || error?.status === 403) {
    await tokenStorage.clearTokens();
    api.dispatch(clearUser());
  }
  return false;
}

export const refreshTokens = (api: BaseQueryApi, extra: object) => {
  if (inFlight === null) {
    inFlight = refresh(api, extra).finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
};