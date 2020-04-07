import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'

export default function EnergyDisplay(props) {
    let energy
    if (props.energy > 75) energy = 'orange'
    if (props.energy > 50 && props.energy < 75) energy = 'yellow'
    if (props.energy === 50) energy = 'green'
    if (props.energy < 50 && props.energy > 25) energy = 'blue'
    if (props.energy < 25) energy = 'grey'
    return (
        <Icon
            name='bolt'
            size={20}
            color={energy}
            style={props.style}
        />
    )
}