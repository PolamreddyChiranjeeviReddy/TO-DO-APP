import React, { useMemo } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import { useAppDispatch, useAppSelector } from '../store';
import { logout } from '../store/authSlice';
import { resetTasks } from '../store/taskSlice';
import { calculateTaskStats } from '../utils/taskStats';
import { colors, radius, spacing, fontSize, fontWeights, shadows } from '../theme/theme';

interface StatBoxProps {
  label: string;
  value: number;
  accent: string;
  tint: string;
}

const StatBox = ({ label, value, accent, tint }: StatBoxProps) => (
  <View style={[styles.statBox, { backgroundColor: tint }]}>
    <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const tasks = useAppSelector(state => state.tasks.tasks);
  const stats = useMemo(() => calculateTaskStats(tasks), [tasks]);

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          // Clear local task state first, then end the session
          dispatch(resetTasks());
          dispatch(logout());
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <View style={[styles.card, shadows.card]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.statsRow}>
        <StatBox
          label="Total"
          value={stats.total}
          accent={colors.primary}
          tint={colors.primaryLight}
        />
        <StatBox
          label="Completed"
          value={stats.completed}
          accent={colors.success}
          tint={colors.successLight}
        />
        <StatBox
          label="Overdue"
          value={stats.overdue}
          accent={colors.danger}
          tint={colors.dangerLight}
        />
      </View>

      <Button title="Log Out" variant="danger" onPress={handleLogout} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    color: colors.white,
    fontSize: fontSize.xxl,
    fontWeight: fontWeights.bold,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  email: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  statBox: {
    flex: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeights.bold,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: fontWeights.medium,
  },
});

export default ProfileScreen;
