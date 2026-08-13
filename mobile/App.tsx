import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store, useAppDispatch } from './src/store';
import { logout, restoreSession } from './src/store/authSlice';
import { resetTasks } from './src/store/taskSlice';
import { setUnauthorizedHandler } from './src/services/api';
import RootNavigator from './src/navigation/RootNavigator';
import { linking } from './src/navigation/linking';
import { colors } from './src/theme/theme';

function AppContent() {
  const dispatch = useAppDispatch();

  // Restore the persisted session once on app launch
  useEffect(() => {
    // If any authenticated request returns 401 (e.g. expired token), log out
    setUnauthorizedHandler(() => {
      dispatch(resetTasks());
      dispatch(logout());
    });
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <NavigationContainer linking={linking}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <RootNavigator />
    </NavigationContainer>
  );
}

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
