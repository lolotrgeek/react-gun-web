import React from 'react'
import { Link as MaterialLink} from '@material-ui/core';
import { Link as RouterLink, } from "react-router-dom" // TODO decouple, add native, or remove Linked components 

/**
 * Combine Router Link and Material-Ui Link into single Component
 * @param {*} props 
 */
export const Link = props => <MaterialLink  {...props} color='inherit'  component={RouterLink} />;