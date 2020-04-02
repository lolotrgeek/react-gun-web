import React from 'react'
import {SubHeader} from '../atoms/Header'
import  {useHistory} from 'react-router-dom' // TODO inherit useHistory from props to decouple router from component

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