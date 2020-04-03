import React from 'react'
// import { Button as MaterialButton} from '@material-ui/core';
import Icon from 'react-native-vector-icons/FontAwesome5'


/**
 * @param {*} props 
 * @param {string} props.name 
 * @param {string} props.color 
 * @param {number} props.size 
 */
export const NativeIcon = props => <Icon name={props.name} size={props.size} color={props.color} children={props.children}  />