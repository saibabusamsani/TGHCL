import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { AppTheme, useTheme, useThemedStyles } from '../../../theme';
import { AppText } from '../../../components';

interface FormFieldProps extends TextInputProps {
  label: string;
  hint?: string;
  rightIcon?: ReactNode;
  minLines?: number;
  error?: string | null;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  hint,
  rightIcon,
  style,
  onFocus,
  onBlur,
  multiline,
  minLines = 3,
  onContentSizeChange,
  error,
  ...inputProps
}) => {
  const [focused, setFocused] = useState(false);
  const styles = useThemedStyles(createStyles);
  const { typography, spacing } = useTheme();

  const lineHeight = typography.fontSize.md * 1.4;
  const minHeight = lineHeight * minLines + spacing.md * 2;
  const [contentHeight, setContentHeight] = useState(minHeight);

  const [errorMounted, setErrorMounted] = useState(!!error);
  const [displayError, setDisplayError] = useState(error);
  const errorAnim = useRef(new Animated.Value(error ? 1 : 0)).current;

  useEffect(() => {
    if (error) {
      setDisplayError(error);
      setErrorMounted(true);
      Animated.timing(errorAnim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(errorAnim, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: false,
      }).start(() => setErrorMounted(false));
    }
  }, [error, errorAnim]);

  return (
    <View style={styles.wrapper}>
      <AppText variant="caption" style={[styles.label, focused && styles.labelFocused]}>
        {label.toUpperCase()}
      </AppText>
      {hint ? (
        <AppText variant="caption" style={styles.hint}>
          {hint}
        </AppText>
      ) : null}
      <View style={[styles.inputRow, focused && styles.inputRowFocused, error && styles.inputRowError, multiline && styles.inputRowMultiline]}>
        {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
        <TextInput
          style={[
            styles.input,
            rightIcon ? styles.inputWithIcon : undefined,
            multiline ? { height: Math.max(minHeight, contentHeight), textAlignVertical: 'top' } : undefined,
            style,
          ]}
          placeholderTextColor={styles.placeholder.color}
          multiline={multiline}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          onContentSizeChange={(e) => {
            if (multiline) {
              setContentHeight(e.nativeEvent.contentSize.height);
            }
            onContentSizeChange?.(e);
          }}
          {...inputProps}
        />
      </View>

      {errorMounted ? (
        <Animated.View
          style={{
            opacity: errorAnim,
            maxHeight: errorAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 60] }),
            transform: [
              {
                translateY: errorAnim.interpolate({ inputRange: [0, 1], outputRange: [-6, 0] }),
              },
            ],
            overflow: 'visible',
          }}
        >
          <AppText variant="caption" style={styles.errorText}>{displayError}</AppText>
        </Animated.View>
      ) : null}
    </View>
  );
};

const createStyles = ({ spacing, colors, radius, typography, shadow }: AppTheme) =>
  StyleSheet.create({
    wrapper: { marginBottom: spacing.md },
    label: {  marginBottom: spacing.xs, letterSpacing: 0.8, fontWeight: '700' },
    labelFocused: { color: colors.accent },
    hint: { color: colors.textLight, marginBottom: spacing.xs },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 0.5,
      borderColor: colors.border,
      ...shadow.sm,
    },
    inputRowMultiline: {
      alignItems: 'flex-start',
    },
    inputRowFocused: {
      borderColor: colors.accent,
      ...shadow.md,
    },
    inputRowError: {
      borderColor: colors.error,
    },
    icon: { paddingLeft: spacing.md },
    input: {
      flex: 1,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      fontSize: typography.fontSize.md,
      color: colors.text,
    },
    inputWithIcon: { paddingLeft: spacing.sm },
    placeholder: { color: colors.textLight },
    errorText: {
      color: colors.error,
      marginTop: spacing.xs,
      fontWeight: '600',
    },
  });