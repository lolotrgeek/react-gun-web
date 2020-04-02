import React from 'react'
// import { Button as MaterialButton} from '@material-ui/core';
import Icon from 'react-native-vector-icons/MaterialIcons'


/**
 * @param {*} props 
 */
export const NativeIcon = props => <Icon name={props.name} size={props.size} color={props.color} children={props.children}  />