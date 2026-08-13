import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, fontSize, fontWeights, shadows } from '../theme/theme';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

// Shared layout for the login/register screens: brand header, form card,
// keyboard handling and safe area.
const AuthShell = ({ title, subtitle, children, footer }: AuthShellProps) => (
  <SafeAreaView style={styles.safe}>
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>✓</Text>
          </View>
          <Text style={styles.appName}>Taskly</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.card}>{children}</View>

        {footer}
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    paddingVertical: spacing.xl,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    ...shadows.raised,
  },
  logoText: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: fontWeights.bold,
  },
  appName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
});

export default AuthShell;
