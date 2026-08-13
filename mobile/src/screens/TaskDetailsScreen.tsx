import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import PriorityBadge from '../components/PriorityBadge';
import { useAppDispatch, useAppSelector } from '../store';
import { editTask, removeTask } from '../store/taskSlice';
import { AppStackParamList } from '../navigation/AppNavigator';
import { formatDateTime, getTaskStatus } from '../utils/dateUtils';
import { colors, radius, spacing, fontSize, fontWeights, shadows } from '../theme/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'TaskDetails'>;

const TaskDetailsScreen = ({ route, navigation }: Props) => {
  const { taskId } = route.params;
  const dispatch = useAppDispatch();
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const task = useAppSelector(state =>
    state.tasks.tasks.find(item => item._id === taskId)
  );

  const status = useMemo(() => (task ? getTaskStatus(task) : 'pending'), [task]);

  if (!task) {
    return (
      <View style={styles.missing}>
        <EmptyState
          icon="🗒️"
          title="Task not found"
          message="This task may have been deleted."
        />
      </View>
    );
  }

  const handleToggleComplete = async () => {
    setToggling(true);
    const result = await dispatch(
      editTask({
        id: taskId,
        data: { completed: !task.completed },
      })
    );
    setToggling(false);
    if (editTask.rejected.match(result)) {
      Alert.alert('Error', result.payload || 'Could not update task');
    }
  };

  // Destructive action guarded by a confirmation dialog
  const handleDelete = () => {
    Alert.alert('Delete task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setDeleting(true);
          const result = await dispatch(removeTask(taskId));
          setDeleting(false);
          if (removeTask.rejected.match(result)) {
            Alert.alert('Error', result.payload || 'Could not delete task');
          } else {
            navigation.goBack();
          }
        },
      },
    ]);
  };

  const statusPillColor =
    status === 'completed'
      ? colors.successLight
      : status === 'overdue'
        ? colors.dangerLight
        : colors.warningLight;
  const statusTextColor =
    status === 'completed'
      ? colors.success
      : status === 'overdue'
        ? colors.danger
        : colors.warning;

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <View style={[styles.card, shadows.card]}>
        <View style={styles.header}>
          <Text style={styles.title}>{task.title}</Text>
          <PriorityBadge priority={task.priority} />
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.label}>Status</Text>
          <View style={[styles.statusPill, { backgroundColor: statusPillColor }]}>
            <Text style={[styles.statusText, { color: statusTextColor }]}>
              {status.toUpperCase()}
            </Text>
          </View>
        </View>

        {task.description ? (
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{task.description}</Text>
          </View>
        ) : null}

        <View style={styles.metaRow}>
          <Text style={styles.label}>Date & time</Text>
          <Text style={styles.value}>
            {task.dateTime ? formatDateTime(task.dateTime) : 'Not set'}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.label}>Deadline</Text>
          <Text style={styles.value}>
            {task.deadline ? formatDateTime(task.deadline) : 'Not set'}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.label}>Category</Text>
          <Text style={styles.value}>{task.category || 'General'}</Text>
        </View>

        {task.tags.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.label}>Tags</Text>
            <View style={styles.tagsRow}>
              {task.tags.map(tag => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.actions}>
          <Button
            title={task.completed ? 'Mark as Incomplete' : 'Mark as Completed'}
            onPress={handleToggleComplete}
            loading={toggling}
          />
          <Button
            title="Edit Task"
            variant="secondary"
            onPress={() => navigation.navigate('EditTask', { taskId })}
          />
          <Button
            title="Delete Task"
            variant="danger"
            onPress={handleDelete}
            loading={deleting}
          />
        </View>
      </View>
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
  missing: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statusPill: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeights.bold,
  },
  section: {
    marginTop: spacing.md,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  value: {
    fontSize: fontSize.md,
    color: colors.text,
    maxWidth: '70%',
    textAlign: 'right',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  tag: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});

export default TaskDetailsScreen;
