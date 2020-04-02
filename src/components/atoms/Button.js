import React from 'react'
// import { Button as MaterialButton} from '@material-ui/core';
import { Button as PaperButton } from 'react-native-paper';

/**
 * Combine Router Link and Material-Ui Button into single Component
 * @param {*} props 
 */
export const Button = props => <PaperButton onPress={props.onClick}  mode={props.variant}> {props.children}</PaperButton>;