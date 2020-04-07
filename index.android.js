import React from 'react';
import { AppRegistry } from 'react-native';
import { removeAll } from './src/constants/Data.native'
import { DarkTheme, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import App from './src/App';

console.disableYellowBox = true;

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
// removeAll()
const Root = () => (
  <PaperProvider theme={theme}>
    <App />
  </PaperProvider >
)

AppRegistry.registerComponent('Notify', () => Root);