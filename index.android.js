import React from 'react';
import { AppRegistry, YellowBox } from 'react-native';

import { DarkTheme, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import App from './src/App';

console.disableYellowBox = true;
YellowBox.ignoreWarnings(['Require cycle:', 'Animated:']);

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
console.log('Running on Android')

const Root = () => (
  <PaperProvider theme={theme}>
    <App />
  </PaperProvider >
)
AppRegistry.registerComponent('Notify', () => Root);