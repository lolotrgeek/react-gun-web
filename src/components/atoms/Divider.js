import React from 'react'
import { Divider as PaperDivider } from 'react-native-paper';

/**
 * @param {*} props 
 */
export const Divider = props => <PaperDivider {...props} children={props.children}/>;