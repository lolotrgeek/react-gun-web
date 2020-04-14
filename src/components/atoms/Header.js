import React from 'react'
import Grid from '../atoms/Grid'
import Typography from '../atoms/Typography'
import { Button } from '../atoms/Button';
import { Title } from '../molecules/Title'
import { View } from 'react-native'
import { useStyles, theme } from '../../themes/DefaultTheme'

const classes = useStyles()
/**
 * 
 * @param {*} props 
 * @param {*} props.buttonClick
 * @param {*} props.buttonText  
 * @param {*} props.title 
 */
export function Header(props) {
    return (
        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            ...props.style
        }} >
            <Typography variant='h3' component='h1' style={{ textDecoration: 'none' }}>
                {props.title}
                {props.children}
            </Typography>
            <View style={{ flex: 0, marginTop: theme.spacing(2) }}>
                {props.buttonText ?
                    <Button variant="contained" onPress={props.buttonClick}>{props.buttonText}</Button>
                    : null
                }
            </View>
        </View >
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
        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            ...props.style
        }}>
            <View style={{ flex: 0 }}>
                <Title color={props.color} variant='h4' >{props.title}</Title>
            </View>
            <View style={{ marginTop: theme.spacing(2) }}>
                {props.buttonText ?
                    <Button variant="contained" color="secondary" onPress={props.buttonClick}>{props.buttonText}</Button>
                    : null}
            </View>

        </View >
    )
}
