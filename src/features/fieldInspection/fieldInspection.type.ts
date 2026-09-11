
export type CaptureStatus = 'idle' | 'capturing' | 'locating' | 'overlaying';

export interface InspectionPhoto {
  uri: string;
  address: string;
  latitude: number;
  longitude: number;
  capturedAt: string;
}