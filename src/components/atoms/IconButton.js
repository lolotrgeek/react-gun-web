import React from 'react'
import { IconButton as MaterialButton} from '@material-ui/core';
// import { IconButton as PaperIconButton } from 'react-native-paper';
import { TouchableOpacity } from 'react-native'

/**
 * https://callstack.github.io/react-native-paper/icon-button.html
 * @param {*} props.icon 
 * @param {*} props.color
 * @param {*} props.size
 * @param {*} props.style
 *  
 */
export const IconButton = props => <MaterialButton {...props} children={props.children} />