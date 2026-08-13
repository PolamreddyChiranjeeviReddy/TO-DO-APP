import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Task } from '../types/task';
import PriorityBadge from './PriorityBadge';
import { colors, radius, spacing, fontSize, fontWeights, shadows } from '../theme/theme';
import { formatDateTime, getTaskStatus } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onToggleComplete?: () => void;
}

// Tappable summary card for a single task: completion checkbox, title,
// description snippet, category/deadline meta and a live status label
const TaskCard = ({ task, onPress, onToggleComplete }: TaskCardProps) => {
  const status = getTaskStatus(task);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={styles.header}>
        {onToggleComplete ? (
          <Pressable
            style={[
              styles.checkbox,
              task.completed && styles.checkboxChecked,
            ]}
            onPress={onToggleComplete}
            hitSlop={10}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: task.completed }}
            accessibilityLabel={
              task.completed ? 'Mark as incomplete' : 'Mark as completed'
            }
          >
            {task.completed ? <Text style={styles.checkboxMark}>✓</Text> : null}
          </Pressable>
        ) : null}
        <Text
          style={[styles.title, task.completed && styles.titleCompleted]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
        <PriorityBadge priority={task.priority} />
      </View>

      {task.description ? (
        <Text numberOfLines={2} style={styles.description}>
          {task.description}
        </Text>
      ) : null}

      <View style={styles.footer}>
        <View style={styles.meta}>
          {task.category ? (
            <View style={styles.categoryChip}>
              <Text style={styles.categoryText} numberOfLines={1}>
                {task.category}
              </Text>
            </View>
          ) : null}
          {task.deadline ? (
            <Text style={styles.deadlineText} numberOfLines={1}>
              Due {formatDateTime(task.deadline)}
            </Text>
          ) : null}
        </View>
        <Text
          style={[
            styles.status,
            status === 'completed' && styles.statusCompleted,
            status === 'overdue' && styles.statusOverdue,
          ]}
        >
          {status.toUpperCase()}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkboxMark: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeights.bold,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
    gap: spacing.sm,
  },
  categoryChip: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    flexShrink: 1,
  },
  categoryText: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: fontWeights.medium,
  },
  deadlineText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    flexShrink: 1,
  },
  status: {
    fontSize: fontSize.xs,
    fontWeight: fontWeights.bold,
    color: colors.warning,
  },
  statusCompleted: {
    color: colors.success,
  },
  statusOverdue: {
    color: colors.danger,
  },
});

export default TaskCard;
