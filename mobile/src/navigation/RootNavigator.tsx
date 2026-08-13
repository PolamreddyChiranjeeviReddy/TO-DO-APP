import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '../store';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { colors, radius, spacing, fontSize, fontWeights, shadows } from '../theme/theme';

const RootNavigator = () => {
  const token = useAppSelector(state => state.auth.token);
  const isRestoring = useAppSelector(state => state.auth.isRestoring);

  if (isRestoring) {
    return (
      <View style={styles.loader}>
        <View style={[styles.logo, shadows.raised]}>
          <Text style={styles.logoText}>✓</Text>
        </View>
        <Text style={styles.appName}>Taskly</Text>
        <ActivityIndicator size="small" color={colors.primary} style={styles.spinner} />
      </View>
    );
  }

  return token ? <AppNavigator /> : <AuthNavigator />;
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: colors.white,
    fontSize: fontSize.xxl,
    fontWeight: fontWeights.bold,
  },
  appName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginTop: spacing.md,
  },
  spinner: {
    marginTop: spacing.lg,
  },
});

export default RootNavigator;
