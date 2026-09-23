import { useCallback, useEffect, useRef, useState } from 'react';
import { usePhotoOutput } from 'react-native-vision-camera';
import { useImageFaceDetector } from 'react-native-vision-camera-face-detector';

import { requestCameraPermission } from '../../../services/permissionService';
import { FaceScanStatus } from '../type';
import { FACE_SCAN_CONFIG, FACE_SCAN_ERRORS } from '../constants';

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

type VerifyFaceResponse = { verified: boolean; message?: string };

// TODO: replace with RTK mutation → const [verifyFace] = useVerifyFaceMutation();
const mockVerifyFace = async (_photoUri: string): Promise<VerifyFaceResponse> => {
  await sleep(1500);
  return { verified: true };
  // To test failure:
  // return { verified: false, message: 'Face does not match our records.' };
  // throw new Error('Network error');
};

const extractErrorMessage = (err: unknown): string => {
  const e = err as { data?: { message?: string }; message?: string };
  return e?.data?.message ?? e?.message ?? FACE_SCAN_ERRORS.VERIFY_FAILED;
};

export function useFaceVerification() {
  const photoOutput = usePhotoOutput();
  const faceDetector = useImageFaceDetector({ performanceMode: 'accurate' });

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [status, setStatus] = useState<FaceScanStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [photoPath, setPhotoPath] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    requestCameraPermission().then((granted) => {
      if (mounted.current) setHasPermission(granted);
    });
    return () => {
      mounted.current = false;
    };
  }, []);

  const submitPhoto = useCallback(async (path: string) => {
    setStatus('verifying');
    try {
      // TODO: replace with → const res = await verifyFace({ photoUri: path }).unwrap();
      const res = await mockVerifyFace(path);
      if (!mounted.current) return;
      if (res.verified) {
        setStatus('verified');
      } else {
        setError(res.message ?? FACE_SCAN_ERRORS.VERIFY_FAILED);
        setStatus('failed');
      }
    } catch (err) {
      if (!mounted.current) return;
      setError(extractErrorMessage(err));
      setStatus('failed');
    }
  }, []);

  const startScan = useCallback(async () => {
    setStatus('scanning');
    setError(null);
    setPhotoPath(null);
    let reason: string = FACE_SCAN_ERRORS.NO_FACE;

    for (
      let attempt = 0;
      attempt < FACE_SCAN_CONFIG.MAX_ATTEMPTS && mounted.current;
      attempt++
    ) {
      try {
        const file = await photoOutput.capturePhotoToFile({ enableShutterSound: false }, {});
        const path = `file://${file.filePath}`;
        const faces = await faceDetector.detectFaces({ uri: path });

        if (faces.length === 1) {
          if (!mounted.current) return;
          setPhotoPath(path);
          setStatus('captured');
          await submitPhoto(path);
          return;
        }
        reason = faces.length === 0 ? FACE_SCAN_ERRORS.NO_FACE : FACE_SCAN_ERRORS.MULTIPLE_FACES;
      } catch {
        // camera may still be starting — retry
      }
      await sleep(FACE_SCAN_CONFIG.RETRY_DELAY_MS);
    }

    if (mounted.current) {
      setError(reason);
      setStatus('failed');
    }
  }, [photoOutput, faceDetector, submitPhoto]);

  return { photoOutput, hasPermission, status, error, photoPath, startScan };
}