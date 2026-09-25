import { useEffect, useMemo, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { AppText } from '../components';
import { colors, iconSize, radius, shadow, spacing, useTheme } from '../theme';


const LOGO_SIZE = iconSize.xl * 4;
const PROGRESS_TRACK_WIDTH = iconSize.xl * 4.5;


const SplashScreen = () => {

  const { isLandscape } = useTheme();

  const logoScale = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, PROGRESS_TRACK_WIDTH],
  });

  const logoAnimatedStyle = useMemo(
    () => ({ opacity: logoOpacity, transform: [{ scale: logoScale }] }),
    [logoOpacity, logoScale],
  );
  const contentAnimatedStyle = useMemo(() => ({ opacity: contentFade }), [contentFade]);
  const progressAnimatedStyle = useMemo(() => ({ width: progressWidth }), [progressWidth]);

  useEffect(() => {
    progressAnim.setValue(0);

    // Fade in title, subtitle, and progress bar smoothly
    Animated.timing(contentFade, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Progress bar looping animation
    const progressLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ]),
    );

    progressLoop.start();

    return () => {
      progressLoop.stop();
      progressAnim.stopAnimation();
    };
  }, [contentFade, progressAnim]);

  return (
    <View style={styles.container}>
      <View
        style={[styles.mainContent, isLandscape ? styles.mainContentRow : styles.mainContentColumn]}
      >
        <Animated.View style={[styles.logoCard, logoAnimatedStyle]}>
          <Animated.Image
            source={require('../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View style={[styles.textContainer, contentAnimatedStyle]}>
          <AppText variant="h2" style={styles.titleText}>
            Telangana Housing Corporation Limited
          </AppText>

          <AppText variant="caption" style={styles.subtitleText}>
            Contractor & Field Monitoring App
          </AppText>

          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressBar, progressAnimatedStyle]} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

export default SplashScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  mainContentRow: {
    flexDirection: 'row',
  },
  mainContentColumn: {
    flexDirection: 'column',
  },
  logoCard: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    backgroundColor: colors.surface,
    borderRadius: radius.full, // Matches circular shape of the TGHCL emblem
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xs,
    marginBottom: spacing.xl,
    ...shadow.lg,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
  },
  titleText: {
    color: colors.surface,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitleText: {
    color: `${colors.surface}CC`, // ~80% opacity tint of surface
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  progressTrack: {
    width: PROGRESS_TRACK_WIDTH,
    height: spacing.xs,
    backgroundColor: `${colors.surface}40`, // ~25% opacity tint of surface
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: radius.full,
  },
});
