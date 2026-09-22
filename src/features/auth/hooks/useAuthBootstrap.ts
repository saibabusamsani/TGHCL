import { useEffect, useState } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setUser, clearUser } from '../../../store/authSlice';
import { STORAGE_KEYS } from '../../../constants';
import { User } from '../../../types/auth.type';
import { storageHelper } from '../../../utils';

const MIN_SPLASH_TIME = 2000;

export function useAuthBootstrap() {
  const dispatch = useAppDispatch();
  const authentication = useAppSelector((state) => state.authentication);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const bootstrapAsync = async () => {
      RNBootSplash.hide({ fade: false }).catch(() => {});

      const minTimerPromise = new Promise<void>((resolve) =>
        setTimeout(resolve, MIN_SPLASH_TIME)
      );
      const fetchStoredDataPromise =storageHelper.multiGet<[User | null, string | null]>([
          STORAGE_KEYS.USER_DATA,
          STORAGE_KEYS.FCM_TOKEN,
        ]);
      try {
        const [storedData] = await Promise.all([fetchStoredDataPromise, minTimerPromise]);

        if (!isMounted) return;

        const [userData, fcmToken] = storedData;

        setFcmToken(fcmToken);

        if (userData) {
          dispatch(setUser(userData));
        } else {
          dispatch(clearUser());
        }
      } catch (error) {
        console.error('[Auth] Bootstrap failed:', error);
        if (isMounted) dispatch(clearUser());
      }
    };

    bootstrapAsync();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return { ...authentication, fcmToken };
}