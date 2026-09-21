import { PermissionsAndroid, Platform } from 'react-native';

export type PermissionResult = 'granted' | 'denied' | 'never_ask_again';

export const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('[Permission] camera error:', err);
    return false;
  }
};

export const requestLocationPermission = async (): Promise<PermissionResult> => {
  if (Platform.OS !== 'android') return 'granted';
  try {
    const result = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);

    const fine = result[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
    const coarse = result[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION];

    if (fine === 'granted' && coarse === 'granted') return 'granted';
    if (fine === 'never_ask_again' || coarse === 'never_ask_again') return 'never_ask_again';
    return 'denied';
  } catch (err) {
    console.warn('[Permission] location error:', err);
    return 'denied';
  }
};

export const requestNotificationPermission =async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true;
    }

    // Android 12 and below
    if (Platform.Version < 33) {
      return true;
    }

    try {
      const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS );

      return result === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.warn('[Permission] notification error:',error );

      return false;
    }
  };