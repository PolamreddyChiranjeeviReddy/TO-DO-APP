import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../components/Button';
import ErrorBanner from '../components/ErrorBanner';
import TaskFormFields, { TaskFormValues } from '../components/TaskFormFields';
import { useAppDispatch, useAppSelector } from '../store';
import { addTask } from '../store/taskSlice';
import { AppStackParamList } from '../navigation/AppNavigator';
import { CATEGORIES } from '../types/task';
import { colors, spacing } from '../theme/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'AddTask'>;

const initialForm: TaskFormValues = {
  title: '',
  description: '',
  dateTime: null,
  deadline: null,
  priority: 'MEDIUM',
  category: CATEGORIES[0],
  tags: '',
};

const AddTaskScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const saving = useAppSelector(state => state.tasks.saving);
  const mutationError = useAppSelector(state => state.tasks.mutationError);
  const [form, setForm] = useState<TaskFormValues>(initialForm);
  const [titleError, setTitleError] = useState<string>();

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

    // Tags arrive as a comma-separated string and are split into an array here;
    // empty entries are dropped before hitting the API
    const result = await dispatch(
      addTask({
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
      })
    );

    // Only leave the screen once the task was actually persisted
    if (addTask.fulfilled.match(result)) {
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
        <TaskFormFields
          values={form}
          onChange={setField}
          titleError={titleError}
        />

        {mutationError ? <ErrorBanner message={mutationError} /> : null}

        <Button title="Add Task" onPress={handleSave} loading={saving} />
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
});

export default AddTaskScreen;
