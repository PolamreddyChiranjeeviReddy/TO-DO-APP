import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, fontSize, fontWeights } from '../theme/theme';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  children?: React.ReactNode;
}

// Centered empty state used for the task list
const EmptyState = ({ icon = '🗒️', title, message, children }: EmptyStateProps) => (
  <View style={styles.container}>
    <View style={styles.iconWrap}>
      <Text style={styles.icon}>{icon}</Text>
    </View>
    <Text style={styles.title}>{title}</Text>
    {message ? <Text style={styles.message}>{message}</Text> : null}
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl + spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  message: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyState;
