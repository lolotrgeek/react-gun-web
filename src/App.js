import React from 'react'
import { GlobalStateProvider } from './hooks/useGlobalState'
import AppRoutes from './routes/AppRoutes'
import { PopupContextProvider } from '../src/contexts/PopupContext';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const alertOptions = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.FADE
}

function App(props) {
  return (
    <AlertProvider template={AlertTemplate} {...alertOptions}>
      <PopupContextProvider>
        <GlobalStateProvider>
          <AppRoutes />
        </GlobalStateProvider>
      </PopupContextProvider>
    </AlertProvider>
  )
}

export default App;
