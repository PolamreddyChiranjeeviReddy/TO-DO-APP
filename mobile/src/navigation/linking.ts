import type { LinkingOptions } from '@react-navigation/native';

const config = {
  screens: {
    Login: 'login',
    Register: 'register',
    Home: '',
    AddTask: 'add-task',
    TaskDetails: 'task/:taskId',
    EditTask: 'edit/:taskId',
    Profile: 'profile',
  },
};

export const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: ['todoapp://'],
  config,
  // Keep deep-link restore disabled so session restore is driven by AsyncStorage.
  getInitialURL: () => null,
};
