import React from 'react'
// import { Button as MaterialButton} from '@material-ui/core';
import { IconButton as PaperIconButton } from 'react-native-paper';
import { TouchableOpacity } from 'react-native'

/**
 * https://callstack.github.io/react-native-paper/icon-button.html
 * @param {*} props.icon 
 * @param {*} props.color
 * @param {*} props.size
 * @param {*} props.onClick aliases to onPress for Native
 * @param {*} props.style
 *  
 */
export const IconButton = props => <TouchableOpacity {...props} onPress={props.onClick} children={props.children} />
// export const IconButton = props => <PaperIconButton {...props} onPress={props.onClick} children={props.children} />