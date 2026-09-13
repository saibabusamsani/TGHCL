import { useCallback, useEffect, useRef, useState } from 'react';
import { launchCamera, Asset } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import LocationOverlayModule from '../../../specs/NativeLocationOverlay';
import { getCoordinates, getAddressFromCoordinates } from '../../../services/locationService';
import { requestCameraPermission } from '../../../services/permissionService';
import { CaptureStatus, InspectionPhoto } from '../fieldInspection.type';
import { LOCATION_ERROR_MESSAGES, CurrentLocation, Coordinates } from '../../../types';

const REFRESH_INTERVAL_MS = 2 * 60 * 1000; // 2 min
const FORCE_REFRESH_METERS = 50;

const showError = (message: string) => {
  Toast.show({ type: 'error', text1: 'Error', text2: message, position: 'bottom', topOffset: 50 });
};

const distanceMeters = (a: Coordinates, b: Coordinates): number => {
  const R = 6371000;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.latitude * Math.PI) / 180) * Math.cos((b.latitude * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

interface UseFieldInspectionCameraResult {
  photos: InspectionPhoto[];
  status: CaptureStatus;
  isBusy: boolean;
  isLocationReady: boolean;
  handleCaptureImage: () => Promise<void>;
  removePhoto: (uri: string) => void;
  clearPhotos: () => void;
}

export function useFieldInspectionCamera(): UseFieldInspectionCameraResult {
  const [photos, setPhotos] = useState<InspectionPhoto[]>([]);
  const [status, setStatus] = useState<CaptureStatus>('idle');
  const [isLocationReady, setIsLocationReady] = useState(false);

  const locationRef = useRef<CurrentLocation | null>(null);
  const inFlightRef = useRef(false);

  const isBusy = status !== 'idle';

  const refreshLocation = useCallback(async (force: boolean) => {
    const coordsResult = await getCoordinates();
    if (!coordsResult.success) {
      showError(LOCATION_ERROR_MESSAGES[coordsResult.error]);
      return;
    }

    const prev = locationRef.current;
    const moved = !prev || distanceMeters(prev, coordsResult.data) > FORCE_REFRESH_METERS;
    if (!force && !moved) return; // hasn't moved — keep cached address, skip geocode

    const addressResult = await getAddressFromCoordinates(coordsResult.data.latitude, coordsResult.data.longitude);
    const address = addressResult.success ? addressResult.data : prev?.address ?? 'Address unavailable';

    locationRef.current = { ...coordsResult.data, address };
    setIsLocationReady(true);
  }, []);

  useEffect(() => {
    refreshLocation(true); // fetch once on screen open
    const timer = setInterval(() => refreshLocation(false), REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [refreshLocation]);

  const handleCaptureImage = useCallback(async () => {
    if (inFlightRef.current || !locationRef.current) return;
    inFlightRef.current = true;

    try {
      const hasCameraPermission = await requestCameraPermission();
      if (!hasCameraPermission) {
        showError('Camera permission denied');
        return;
      }

      setStatus('capturing');
      const result = await launchCamera({ mediaType: 'photo', cameraType: 'back', saveToPhotos: false, quality: 0.9 });

      if (result.didCancel) return;
      if (result.errorCode) {
        showError(result.errorMessage ?? 'Camera error');
        return;
      }

      const asset: Asset | undefined = result.assets?.[0];
      const location = locationRef.current;
      if (!asset?.uri || !location) {
        showError('No image captured');
        return;
      }

      setStatus('overlaying');
      const resultUri = await LocationOverlayModule.overlayLocationDataOnImage(
        asset.uri,
        location.address,
        location.latitude,
        location.longitude
      );

      setPhotos((prev) => [
        ...prev,
        { uri: resultUri, address: location.address, latitude: location.latitude, longitude: location.longitude, capturedAt: new Date().toISOString() },
      ]);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to process image');
    } finally {
      setStatus('idle');
      inFlightRef.current = false;
    }
  }, []);

  const removePhoto = useCallback((uri: string) => {
    setPhotos((prev) => prev.filter((p) => p.uri !== uri));
  }, []);

  const clearPhotos = useCallback(() => setPhotos([]), []);

  return { photos, status, isBusy, isLocationReady, handleCaptureImage, removePhoto, clearPhotos };
}