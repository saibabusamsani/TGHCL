import FileViewer from 'react-native-file-viewer';
import { showErrorToast } from './toast.util';

export const openDocumentExternally = async (uri: string): Promise<void> => {
  try {
    await FileViewer.open(uri, { showOpenWithDialog: true });
  } catch {
    showErrorToast('No app found to open this file');
  }
};