import React from 'react'
import { colorValid } from '../constants/Validators'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
// import Typography from '@material-ui/core/Typography'
import { Grid, Typography } from '@material-ui/core/'
import { Button } from './Button'


/**
 * 
 * @param {*} props 
 * @param {*} props.buttonLink
 * @param {*} props.buttonText  
 * @param {*} props.title 
 */
export function Header(props) {
    return (
        <Grid container direction='row' justify='flex-start' alignItems='center' spacing={2}>
            <Grid item>
                <Typography variant='h3' component='h1' color="textPrimary" style={{ textDecoration: 'none' }}>
                    {props.title}
                    {props.children}
                </Typography>
            </Grid>
            {props.buttonText ?
                <Grid item>
                    <Button variant="contained" color="secondary" to={props.buttonLink}>{props.buttonText}</Button>

                </Grid> : ''
            }
            <Grid item></Grid>
        </Grid >
    )
}

/**
 * 
 * @param {*} props 
 * @param {*} props.buttonLink
 * @param {*} props.buttonText  
 * @param {*} props.buttonClick  
 * @param {*} props.title 
 * @param {*} props.color 
 */
export function SubHeader(props) {
    return (
        <Grid container direction='column' justify='center' alignItems='center' spacing={4} >
            <Grid item>
                <Grid container direction='row' justify='flex-start' alignItems='center'>
                    {colorValid(props.color) ? <FiberManualRecordIcon style={{ color: props.color }} /> : ''}
                    <Typography variant='h4' component='h1' color="textPrimary" style={{ textDecoration: 'none' }}>
                        {props.title}
                        {props.children}
                    </Typography>
                </Grid>

            </Grid>
            {props.buttonText ?
                <Grid item>
                    <Button variant="contained" color="secondary" to={props.buttonLink} onClick={props.buttonClick}>{props.buttonText}</Button>
                </Grid> : ''
            }


            <Grid item></Grid>
        </Grid >
    )
}
