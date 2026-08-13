import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Chip from '../components/Chip';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import SectionHeader from '../components/SectionHeader';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import { useAppDispatch, useAppSelector } from '../store';
import { editTask, loadTasks, selectTaskState } from '../store/taskSlice';
import { AppStackParamList } from '../navigation/AppNavigator';
import {
  FILTER_OPTIONS,
  SORT_OPTIONS,
  processTasks,
  TaskFilter,
  TaskSort,
} from '../utils/taskFilters';
import { groupTasksIntoSections } from '../utils/taskSections';
import { calculateTaskStats } from '../utils/taskStats';
import { Task } from '../types/task';
import { colors, radius, spacing, fontSize, fontWeights, shadows } from '../theme/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

const FILTER_LABELS: Record<TaskFilter, string> = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
  overdue: 'Overdue',
  high: 'High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority',
};

const SORT_LABELS: Record<TaskSort, string> = {
  smart: 'Smart',
  deadline: 'Deadline',
  priority: 'Priority',
  newest: 'Newest',
  oldest: 'Oldest',
};

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

interface TaskSection {
  key: string;
  title: string;
  data: Task[];
}

const HomeScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector(selectTaskState);
  const user = useAppSelector(state => state.auth.user);
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [sort, setSort] = useState<TaskSort>('smart');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(loadTasks());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(loadTasks());
    setRefreshing(false);
  };

  // Pure pipeline: search → filter → sort. Never mutates the Redux array.
  const displayedTasks = useMemo(
    () => processTasks(tasks, searchText, filter, sort),
    [tasks, searchText, filter, sort]
  );

  const stats = useMemo(() => calculateTaskStats(tasks), [tasks]);

  const sections = useMemo<TaskSection[]>(() => {
    const grouped = groupTasksIntoSections(displayedTasks);
    const result: TaskSection[] = [];
    if (grouped.today.length > 0) {
      result.push({ key: 'today', title: "TODAY'S TASKS", data: grouped.today });
    }
    if (grouped.upcoming.length > 0) {
      result.push({ key: 'upcoming', title: 'UPCOMING', data: grouped.upcoming });
    }
    if (grouped.completed.length > 0) {
      result.push({ key: 'completed', title: 'COMPLETED', data: grouped.completed });
    }
    return result;
  }, [displayedTasks]);

  const firstName = user?.name?.split(' ')[0] || 'there';

  const toggleComplete = (taskId: string, completed: boolean) => {
    const result = dispatch(
      editTask({ id: taskId, data: { completed: !completed } })
    );
    result.then(action => {
      if (editTask.rejected.match(action)) {
        Alert.alert('Error', action.payload || 'Could not update task');
      }
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.greeting}>{getGreeting()} 👋</Text>
          <Text style={styles.subtitle}>Plan your day, {firstName}</Text>
        </View>
        <Pressable
          style={styles.avatar}
          onPress={() => navigation.navigate('Profile')}
          accessibilityLabel="Open profile"
        >
          <Text style={styles.avatarText}>
            {(user?.name || '?').charAt(0).toUpperCase()}
          </Text>
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Completed" value={stats.completed} accent={colors.success} />
        <StatCard label="Pending" value={stats.pending} accent={colors.warning} />
        <StatCard label="Overdue" value={stats.overdue} accent={colors.danger} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search tasks..."
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsContent}
      >
        {FILTER_OPTIONS.map(option => (
          <Chip
            key={option}
            label={FILTER_LABELS[option]}
            active={filter === option}
            onPress={() => setFilter(option)}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsContent}
      >
        {SORT_OPTIONS.map(option => (
          <Chip
            key={option}
            label={SORT_LABELS[option]}
            active={sort === option}
            onPress={() => setSort(option)}
          />
        ))}
      </ScrollView>

      {loading && !refreshing ? (
        <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />
      ) : null}

      {error && !loading ? (
        <View style={styles.errorWrap}>
          <ErrorBanner message={error} />
        </View>
      ) : null}

      <SectionList
        style={styles.list}
        sections={sections}
        keyExtractor={item => item._id}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <SectionHeader title={section.title} count={section.data.length} />
        )}
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <TaskCard
              task={item}
              onPress={() => navigation.navigate('TaskDetails', { taskId: item._id })}
              onToggleComplete={() => toggleComplete(item._id, item.completed)}
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !loading ? (
            tasks.length === 0 ? (
              <EmptyState
                icon="📋"
                title="No tasks yet"
                message="Tap the + button to create your first task and start being productive."
              >
                <View style={styles.emptyAction}>
                  <Button title="Add Task" onPress={() => navigation.navigate('AddTask')} />
                </View>
              </EmptyState>
            ) : (
              <EmptyState
                icon="🔍"
                title="No matching tasks"
                message="Try a different search term or filter."
              />
            )
          ) : null
        }
      />

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => navigation.navigate('AddTask')}
        accessibilityLabel="Add task"
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  headerText: {
    flex: 1,
    marginRight: spacing.md,
  },
  greeting: {
    fontSize: fontSize.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  avatarText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeights.bold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  searchInput: {
    height: 46,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    ...shadows.card,
  },
  chipsScroll: {
    flexGrow: 0,
  },
  chipsContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  loader: {
    marginTop: spacing.xl,
  },
  errorWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 96,
  },
  cardWrap: {
    marginBottom: spacing.sm,
  },
  emptyAction: {
    marginTop: spacing.lg,
    width: 180,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.raised,
  },
  fabPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
  fabText: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: fontWeights.medium,
    lineHeight: 32,
  },
});

export default HomeScreen;
