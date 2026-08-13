import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, fontSize, fontWeights } from '../theme/theme';

interface SectionHeaderProps {
  title: string;
  count?: number;
}

// Dashboard section heading, e.g. "TODAY'S TASKS" with a task count
const SectionHeader = ({ title, count }: SectionHeaderProps) => (
  <View style={styles.row}>
    <View style={styles.titleWrap}>
      <View style={styles.dot} />
      <Text style={styles.title}>{title}</Text>
    </View>
    {count !== undefined ? (
      <Text style={styles.count}>
        {count} task{count === 1 ? '' : 's'}
      </Text>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: fontSize.sm,
    fontWeight: fontWeights.bold,
    color: colors.text,
    letterSpacing: 0.4,
  },
  count: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
});

export default SectionHeader;
