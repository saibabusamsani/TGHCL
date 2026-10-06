import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import { useTheme } from '../../../theme';

const MileStoneTracker = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primary + '15' }]}>
        <Icon name="flag-outline" size={56} color={colors.primary} />
      </View>

      <Text style={[styles.title, { color: colors.text }]}>Milestone Tracker</Text>

      <View style={[styles.badge, { backgroundColor: colors.primary }]}>
        <Icon name="rocket-outline" size={14} color="#fff" />
        <Text style={styles.badgeText}>Coming Soon</Text>
      </View>

      <Text style={[styles.message, { color: colors.textLight }]}>
        Track your house construction progress stage by stage. This feature will be available soon.
      </Text>
    </View>
  );
};

export default MileStoneTracker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
});