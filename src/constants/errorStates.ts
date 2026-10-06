import type { AnimationObject } from 'lottie-react-native';

export type ErrorStateType = 'offline' | 'server' | 'forbidden' | 'notFound' | 'generic';

export type ErrorStateConfig = {
  title: string;
  subtitle: string;
  animation: AnimationObject;
  loop?: boolean;
};

export const ERROR_STATES: Record<ErrorStateType, ErrorStateConfig> = {
  offline: {
    title: 'No Internet Connection',
    subtitle: 'Check your network settings and try again.',
    animation: require('../assets/lottie/no_internet.json'),
  },
  server: {
    title: 'Something Went Wrong',
    subtitle: "Our servers are having issues. We're on it.",
    animation: require('../assets/lottie/server_error.json'),
  },
  forbidden: {
    title: 'Access Denied',
    subtitle: "You don't have permission to view this.",
    animation: require('../assets/lottie/forbidden.json'),
  },
  notFound: {
    title: 'Not Found',
    subtitle: "We couldn't find what you're looking for.",
    animation: require('../assets/lottie/not_found.json'),
  },
  generic: {
    title: 'Unexpected Error',
    subtitle: 'Please try again in a moment.',
    animation: require('../assets/lottie/generic_error.json'),
  },
};