import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, fontSize, fontWeights } from '../theme/theme';

interface ErrorBannerProps {
  message: string;
}

// Soft red banner used to surface API/form errors
const ErrorBanner = ({ message }: ErrorBannerProps) => (
  <View style={styles.banner}>
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.dangerLight,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginBottom: spacing.md,
  },
  text: {
    color: colors.danger,
    fontSize: fontSize.sm,
    fontWeight: fontWeights.medium,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default ErrorBanner;
