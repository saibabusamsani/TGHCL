import Geocoder from 'react-native-geocoding';
import GetLocation from 'react-native-get-location';
import { requestLocationPermission } from './permissionService';
import { GOOGLE_MAPS_API_KEY } from '../constants/appConfig';
import { Coordinates, CurrentLocation, err, LocationErrorCode, ok, Result } from '../types';

Geocoder.init(GOOGLE_MAPS_API_KEY as string);

export const getCoordinates = async (): Promise<Result<Coordinates, LocationErrorCode>> => {
  const permission = await requestLocationPermission();
  if (permission !== 'granted') {
    return err('PERMISSION_DENIED');
  }

  try {
    const location = await GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    });
    return ok({
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
    });
  } catch {
    return err('COORDINATES_UNAVAILABLE');
  }
};

export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<Result<string, LocationErrorCode>> => {
  try {
    const geoResponse = await Geocoder.from(latitude, longitude);
    const address = geoResponse.results?.[0]?.formatted_address;
    return address ? ok(address) : err('ADDRESS_UNAVAILABLE');
  } catch {
    return err('ADDRESS_UNAVAILABLE');
  }
};

export const getCurrentLocation = async (): Promise<Result<CurrentLocation, LocationErrorCode>> => {
  const coordsResult = await getCoordinates();
  if (!coordsResult.success) {
    return coordsResult;
  }

  const addressResult = await getAddressFromCoordinates(
    coordsResult.data.latitude,
    coordsResult.data.longitude
  );

  const address = addressResult.success ? addressResult.data : 'Address unavailable';

  return ok({ ...coordsResult.data, address });
};