import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { AppTheme, useTheme, useThemedStyles } from '../../../theme';
import { AppText } from '../../../components';

export interface DropdownOption {
  label: string;
  value: string;
}

interface FormDropdownProps {
  label: string;
  placeholder?: string;
  value: string | null;
  options: DropdownOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  visible?: boolean;
  error?: string | null;
}

const ANIM_CONFIG = {
  open: { duration: 280, easing: Easing.out(Easing.cubic) },
  close: { duration: 220, easing: Easing.in(Easing.cubic) },
};

const useRevealAnimation = (visible: boolean) => {
  const anim = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    const config = visible ? ANIM_CONFIG.open : ANIM_CONFIG.close;
    if (visible) setMounted(true);

    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      useNativeDriver: false,
      ...config,
    }).start(() => {
      if (!visible) setMounted(false);
    });
  }, [visible, anim]);

  return { anim, mounted };
};

export const FormDropdown: React.FC<FormDropdownProps> = ({
  label,
  placeholder = 'Select',
  value,
  options,
  onChange,
  disabled = false,
  visible = true,
  error,
}) => {
  const [focused, setFocused] = useState(false);
  const styles = useThemedStyles(createStyles);
  const { colors, iconSize } = useTheme();

  const field = useRevealAnimation(visible);
  const errorReveal = useRevealAnimation(!!error);

  if (!field.mounted) return null;

  return (
    <Animated.View
      style={{
        opacity: field.anim,
        transform: [{ translateY: field.anim.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] }) }],
      }}
    >
      <View style={styles.wrapper}>
        <AppText variant="caption" style={[styles.label, focused && styles.labelFocused]}>
          {label.toUpperCase()}
        </AppText>

        <Dropdown
          style={[styles.field, focused && styles.fieldFocused, error && styles.fieldError, disabled && styles.fieldDisabled]}
          containerStyle={styles.dropdownContainer}
          itemContainerStyle={styles.itemContainer}
          placeholderStyle={styles.placeholderText}
          selectedTextStyle={styles.valueText}
          itemTextStyle={styles.optionText}
          activeColor={colors.infoLight}
          iconColor={colors.accent}
          iconStyle={{ width: iconSize.sm, height: iconSize.sm }}
          data={options}
          labelField="label"
          valueField="value"
          placeholder={placeholder}
          value={value}
          disable={disabled}
          autoScroll={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(item) => {
            onChange(item.value);
            setFocused(false);
          }}
        />

        {errorReveal.mounted && (
          <Animated.View
            style={{
              opacity: errorReveal.anim,
              transform: [{ translateY: errorReveal.anim.interpolate({ inputRange: [0, 1], outputRange: [-6, 0] }) }],
            }}
          >
            <AppText variant="caption" style={styles.errorText}>
              {error}
            </AppText>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
};

const createStyles = ({ spacing, colors, radius, typography, shadow }: AppTheme) =>
  StyleSheet.create({
    wrapper: { marginBottom: spacing.md },
    label: { color: colors.text, marginBottom: spacing.xs, letterSpacing: 0.8, fontWeight: typography.fontWeight.semibold },
    labelFocused: { color: colors.accent },
    field: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 0.5,
      borderColor: colors.border,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      ...shadow.sm,
    },
    fieldFocused: { borderColor: colors.accent, ...shadow.md },
    fieldError: { borderColor: colors.error },
    fieldDisabled: { opacity: 0.5 },
    dropdownContainer: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 0.5,
      borderColor: colors.border,
      ...shadow.md,
      maxHeight: spacing.xxl * spacing.xl,
    },
    itemContainer: { borderRadius: radius.sm },
    valueText: { color: colors.text, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.medium },
    placeholderText: { color: colors.textLight, fontSize: typography.fontSize.md },
    optionText: { color: colors.text, fontSize: typography.fontSize.md },
    errorText: { color: colors.error, marginTop: spacing.xs, fontWeight: typography.fontWeight.medium },
  });