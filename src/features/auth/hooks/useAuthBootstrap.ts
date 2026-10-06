import { useEffect, useState } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setUser, clearUser } from '../../../store/authSlice';
import { STORAGE_KEYS } from '../../../constants';
import { storageHelper } from '../../../utils/storageHelper';
import { User } from '../auth.type';

const MIN_SPLASH_TIME = 2000;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function useAuthBootstrap() {
  const dispatch = useAppDispatch();
  const authentication = useAppSelector((state) => state.authentication);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    const bootstrapAsync = async () => {
      RNBootSplash.hide({ fade: false }).catch(() => {});

      try {
        const [[userData, storedFcmToken]] = await Promise.all([
          storageHelper.multiGet<[User | null, string | null]>([
            STORAGE_KEYS.USER_DATA,
            STORAGE_KEYS.FCM_TOKEN,
          ]),
          wait(MIN_SPLASH_TIME),
        ]);

        setFcmToken(storedFcmToken);
        dispatch(userData ? setUser(userData) : clearUser());
      } catch (error) {
        console.error('[Auth] Bootstrap failed:', error);
        dispatch(clearUser());
      }
    };

    bootstrapAsync();
  }, [dispatch]);

  return { ...authentication, fcmToken };
}