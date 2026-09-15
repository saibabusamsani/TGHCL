import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Ionicons from '@react-native-vector-icons/ionicons';
import { AppTheme, useTheme, useThemedStyles } from '../../../theme';
import { AppText } from '../../../components';

interface FormDateFieldProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
}

const formatDate = (date: Date) => {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}-${mm}-${date.getFullYear()}`;
};

export const FormDateField: React.FC<FormDateFieldProps> = ({ label, value, onChange }) => {
  const styles = useThemedStyles(createStyles);
  const { colors, iconSize } = useTheme();

  const openPicker = () => {
    DateTimePickerAndroid.open({
      value,
      mode: 'date',
      display: 'default',
      onChange: (event, selectedDate) => {
        if (event.type === 'set' && selectedDate) {
          onChange(selectedDate);
        }
      },
    });
  };

  return (
    <View style={styles.wrapper}>
      <AppText variant="caption" style={styles.label}>{label.toUpperCase()}</AppText>
      <TouchableOpacity style={styles.field} activeOpacity={0.85} onPress={openPicker}>
        <AppText variant="body" style={styles.valueText}>{formatDate(value)}</AppText>
        <Ionicons name="calendar-outline" size={iconSize.sm} color={colors.accent} />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = ({ spacing, colors, radius, shadow }: AppTheme) =>
  StyleSheet.create({
    wrapper: { marginBottom: spacing.md },
    label: {  marginBottom: spacing.xs, letterSpacing: 0.8, fontWeight: '700' },
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      ...shadow.sm,
    },
    valueText: { color: colors.text, fontWeight: '600' },
  });