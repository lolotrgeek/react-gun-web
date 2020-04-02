import React from 'react'
// import { Button as MaterialButton} from '@material-ui/core';
import { TextInput } from 'react-native-paper';

/**
 * Alias Native TextInput as TextField
 * https://callstack.github.io/react-native-paper/text-input.html
 * @param {*} props 
 */
export const TextField = props => <TextInput {...props} mode={props.variant} onChangeText={props.onChange} children={props.children} /> ;
