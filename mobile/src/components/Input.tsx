import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { colors, radius, spacing, fontSize, fontWeights } from '../theme/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

// Text input with label, focus highlight, inline error and a show/hide
// toggle for secure fields.
const Input = ({ label, error, style, secureTextEntry, ...props }: InputProps) => {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));

  const toggleable = Boolean(secureTextEntry);

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
      ) : null}
      <View
        style={[
          styles.inputWrap,
          focused && styles.inputWrapFocused,
          error && styles.inputWrapError,
        ]}
      >
        <TextInput
          style={[styles.input, toggleable && styles.inputWithToggle, style]}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={hidden}
          {...props}
        />
        {toggleable ? (
          <Pressable
            style={styles.toggle}
            onPress={() => setHidden(prev => !prev)}
            hitSlop={8}
          >
            <Text style={styles.toggleText}>{hidden ? 'Show' : 'Hide'}</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: fontWeights.medium,
  },
  labelFocused: {
    color: colors.primary,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  inputWrapFocused: {
    borderColor: colors.primary,
  },
  inputWrapError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
  },
  inputWithToggle: {
    paddingRight: spacing.sm,
  },
  toggle: {
    paddingHorizontal: spacing.md,
    height: 48,
    justifyContent: 'center',
  },
  toggleText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeights.semibold,
  },
  error: {
    color: colors.danger,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
});

export default Input;
