import React from 'react'
import Grid from '../atoms/Grid'
import Typography from '../atoms/Typography'
import {Button} from '../atoms/Button';
import { Title } from './Title'


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
            // style={{ background: `linear-gradient(0deg, #303030  0%, ${props.color}  100%)` }}
        >
            <Grid item>
                    <Title color={props.color} variant='h4' >{props.title}</Title>
            </Grid>
            {props.buttonText ?
                <Grid item>
                    <Button variant="contained" color="secondary" onClick={props.buttonClick}>{props.buttonText}</Button>
                </Grid> : ''
            }
        </Grid >
    )
}
