import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import TaskFormFields, { TaskFormValues } from '../components/TaskFormFields';
import { useAppDispatch, useAppSelector } from '../store';
import { editTask } from '../store/taskSlice';
import { AppStackParamList } from '../navigation/AppNavigator';
import { CATEGORIES } from '../types/task';
import { colors, spacing, fontSize, fontWeights } from '../theme/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'EditTask'>;

const EditTaskScreen = ({ route, navigation }: Props) => {
  const { taskId } = route.params;
  const dispatch = useAppDispatch();
  const saving = useAppSelector(state => state.tasks.saving);
  const mutationError = useAppSelector(state => state.tasks.mutationError);
  const task = useAppSelector(state =>
    state.tasks.tasks.find(item => item._id === taskId)
  );

  const [form, setForm] = useState<TaskFormValues>({
    title: task?.title ?? '',
    description: task?.description ?? '',
    dateTime: task?.dateTime ?? null,
    deadline: task?.deadline ?? null,
    priority: task?.priority ?? 'MEDIUM',
    category: task?.category || CATEGORIES[0],
    tags: task?.tags.join(', ') ?? '',
  });
  const [titleError, setTitleError] = useState<string>();

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

  const setField = <K extends keyof TaskFormValues>(
    key: K,
    value: TaskFormValues[K]
  ) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (key === 'title' && titleError) {
      setTitleError(undefined);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setTitleError('Title is required');
      return;
    }

    const result = await dispatch(
      editTask({
        id: taskId,
        data: {
          title: form.title.trim(),
          description: form.description.trim() || undefined,
          dateTime: form.dateTime ?? undefined,
          deadline: form.deadline ?? undefined,
          priority: form.priority,
          category: form.category,
          tags: form.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean),
        },
      })
    );

    if (editTask.fulfilled.match(result)) {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Edit Task</Text>

        <TaskFormFields
          values={form}
          onChange={setField}
          titleError={titleError}
        />

        {mutationError ? <ErrorBanner message={mutationError} /> : null}

        <Button title="Save Changes" onPress={handleSave} loading={saving} />
      </ScrollView>
    </KeyboardAvoidingView>
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
  heading: {
    fontSize: fontSize.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
});

export default EditTaskScreen;
