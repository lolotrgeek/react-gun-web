import React from 'react'
import AppRoutes from './routes/AppRoutes.native'
import { PopupContextProvider } from '../src/contexts/PopupContext';

export default function App(props) {
  return (
    <PopupContextProvider>
      <AppRoutes />
    </PopupContextProvider>
  )
}