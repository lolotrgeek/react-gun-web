import React from 'react'
import { colorValid } from '../constants/Validators'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
// import Typography from '@material-ui/core/Typography'
import { Grid, Typography } from '@material-ui/core/'

/**
 * 
 * @param {*} props 
 * @param {*} props.color
 * @param {*} props.variant  
 * @param {*} props.name 
 */
export function Title(props) {
    return (
        <Grid container direction='row' justify='flex-start' alignItems='center'>
            {colorValid(props.color) ? <FiberManualRecordIcon style={{ color: props.color }}/> : '' }
            <Typography variant={props.variant} color="textPrimary" style={{ textDecoration: 'none' }}>
                {props.name}
                {props.children}
            </Typography>

        </Grid >
    )
}

export function SubTitle (props) {
    return <h2>{props.children}</h2>
}