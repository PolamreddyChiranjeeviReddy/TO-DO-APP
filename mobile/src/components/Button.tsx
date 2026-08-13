import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, shadows, spacing, fontSize, fontWeights } from '../theme/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
}

const Button = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}: ButtonProps) => {
  const backgroundColor =
    variant === 'primary'
      ? colors.primary
      : variant === 'danger'
        ? colors.danger
        : colors.primaryLight;

  const textColor =
    variant === 'primary' || variant === 'danger' ? colors.white : colors.primary;

  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor },
        variant === 'primary' && styles.primaryShadow,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      android_ripple={
        isDisabled ? undefined : { color: 'rgba(255,255,255,0.25)' }
      }
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text
          style={[styles.text, { color: textColor }]}
          numberOfLines={1}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
  },
  primaryShadow: shadows.raised,
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.55,
  },
  text: {
    fontSize: fontSize.md,
    fontWeight: fontWeights.semibold,
  },
});

export default Button;
