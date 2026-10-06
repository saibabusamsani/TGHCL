import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useTheme, useThemedStyles, AppTheme } from '../theme';
import { AppText } from './AppText';
import { Button } from './Button';
import { ErrorStateType, ERROR_STATES } from '../constants';

type Props = {
  type: ErrorStateType;
  onRetry?: () => void;
  retryLabel?: string;
  retryLoading?: boolean;
};

const ErrorState: React.FC<Props> = ({
  type,
  onRetry,
  retryLabel = 'Try Again',
  retryLoading = false,
}) => {
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(createStyles);
  const config = ERROR_STATES[type];

  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    fade.setValue(0);
    scale.setValue(0.85);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, tension: 60, useNativeDriver: true }),
    ]).start();
  }, [type, fade, scale]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fade, transform: [{ scale }] }}>
        <LottieView
          key={`${type}-${isDark}`}
          source={config.animation}
          autoPlay
          loop={config.loop ?? true}
          resizeMode="contain"
          colorFilters={[
            { keypath: 'base', color: colors.primary },
            { keypath: 'accent', color: colors.error },
          ]}
          style={styles.lottie}
        />
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: fade }]}>
        <AppText variant="h2" color={colors.text} style={styles.title}>
          {config.title}
        </AppText>
        <AppText variant="body" color={colors.textLight} style={styles.subtitle}>
          {config.subtitle}
        </AppText>
        {onRetry && (
          <View style={styles.buttonWrap}>
            <Button
              title={retryLabel}
              onPress={onRetry}
              loading={retryLoading}
              size="md"
              gradient="primary"
            />
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const createStyles = ({ spacing, colors, width }: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
      backgroundColor: colors.background,
    },
    lottie: {
      width: Math.min(width * 0.7, 300),
      height: Math.min(width * 0.7, 300),
      marginBottom: spacing.sm,
    },
    content: {
      alignItems: 'center',
    },
    title: {
      textAlign: 'center',
    },
    subtitle: {
      marginTop: spacing.xs,
      textAlign: 'center',
    },
    buttonWrap: {
      marginTop: spacing.lg,
    },
  });

export default ErrorState;