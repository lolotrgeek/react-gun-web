import React from 'react'
import MoreVert from '@material-ui/icons/MoreVert';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faCircle, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

/**
 * @param {*} props 
 * @param {string} props.color 
 * @param {number} props.size 
 */
export const TitleIcon = props => <Icon icon={faCircle} style={ {fontSize: props.size}} color={props.color} children={props.children}  />

/**
 * @param {*} props 
 * @param {string} props.color 
 * @param {number} props.size 
 */
export const DrawerIcon = props => <Icon icon={faChevronLeft} size={props.size} color={props.color} children={props.children}  />

/**
 * @param {*} props 
 * @param {string} props.color 
 * @param {number} props.size 
 */
export const MenuIcon = props => <MoreVert style={ {fontSize: props.size, color: props.color} }  children={props.children}  />