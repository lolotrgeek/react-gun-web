import React from 'react'
import * as ReactRouter from "react-router-native"

/**
 * Combine Router Link and Material-Ui Link into single Component
 * @param {*} props 
 */
export const Link = props => <ReactRouter.Link  {...props} color='inherit' to={props.to} />;