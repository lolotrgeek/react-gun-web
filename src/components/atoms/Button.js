import React from 'react'
import { Button as MaterialButton} from '@material-ui/core';
import { Link as RouterLink, } from "react-router-dom"

/**
 * Combine Router Link and Material-Ui Button into single Component
 * @param {*} props 
 */
export const Button = props => <MaterialButton {...props} component={RouterLink} />;