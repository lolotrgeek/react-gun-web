import React from 'react'
import { Link as MaterialLink} from '@material-ui/core';
import { Link as RouterLink, } from "react-router-dom"

/**
 * Combine Router Link and Material-Ui Link into single Component
 * @param {*} props 
 */
export const Link = props => <MaterialLink {...props} component={RouterLink} />;