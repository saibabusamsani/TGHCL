import * as Keychain from 'react-native-keychain';
import type { Tokens } from '../types/auth.type';

const SERVICE = 'com.lwc.tghcl';
let cache: Tokens | null = null;

export const tokenStorage = {
  async setTokens(tokens: Tokens) {
    cache = tokens;
    await Keychain.setGenericPassword('auth', JSON.stringify(tokens), {
      service: SERVICE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  },
  async hydrate(): Promise<Tokens | null> {
    const creds = await Keychain.getGenericPassword({ service: SERVICE });
    return (cache = creds ? JSON.parse(creds.password) : null);
  },
  getAccessToken: () => cache?.accessToken ?? null,
  getRefreshToken: () => cache?.refreshToken ?? null,
  async clearTokens() {
    cache = null;
    await Keychain.resetGenericPassword({ service: SERVICE });
  },
};