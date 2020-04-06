import React from 'react'
import { Link as RouterLink, } from "react-router-native"

/**
 * Combine Router Link and Material-Ui Link into single Component
 * @param {*} props 
 */
export const Link = props => <RouterLink  {...props} color='inherit' to={props.to} />;