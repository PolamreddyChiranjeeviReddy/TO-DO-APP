import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing, fontSize, fontWeights } from '../theme/theme';

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  activeColor?: string;
}

// Small selectable pill used for filters, sorts and pickers
const Chip = ({ label, active, onPress, activeColor }: ChipProps) => {
  const activeBackground = activeColor ?? colors.primary;
  return (
    <Pressable
      style={({ pressed }) => [
        styles.chip,
        active && { backgroundColor: activeBackground, borderColor: activeBackground },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text
        style={[styles.text, active && styles.textActive]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 7,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
  },
  textActive: {
    color: colors.white,
  },
});

export default Chip;
