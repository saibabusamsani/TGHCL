import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import Toast from 'react-native-toast-message';

import { ErrorStateType } from '../constants/errorStates';

export type ReduxApiError = {
  status: number | null;
  message: string;
};

const DEFAULT_MESSAGE = 'Something went wrong. Please try again.';
const GLOBAL_TOAST_THROTTLE_MS = 3000;

let lastGlobalToastAt = 0;


export const toReduxError = (error: FetchBaseQueryError): ReduxApiError => {
  if (typeof error.status === 'number') {
    const data = error.data as { message?: string } | undefined;
    return { status: error.status, message: data?.message || DEFAULT_MESSAGE };
  }

  switch (error.status) {
    case 'FETCH_ERROR':
      return { status: null, message: 'Network issue. Check your connection.' };
    case 'TIMEOUT_ERROR':
      return { status: null, message: 'Request timed out. Please try again.' };
    case 'PARSING_ERROR':
      return { status: error.originalStatus, message: DEFAULT_MESSAGE };
    default:
      return { status: null, message: error.error || DEFAULT_MESSAGE };
  }
};

const getGlobalErrorMessage = ({ status, message }: ReduxApiError): string | null => {
  if (status === 403) return 'You don’t have permission to do this.';
  if (status === null) return message;
  if (status >= 500) return 'Something went wrong on our end. Please try again.';
  return null; // 401 -> auth flow; 400/404/422 -> screen-level handling
};


export const notifyGlobalError = (error: ReduxApiError): void => {
  const message = getGlobalErrorMessage(error);
  const now = Date.now();

  if (message && now - lastGlobalToastAt > GLOBAL_TOAST_THROTTLE_MS) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: message,
      position: 'top'
    });
    lastGlobalToastAt = now;
  }
};

const isReduxApiError = (error: unknown): error is ReduxApiError =>
  typeof error === 'object' && error !== null && 'status' in error && 'message' in error;

export const mapErrorToType = ({ status }: ReduxApiError): ErrorStateType => {
  if (status === null) return 'offline';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'notFound';
  if (status >= 500) return 'server';
  return 'generic';
};

// For <ErrorState />: pass the hook's `error` directly.
export const getErrorType = (error: unknown): ErrorStateType =>
  isReduxApiError(error) ? mapErrorToType(error) : 'generic';

// For inline messages (400/404/422): pass the hook's `error` directly.
export const getErrorMessage = (error: unknown): string =>
  isReduxApiError(error) ? error.message : DEFAULT_MESSAGE;