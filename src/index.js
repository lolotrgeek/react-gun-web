import React from 'react';
import { AppRegistry } from 'react-native';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
// import './index.css';
import { PopupContextProvider } from '../src/contexts/PopupContext';
import { DarkTheme, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import App from './App';
import * as serviceWorker from './serviceWorker';

const alertOptions = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.FADE
}

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
    <AlertProvider template={AlertTemplate} {...alertOptions}>
      <PopupContextProvider>
        <App />
      </PopupContextProvider>
    </AlertProvider>
  </PaperProvider >
)

// ReactDOM.render(<Root />, document.getElementById('root'));
AppRegistry.registerComponent('Root', () => Root);
AppRegistry.runApplication('Root', { rootTag: document.getElementById('root') });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
