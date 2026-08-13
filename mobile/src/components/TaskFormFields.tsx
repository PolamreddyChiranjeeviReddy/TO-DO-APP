import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CATEGORIES, Priority } from '../types/task';
import Chip from './Chip';
import DateTimeField from './DateTimeField';
import Input from './Input';
import { priorityColors, colors, spacing, fontSize, fontWeights } from '../theme/theme';

export interface TaskFormValues {
  title: string;
  description: string;
  dateTime: string | null;
  deadline: string | null;
  priority: Priority;
  category: string;
  tags: string;
}

interface TaskFormFieldsProps {
  values: TaskFormValues;
  onChange: <K extends keyof TaskFormValues>(
    key: K,
    value: TaskFormValues[K]
  ) => void;
  titleError?: string;
}

const PRIORITIES: Priority[] = ['LOW', 'MEDIUM', 'HIGH'];

// Shared fields for the add/edit task screens
const TaskFormFields = ({ values, onChange, titleError }: TaskFormFieldsProps) => {
  return (
    <View>
      <Input
        label="Title *"
        value={values.title}
        onChangeText={value => {
          onChange('title', value);
          if (titleError) onChange('title', value);
        }}
        placeholder="What needs to be done?"
        error={titleError}
      />
      <Input
        label="Description"
        value={values.description}
        onChangeText={value => onChange('description', value)}
        placeholder="Add more detail (optional)"
        multiline
        numberOfLines={4}
        style={styles.multiline}
      />

      <DateTimeField
        label="Date & time"
        value={values.dateTime}
        onChange={value => onChange('dateTime', value)}
      />
      <DateTimeField
        label="Deadline"
        value={values.deadline}
        onChange={value => onChange('deadline', value)}
      />

      <Text style={styles.label}>Priority</Text>
      <View style={styles.optionsRow}>
        {PRIORITIES.map(level => (
          <Chip
            key={level}
            label={level}
            active={values.priority === level}
            activeColor={priorityColors[level]}
            onPress={() => onChange('priority', level)}
          />
        ))}
      </View>

      <Text style={styles.label}>Category</Text>
      <View style={[styles.optionsRow, styles.wrapRow]}>
        {CATEGORIES.map(option => (
          <Chip
            key={option}
            label={option}
            active={values.category === option}
            onPress={() => onChange('category', option)}
          />
        ))}
      </View>

      <Input
        label="Tags"
        value={values.tags}
        onChangeText={value => onChange('tags', value)}
        placeholder="Comma separated, e.g. urgent, office"
        autoCapitalize="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  multiline: {
    height: 96,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: fontWeights.medium,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  wrapRow: {
    flexWrap: 'wrap',
  },
});

export default TaskFormFields;
