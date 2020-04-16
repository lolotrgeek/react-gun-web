import React from 'react'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


/**
 * @param {*} props 
 * @param {string} props.color 
 * @param {number} props.size 
 */
export const TitleIcon = props => <FontAwesome5 name='circle' size={ props.size ? props.size : 20} color={props.color} solid />

/**
 * @param {*} props 
 * @param {string} props.color 
 * @param {number} props.size 
 */
export const DrawerIcon = props => <FontAwesome5 name='chevron-left' size={ props.size ? props.size : 20} color={props.color}  />

/**
 * @param {*} props 
 * @param {string} props.color 
 * @param {number} props.size 
 */
export const MenuIcon = props => <Icon name='dots-vertical' size={ props.size ? props.size : 20} color={props.color}  />