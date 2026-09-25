import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { toReduxError } from '../src/api/errorHandler';

jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: {
    show: jest.fn(),
  },
}));

describe('toReduxError', () => {
  it('should return API error message for HTTP error', () => {
    const error = {
      status: 400,
      data: {
        message: 'Invalid request',
      },
    } as FetchBaseQueryError;

    expect(toReduxError(error)).toEqual({
      status: 400,
      message: 'Invalid request',
    });
  });

  it('should return default message when API message is missing', () => {
    const error = {
      status: 500,
      data: {},
    } as FetchBaseQueryError;

    expect(toReduxError(error)).toEqual({
      status: 500,
      message: 'Something went wrong. Please try again.',
    });
  });

  it('should handle network error', () => {
    const error = {
      status: 'FETCH_ERROR',
      error: 'Network request failed',
    } as FetchBaseQueryError;

    expect(toReduxError(error)).toEqual({
      status: null,
      message: 'Network issue. Check your connection.',
    });
  });

  it('should handle timeout error', () => {
    const error = {
      status: 'TIMEOUT_ERROR',
      error: 'Request timed out',
    } as FetchBaseQueryError;

    expect(toReduxError(error)).toEqual({
      status: null,
      message: 'Request timed out. Please try again.',
    });
  });

  it('should handle parsing error', () => {
    const error = {
      status: 'PARSING_ERROR',
      originalStatus: 500,
      error: 'Invalid JSON',
    } as FetchBaseQueryError;

    expect(toReduxError(error)).toEqual({
      status: 500,
      message: 'Something went wrong. Please try again.',
    });
  });

  it('should handle unknown error', () => {
    const error = {
      status: 'CUSTOM_ERROR',
      error: 'Something went wrong',
    } as FetchBaseQueryError;

    expect(toReduxError(error)).toEqual({
      status: null,
      message: 'Something went wrong',
    });
  });
});