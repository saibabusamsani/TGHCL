export type CaptureStatus = 'idle' | 'capturing' | 'processing';

export interface CapturedPhoto {
  uri: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  capturedAt: string;
}

export interface CapturedVideo {
  uri: string;
  thumbnailUri: string;
  durationSeconds: number;
  capturedAt: string;
}

export type DocumentVerificationStatus = 'pending' | 'verified' | 'failed';

export interface PickedDocument {
  uri: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  verificationStatus: DocumentVerificationStatus;
  pickedAt: string;
}

export type EvidenceItem = { type: 'photo'; photo: CapturedPhoto } | { type: 'video'; video: CapturedVideo };