import React from 'react'
import { colorValid } from '../../constants/Validators'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import Typography from '@material-ui/core/Typography'
import Grid from '../atoms/Grid'

const truncate = (input) => input.length > 15 ? `${input.substring(0, 15)}...` : input
/**
 * 
 * @param {*} props 
 * @param {*} props.color
 * @param {*} props.variant  
 */
export function Title(props) {
    
    return (
        <Grid container direction='row' justify='flex-start' alignItems='center'>
            {colorValid(props.color) ? <FiberManualRecordIcon style={{ color: props.color }}/> : '' }
            <Typography variant={props.variant} color="textPrimary" style={{ textTransform: 'capitalize' }}>
                { truncate(props.children)}
            </Typography>

        </Grid >
    )
}

export function SubTitle (props) {
    return <h2 style={{ textDecoration: 'none', textTransform: 'capitalize' }}>{ truncate(props.children)}</h2>
}