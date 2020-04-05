import React from 'react';
import { AppRegistry, Platform } from 'react-native';
import { DarkTheme, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import App from './src/App';

// https://callstack.github.io/react-native-paper/getting-started.html#customization
// https://callstack.github.io/react-native-paper/theming.html
const theme = {
  ...DefaultTheme,
  // dark: true,
  // mode: 'exact',
  // colors: {
  //   ...DarkTheme.colors,
  //   background: 'black',
  //   surface : 'black'
  // }
}

const Root = () => (
  <PaperProvider theme={theme}>
    <App />
  </PaperProvider >
)

AppRegistry.registerComponent('Notify', () => Root);

if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root') || document.getElementById('main');
  AppRegistry.runApplication('Notify', { rootTag });
}