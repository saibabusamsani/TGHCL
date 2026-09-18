import { useCallback, useRef, useState } from 'react';
import { launchCamera, Asset, PhotoQuality } from 'react-native-image-picker';
import LocationOverlayModule from '../specs/NativeLocationOverlay';
import { requestCameraPermission } from '../services/permissionService';
import { CaptureStatus, CapturedPhoto } from '../types/media.type';
import { CurrentLocation } from '../types';
import { showErrorToast } from '../utils/toast.util';

interface UsePhotoCaptureOptions {
  location?: CurrentLocation | null;
  requireLocation?: boolean;
  quality?: number;
}

interface UsePhotoCaptureResult {
  photos: CapturedPhoto[];
  status: CaptureStatus;
  isBusy: boolean;
  capturePhoto: () => Promise<void>;
  removePhoto: (uri: string) => void;
  clearPhotos: () => void;
}

export function usePhotoCapture(options?: UsePhotoCaptureOptions): UsePhotoCaptureResult {
  const { location, requireLocation = false, quality = 0.9 } = options ?? {};

  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [status, setStatus] = useState<CaptureStatus>('idle');
  const inFlightRef = useRef(false);

  const isBusy = status !== 'idle';

  const capturePhoto = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      const hasCameraPermission = await requestCameraPermission();
      if (!hasCameraPermission) {
        showErrorToast('Camera permission denied');
        return;
      }

      setStatus('capturing');
      const result = await launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
        saveToPhotos: false,
        quality: quality as PhotoQuality,
      });

      if (result.didCancel) return;
      if (result.errorCode) {
        showErrorToast(result.errorMessage ?? 'Camera error');
        return;
      }

      const asset: Asset | undefined = result.assets?.[0];
      if (!asset?.uri) {
        showErrorToast('No image captured');
        return;
      }

      // Location fetches in the background while the user frames the shot.
      // Only checked now, after capture — never blocks opening the camera.
      if (requireLocation && !location) {
        showErrorToast('Location not ready — please capture again');
        return;
      }

      let finalUri = asset.uri;

      if (location) {
        setStatus('processing');
        finalUri = await LocationOverlayModule.overlayLocationDataOnImage(
          asset.uri,
          location.address,
          location.latitude,
          location.longitude,
        );
      }

      setPhotos((prev) => [
        ...prev,
        {
          uri: finalUri,
          address: location?.address,
          latitude: location?.latitude,
          longitude: location?.longitude,
          capturedAt: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Failed to process image');
    } finally {
      setStatus('idle');
      inFlightRef.current = false;
    }
  }, [location, requireLocation, quality]);

  const removePhoto = useCallback((uri: string) => {
    setPhotos((prev) => prev.filter((p) => p.uri !== uri));
  }, []);

  const clearPhotos = useCallback(() => setPhotos([]), []);

  return { photos, status, isBusy, capturePhoto, removePhoto, clearPhotos };
}