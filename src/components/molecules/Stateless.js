import React from 'react'
import {SubHeader} from '../atoms/Header'
import  {useHistory} from 'react-router-dom'

export default function Stateless() {
    const history = useHistory()
    return (
        <SubHeader
            title={'Nothing Here'}
            buttonText='Go Home'
            buttonClick={() => {
                history.push('/')
            }}
        />
    )
}