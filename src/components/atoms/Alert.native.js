import React from 'react'
import { ToastAndroid } from "react-native";

/**
 * @param {*} props 
 * @param {*} props.message 
 */
export const Alert = props => ToastAndroid.show(props.message, ToastAndroid.SHORT);