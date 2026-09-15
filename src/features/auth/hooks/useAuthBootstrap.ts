import { useEffect } from 'react';
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

  useEffect(() => {
    let isMounted = true;

    const bootstrapAsync = async () => {
    
      RNBootSplash.hide({ fade: false }).catch(() => {});

      const minTimerPromise = new Promise<void>((resolve) =>
        setTimeout(resolve, MIN_SPLASH_TIME)
      );
      const fetchUserDataPromise = storageHelper.get(STORAGE_KEYS.USER_DATA);

      try {
    
        const [userData] = await Promise.all([fetchUserDataPromise, minTimerPromise]);

        if (!isMounted) return;
        if (userData) {
          dispatch(setUser(userData as User));
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

  return authentication;
}