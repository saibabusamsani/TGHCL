import { useCallback, useEffect, useRef, useState } from 'react';
import { getCoordinates, getAddressFromCoordinates } from '../services/locationService';
import { LOCATION_ERROR_MESSAGES, CurrentLocation, Coordinates } from '../types';
import Toast from 'react-native-toast-message';

const DEFAULT_REFRESH_INTERVAL_MS = 2 * 60 * 1000; // 2 min
const DEFAULT_FORCE_REFRESH_METERS = 50;

const distanceMeters = (a: Coordinates, b: Coordinates): number => {
  const R = 6371000;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.latitude * Math.PI) / 180) * Math.cos((b.latitude * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

interface UseLocationTrackerOptions {
  refreshIntervalMs?: number;
  forceRefreshMeters?: number;
}

interface UseLocationTrackerResult {
  location: CurrentLocation | null;
  isLocationReady: boolean;
  refreshLocation: (force?: boolean) => Promise<void>;
}

export function useLocationTracker(options?: UseLocationTrackerOptions): UseLocationTrackerResult {
  const refreshIntervalMs = options?.refreshIntervalMs ?? DEFAULT_REFRESH_INTERVAL_MS;
  const forceRefreshMeters = options?.forceRefreshMeters ?? DEFAULT_FORCE_REFRESH_METERS;

  const [location, setLocation] = useState<CurrentLocation | null>(null);
  const [isLocationReady, setIsLocationReady] = useState(false);
  const locationRef = useRef<CurrentLocation | null>(null);

  const refreshLocation = useCallback(
    async (force = false) => {
      const coordsResult = await getCoordinates();
      if (!coordsResult.success) {
         Toast.show({ type: 'error', text1: 'Error', text2: LOCATION_ERROR_MESSAGES[coordsResult.error], position: 'bottom', topOffset: 50 });
        return;
      }

      const prev = locationRef.current;
      const moved = !prev || distanceMeters(prev, coordsResult.data) > forceRefreshMeters;
      if (!force && !moved) return;

      const addressResult = await getAddressFromCoordinates(coordsResult.data.latitude, coordsResult.data.longitude);
      const address = addressResult.success ? addressResult.data : prev?.address ?? 'Address unavailable';

      const next: CurrentLocation = { ...coordsResult.data, address };
      locationRef.current = next;
      setLocation(next);
      setIsLocationReady(true);
    },
    [forceRefreshMeters],
  );

  useEffect(() => {
    refreshLocation(true);
    const timer = setInterval(() => refreshLocation(false), refreshIntervalMs);
    return () => clearInterval(timer);
  }, [refreshLocation, refreshIntervalMs]);

  return { location, isLocationReady, refreshLocation };
}