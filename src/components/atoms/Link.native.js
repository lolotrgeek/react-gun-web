import React from 'react'
import { Link as MaterialLink } from 'react-native-paper';
import { Link as RouterLink, } from "react-router-native"

/**
 * Combine Router Link and Material-Ui Link into single Component
 * @param {*} props 
 */
export const Link = props => <MaterialLink  {...props} color='inherit' component={RouterLink} />;