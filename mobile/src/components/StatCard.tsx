import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, fontSize, fontWeights, shadows } from '../theme/theme';

interface StatCardProps {
  label: string;
  value: number;
  accent?: string;
}

// Small dashboard statistic card
const StatCard = ({ label, value, accent }: StatCardProps) => (
  <View style={styles.card}>
    <Text style={[styles.value, accent ? { color: accent } : null]}>{value}</Text>
    <Text style={styles.label} numberOfLines={1}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    ...shadows.card,
  },
  value: {
    fontSize: fontSize.lg,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default StatCard;
