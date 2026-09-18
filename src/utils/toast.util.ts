import Toast from 'react-native-toast-message';

export const showErrorToast = (message: string): void => {
  Toast.show({ type: 'error', text1: 'Error', text2: message, position: 'bottom', topOffset: 50 });
};