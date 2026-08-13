import React from 'react';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, fontSize, fontWeights } from '../theme/theme';
import { formatDateTime } from '../utils/dateUtils';

interface DateTimeFieldProps {
  label: string;
  value: string | null; // ISO string
  onChange: (iso: string | null) => void;
  placeholder?: string;
}

// Tap-to-open date+time picker field. Android-only: on other platforms the
// field displays the value but does nothing when tapped, so the app renders.
const DateTimeField = ({
  label,
  value,
  onChange,
  placeholder = 'Tap to choose date & time',
}: DateTimeFieldProps) => {
  const openPicker = () => {
    if (Platform.OS !== 'android') return;

    const initial = value ? new Date(value) : new Date();

    DateTimePickerAndroid.open({
      value: initial,
      mode: 'date',
      onChange: (event, date) => {
        if (event.type !== 'set' || !date) return;
        DateTimePickerAndroid.open({
          value: date,
          mode: 'time',
          onChange: (timeEvent, time) => {
            if (timeEvent.type !== 'set' || !time) return;
            const combined = new Date(date);
            combined.setHours(time.getHours(), time.getMinutes(), 0, 0);
            onChange(combined.toISOString());
          },
        });
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Pressable
          style={({ pressed }) => [styles.field, pressed && styles.pressed]}
          onPress={openPicker}
          accessibilityRole="button"
        >
          <Text
            style={[styles.value, !value && styles.placeholder]}
            numberOfLines={1}
          >
            {value ? formatDateTime(value) : placeholder}
          </Text>
          <Text style={styles.pickText}>Pick</Text>
        </Pressable>
        {value ? (
          <Pressable
            style={styles.clear}
            onPress={() => onChange(null)}
            hitSlop={8}
            accessibilityLabel="Clear date and time"
          >
            <Text style={styles.clearText}>✕</Text>
          </Pressable>
        ) : null}
      </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  pressed: {
    opacity: 0.85,
  },
  value: {
    fontSize: fontSize.md,
    color: colors.text,
    flex: 1,
  },
  placeholder: {
    color: colors.textMuted,
  },
  pickText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeights.semibold,
  },
  clear: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
});

export default DateTimeField;
