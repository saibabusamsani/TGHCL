import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

import { store } from './src/store';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import { buildToastConfig } from './src/theme/toastConfig';
import { RootNavigator } from './src/navigations';


const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;

const AppContent = () => {
  
  const theme = useTheme();
  return (
    <SafeAreaView
      style={[
        styles.flex,
        { backgroundColor: theme.colors.primaryDark },
      ]}
      edges={['top']}
    >
      <StatusBar
        barStyle={'light-content'}
      />

      <NavigationContainer>
        <RootNavigator />
        <Toast config={buildToastConfig(theme)} />
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
});