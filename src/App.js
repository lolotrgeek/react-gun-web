import React from 'react'
import { GlobalStateProvider } from './hooks/useGlobalState'
import AppRoutes from './routes/AppRoutes'

function App(props) {
  return (
    <GlobalStateProvider>
      <AppRoutes />
    </GlobalStateProvider>
  )
}

export default App;
