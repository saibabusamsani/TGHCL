import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useTheme, useThemedStyles, AppTheme } from '../../../theme';
import { AppText } from '../../../components';

interface ProjectListItemProps {
  code: string;
  statusText: string;
  onPress?: () => void;
}

export const ProjectListItem: React.FC<ProjectListItemProps> = ({
  code,
  statusText,
  onPress,
}) => {
  const { colors, iconSize } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="home-outline" size={iconSize.md} color={colors.tileIcon} />
      </View>

      <View style={styles.textContainer}>
        <AppText variant="body" color={colors.text} style={styles.code}>
          {code}
        </AppText>
        <AppText variant="caption" color={colors.textLight} numberOfLines={2}>
          {statusText}
        </AppText>
      </View>

      <Ionicons
        name="chevron-forward"
        size={iconSize.sm}
        color={colors.secondary}
      />
    </TouchableOpacity>
  );
};

const createStyles = ({ spacing, colors, radius }: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    iconContainer: {
      width: spacing.xxl + spacing.xs,
      height: spacing.xxl + spacing.xs,
      borderRadius: radius.md,
      backgroundColor: colors.tileBackground,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    textContainer: {
      flex: 1,
      marginRight: spacing.sm,
    },
    code: {
      fontWeight: '700',
      marginBottom: spacing.xs / 2,
    },
  });