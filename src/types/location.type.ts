
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CurrentLocation extends Coordinates {
  address: string;
}

export type LocationErrorCode =
  | 'PERMISSION_DENIED'
  | 'COORDINATES_UNAVAILABLE'
  | 'ADDRESS_UNAVAILABLE';

export const LOCATION_ERROR_MESSAGES: Record<LocationErrorCode, string> = {
  PERMISSION_DENIED: 'Location permission denied',
  COORDINATES_UNAVAILABLE: 'Unable to fetch coordinates',
  ADDRESS_UNAVAILABLE: 'Unable to fetch address',
};