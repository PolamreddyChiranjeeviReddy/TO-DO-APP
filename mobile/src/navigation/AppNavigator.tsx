import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';
import EditTaskScreen from '../screens/EditTaskScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors, fontWeights } from '../theme/theme';

export type AppStackParamList = {
  Home: undefined;
  AddTask: undefined;
  TaskDetails: { taskId: string };
  EditTask: { taskId: string };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: fontWeights.bold },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'Add Task' }} />
      <Stack.Screen
        name="TaskDetails"
        component={TaskDetailsScreen}
        options={{ title: 'Task Details' }}
      />
      <Stack.Screen
        name="EditTask"
        component={EditTaskScreen}
        options={{ title: 'Edit Task' }}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
