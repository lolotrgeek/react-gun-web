import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'


/**
 * @param {*} props 
 * @param {string} props.color 
 * @param {number} props.size 
 */
export const TitleIcon = props => <Icon name='fa-circle' size={props.size} color={props.color} children={props.children}  />

/**
 * @param {*} props 
 * @param {string} props.color 
 * @param {number} props.size 
 */
export const DrawerIcon = props => <Icon name='chevron-left' size={props.size} color={props.color} children={props.children}  />

/**
 * @param {*} props 
 * @param {string} props.color 
 * @param {number} props.size 
 */
export const MenuIcon = props => <Icon name='more_vert' size={props.size} color={props.color} children={props.children}  />