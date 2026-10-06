import React from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { AppTheme, useTheme, useThemedStyles } from '../../../../theme';
import { AppText, Button } from '../../../../components';


type Props = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  loading?: boolean;
  retryLabel?: string;
};

const NoDetails = ({
  title = 'No Details Found',
  message = "We couldn't find any details to show.",
  onRetry,
  loading = false,
  retryLabel = 'Refresh',
}: Props) => {
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <LottieView
        key={String(isDark)}
        source={require('../../../../assets/lottie/no_details_found.json')}
        autoPlay
        loop
        resizeMode="contain"
        colorFilters={[
          { keypath: 'base', color: colors.primary },
          { keypath: 'muted', color: colors.textLight },
          { keypath: 'surface', color: colors.surface },
        ]}
        style={styles.lottie}
      />
      <AppText variant="h2" color={colors.text} style={styles.text}>
        {title}
      </AppText>
      <AppText variant="body" color={colors.textLight} style={[styles.text, styles.message]}>
        {message}
      </AppText>
      {onRetry && (
        <View style={styles.retry}>
          <Button title={retryLabel} onPress={onRetry} loading={loading} size="md" gradient="primary" />
        </View>
      )}
    </View>
  );
};

const createStyles = ({ spacing, colors, width }: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
      backgroundColor: colors.background,
    },
    lottie: {
      width: Math.min(width * 0.7, 300),
      height: Math.min(width * 0.7, 300),
      marginBottom: spacing.sm,
    },
    text: { textAlign: 'center' },
    message: { marginTop: spacing.xs },
    retry: { marginTop: spacing.lg },
  });

export default NoDetails;