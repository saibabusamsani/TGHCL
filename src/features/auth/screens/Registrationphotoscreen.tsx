import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

import {
  FACE_SCAN_ANIMATION,
  FACE_SCAN_CONFIG,
  FACE_SCAN_ERRORS,
  FACE_SCAN_MESSAGE,
} from '../constants';
import { useFaceVerification } from '../hooks/useFaceVerification';

const fadeIn = (value: Animated.Value) => {
  value.setValue(0);
  Animated.timing(value, {
    toValue: 1,
    duration: FACE_SCAN_CONFIG.FADE_DURATION_MS,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();
};

const appear = (v: Animated.Value, from: number) => ({
  opacity: v,
  transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [from, 0] }) }],
});

export default function RegistrationPhotoScreen() {
  const device = useCameraDevice('back');
  const isFocused = useIsFocused();
  const { photoOutput, hasPermission, status, error, startScan } = useFaceVerification();

  const anim = FACE_SCAN_ANIMATION[status];
  const message = error ?? FACE_SCAN_MESSAGE[status];

  const animIn = useRef(new Animated.Value(0)).current;
  const textIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (hasPermission && device && status === 'idle') startScan();
  }, [hasPermission, device, status, startScan]);

  // Fade only when the animation actually changes (idle → scanning → verifying keeps playing smoothly)
  useEffect(() => fadeIn(animIn), [anim.key, animIn]);
  useEffect(() => fadeIn(textIn), [message, textIn]);

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!hasPermission || !device) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>
          {!hasPermission ? FACE_SCAN_ERRORS.NO_PERMISSION : FACE_SCAN_ERRORS.NO_DEVICE}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Camera
        style={styles.hiddenCamera}
        device={device}
        isActive={isFocused && status === 'scanning'}
        outputs={[photoOutput]}
      />

      <Animated.View
        style={[
          styles.animation,
          {
            opacity: animIn,
            transform: [{ scale: animIn.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }],
          },
        ]}
      >
        <LottieView
          key={anim.key}
          source={anim.source}
          autoPlay
          loop={anim.loop}
          style={styles.lottie}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.Text
        style={[
          styles.message,
          status === 'verified' && styles.success,
          status === 'failed' && styles.error,
          appear(textIn, 8),
        ]}
        accessibilityLiveRegion="polite"
      >
        {message}
      </Animated.Text>

      {status === 'failed' && (
        <Animated.View style={appear(textIn, 12)}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            onPress={startScan}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Try again</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#fff',
  },
  hiddenCamera: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    width: 1,
    height: 1,
  },
  animation: { width: 220, height: 220 },
  lottie: { width: '100%', height: '100%' },
  message: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
    textAlign: 'center',
    lineHeight: 22,
  },
  success: { color: '#15803D' },
  error: { color: '#B91C1C' },
  button: {
    marginTop: 24,
    backgroundColor: '#111',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});