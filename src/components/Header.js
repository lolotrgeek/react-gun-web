import React from 'react'
import { colorValid } from '../constants/Validators'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import { Grid, Typography } from '@material-ui/core/'
// import { Button } from './Button'
import Button from '@material-ui/core/Button';


/**
 * 
 * @param {*} props 
 * @param {*} props.buttonClick
 * @param {*} props.buttonText  
 * @param {*} props.title 
 */
export function Header(props) {
    return (
        <Grid container direction='row' justify='flex-start' alignItems='center'>
            <Grid item>
                <Typography variant='h3' component='h1' color="textPrimary" style={{ textDecoration: 'none' }}>
                    {props.title}
                    {props.children}
                </Typography>
            </Grid>
            {props.buttonText ?
                <Grid item>
                    <Button variant="contained" color="secondary" onClick={props.buttonClick}>{props.buttonText}</Button>

                </Grid> : ''
            }
            <Grid item></Grid>
        </Grid >
    )
}

/**
 * 
 * @param {*} props 
 * @param {*} props.buttonText  
 * @param {*} props.buttonClick  
 * @param {*} props.title 
 * @param {*} props.color 
 */
export function SubHeader(props) {
    return (
        <Grid container direction='column' justify='center' alignItems='center'
            style={{ background: `linear-gradient(0deg, #303030  0%, ${props.color}  100%)`}}
        >
            <Grid item>
                <Grid container direction='row' justify='flex-start' alignItems='center' 
                    style={props.margin === 'none' ? {} : { marginTop: '2rem', marginBottom: '2rem'}}
                >
                    {colorValid(props.color) ? <FiberManualRecordIcon style={{ color: props.color }} /> : ''}
                    <Typography variant='h4' component='h1' color="textPrimary" style={{ textDecoration: 'none', textTransform: 'capitalize' }}>
                        {props.title}
                        {props.children}
                    </Typography>
                </Grid>

            </Grid>
            {props.buttonText ?
                <Grid item>
                    <Button variant="contained" color="secondary" onClick={props.buttonClick}>{props.buttonText}</Button>
                </Grid> : ''
            }
            <Grid item></Grid>
        </Grid >
    )
}
