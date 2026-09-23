import type { LottieViewProps } from 'lottie-react-native';
import { FaceScanStatus } from './type';

type LottieSource = LottieViewProps['source'];

type FaceScanAnimation = {
  key: string;
  source: LottieSource;
  loop: boolean;
};

export const FACE_SCAN_CONFIG = {
  MAX_ATTEMPTS: 10,
  RETRY_DELAY_MS: 700,
  FADE_DURATION_MS: 300,
} as const;

export const FACE_SCAN_ERRORS = {
  NO_FACE: 'No face detected. Hold the phone at face level and look at the screen.',
  MULTIPLE_FACES: 'Multiple faces detected. Only you should be in front of the phone.',
  NO_PERMISSION: 'Camera permission is required',
  NO_DEVICE: 'No camera device found',
  VERIFY_FAILED: 'Face verification failed. Please try again.',
} as const;

export const FACE_SCAN_MESSAGE: Record<FaceScanStatus, string> = {
  idle: 'Getting ready…',
  scanning: 'Hold your phone at face level and look at the screen',
  captured: 'Face captured',
  verifying: 'Verifying your face…',
  verified: 'Face verified successfully',
  failed: '',
};

export const FACE_SCAN_ANIMATION: Record<FaceScanStatus, FaceScanAnimation> = {
  idle: { key: 'scan', source: require('../../assets/lottie/face-scan.json'), loop: true },
  scanning: { key: 'scan', source: require('../../assets/lottie/face-scan.json'), loop: true },
  captured: { key: 'scan', source: require('../../assets/lottie/face-scan.json'), loop: true },
  verifying: { key: 'scan', source: require('../../assets/lottie/face-scan.json'), loop: true },
  verified: { key: 'success', source: require('../../assets/lottie/success.json'), loop: false },
  failed: { key: 'error', source: require('../../assets/lottie/error.json'), loop: false },
};