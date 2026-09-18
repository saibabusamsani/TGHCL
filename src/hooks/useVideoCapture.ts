import { useCallback, useRef, useState } from 'react';
import { launchCamera, Asset } from 'react-native-image-picker';
import { createThumbnail } from 'react-native-create-thumbnail';
import { requestCameraPermission } from '../services/permissionService';
import { CaptureStatus, CapturedVideo } from '../types/media.type';
import Toast from 'react-native-toast-message';

interface UseVideoCaptureOptions {
  maxDurationSeconds?: number;
  videoQuality?: 'high' | 'medium' | 'low';
}

interface UseVideoCaptureResult {
  video: CapturedVideo | null;
  status: CaptureStatus;
  isBusy: boolean;
  captureVideo: () => Promise<void>;
  removeVideo: () => void;
}

export function useVideoCapture(options?: UseVideoCaptureOptions): UseVideoCaptureResult {
  const { maxDurationSeconds, videoQuality = 'high' } = options ?? {};

  const [video, setVideo] = useState<CapturedVideo | null>(null);
  const [status, setStatus] = useState<CaptureStatus>('idle');
  const inFlightRef = useRef(false);

  const isBusy = status !== 'idle';

  const captureVideo = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      const hasCameraPermission = await requestCameraPermission();
      if (!hasCameraPermission) {
          Toast.show({ type: 'error', text1: 'Error', text2: "Camera permission denied", position: 'bottom', topOffset: 50 });

        return;
      }

      setStatus('capturing');
      const result = await launchCamera({
        mediaType: 'video',
        cameraType: 'back',
        saveToPhotos: false,
        videoQuality,
        ...(maxDurationSeconds ? { durationLimit: maxDurationSeconds } : {}),
      });

      if (result.didCancel) return;
      if (result.errorCode) {
         Toast.show({ type: 'error', text1: 'Error', text2: result.errorMessage ?? 'Camera error', position: 'bottom', topOffset: 50 });
        return;
      }

      const asset: Asset | undefined = result.assets?.[0];
      if (!asset?.uri) {
         Toast.show({ type: 'error', text1: 'Error', text2: "No video captured", position: 'bottom', topOffset: 50 });
        return;
      }

      setStatus('processing');
      const thumbnail = await createThumbnail({ url: asset.uri });

      setVideo({
        uri: asset.uri,
        thumbnailUri: thumbnail.path,
        durationSeconds: asset.duration ?? 0,
        capturedAt: new Date().toISOString(),
      });
    } catch (error) {
         Toast.show({ type: 'error', text1: 'Error', text2: error instanceof Error ? error.message : 'Failed to process video', position: 'bottom', topOffset: 50 });
    } finally {
      setStatus('idle');
      inFlightRef.current = false;
    }
  }, [maxDurationSeconds, videoQuality]);

  const removeVideo = useCallback(() => setVideo(null), []);

  return { video, status, isBusy, captureVideo, removeVideo };
}