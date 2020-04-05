import React from 'react'
import { SubHeader } from '../atoms/Header'
import { useHistory } from 'react-router-native'
/**
 * 
 * @param {*} props 
 * @param {*} props.buttonText 
 * @param {*} props.buttonAction 
 */
export default function Stateless(props) {
    const history = useHistory()
    return (
        <SubHeader
            title={'Nothing Here'}
            buttonText={props.buttonText ? props.buttonText : 'Go Home'}
            buttonClick={() => history.push('/')}
        />
    )
}