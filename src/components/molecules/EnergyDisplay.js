import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt } from "@fortawesome/free-solid-svg-icons";


export default function EnergyDisplay(props) {
    let energy
    if (props.energy > 75) energy = 'orange'
    if (props.energy > 50 && props.energy < 75) energy = 'yellow'
    if (props.energy === 50) energy = 'green'
    if (props.energy < 50 && props.energy > 25) energy = 'blue'
    if (props.energy < 25) energy = 'grey'
    return (
        <FontAwesomeIcon
            icon={faBolt}
            size={'lg'}
            color={energy}
            style={props.style}
        />
    )
}