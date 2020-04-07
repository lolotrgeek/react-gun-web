import React from 'react'
import { colorValid } from '../../constants/Validators'
import {TitleIcon} from '../atoms/Icon'
import Typography from '../atoms/Typography'
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
            {colorValid(props.color) ? <TitleIcon name='circle' size={20} color={props.color} /> : null}
            <Typography variant={props.variant} color="textPrimary" style={{ textTransform: 'capitalize' }}>
                {truncate(props.children)}
            </Typography>
        </Grid >
    )
}

export function SubTitle(props) {
    return <Typography style={{ textDecoration: 'none', textTransform: 'capitalize' }}>{truncate(props.children)}</Typography>
}