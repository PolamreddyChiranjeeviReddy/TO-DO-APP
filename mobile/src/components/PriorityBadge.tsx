import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Priority } from '../types/task';
import { colors, radius, fontSize, spacing, fontWeights } from '../theme/theme';

interface PriorityBadgeProps {
  priority: Priority;
}

const STYLES: Record<Priority, { background: string; text: string }> = {
  HIGH: { background: colors.dangerLight, text: colors.danger },
  MEDIUM: { background: colors.warningLight, text: colors.warning },
  LOW: { background: colors.successLight, text: colors.success },
};

// Tinted priority label
const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const style = STYLES[priority];
  return (
    <View style={[styles.badge, { backgroundColor: style.background }]}>
      <Text style={[styles.text, { color: style.text }]}>{priority}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: fontWeights.bold,
  },
});

export default PriorityBadge;
