import { useCallback, useRef, useState } from 'react';
import { pick, isErrorWithCode, errorCodes, types } from '@react-native-documents/picker';
import { CaptureStatus, PickedDocument } from '../types/media.type';
import Toast from 'react-native-toast-message';

interface UseDocumentPickerOptions {
  allowedTypes?: string[];
}

interface UseDocumentPickerResult {
  document: PickedDocument | null;
  status: CaptureStatus;
  isBusy: boolean;
  pickDocument: () => Promise<void>;
  removeDocument: () => void;
}

export function useDocumentPicker(options?: UseDocumentPickerOptions): UseDocumentPickerResult {
  const { allowedTypes = [types.pdf] } = options ?? {};

  const [document, setDocument] = useState<PickedDocument | null>(null);
  const [status, setStatus] = useState<CaptureStatus>('idle');
  const inFlightRef = useRef(false);

  const isBusy = status !== 'idle';

  const pickDocument = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      setStatus('capturing');
      const [result] = await pick({ type: allowedTypes });

      setDocument({
        uri: result.uri,
        name: result.name ?? 'Document',
        mimeType: result.type ?? 'application/octet-stream',
        sizeBytes: result.size ?? 0,
        verificationStatus: 'pending',
        pickedAt: new Date().toISOString(),
      });
    } catch (error) {
      if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) {
        return;
      }
       Toast.show({ type: 'error', text1: 'Error', text2: error instanceof Error ? error.message : 'Failed to pick document', position: 'bottom', topOffset: 50 });
    } finally {
      setStatus('idle');
      inFlightRef.current = false;
    }
  }, [allowedTypes]);

  const removeDocument = useCallback(() => setDocument(null), []);

  return { document, status, isBusy, pickDocument, removeDocument };
}