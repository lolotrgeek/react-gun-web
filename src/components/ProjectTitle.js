import React from 'react'
import { colorValid } from '../constants/Validators'

export function ProjectTitle(props) {
    return (
        <div>
            <h2>{props.project[1] ? props.project[1].name : ''} </h2>
            <h2>{props.project[1] && colorValid(props.project[1].color) ? props.project[1].color : ''} </h2>
        </div>
    )
}

