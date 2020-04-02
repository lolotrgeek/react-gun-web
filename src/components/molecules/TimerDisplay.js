import React from 'react'
import { format, isValid } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGrin, faSmile, faMeh, faFrown, faDizzy, faBolt } from "@fortawesome/free-solid-svg-icons";

export function MoodDisplay(props) {
    let mood
    if (props.mood === 'great') mood = [faGrin, 'orange']
    else if (props.mood === 'good') mood = [faSmile, 'green']
    else if (props.mood === 'meh') mood = [faMeh, 'purple']
    else if (props.mood === 'bad') mood = [faFrown, 'blue']
    else if (props.mood === 'awful') mood = [faDizzy, 'grey']

    return (
        <FontAwesomeIcon
            icon={mood[0]}
            size={'lg'}
            color={mood[1]}
            style={props.style}
        />
    )
}

export function EnergyDisplay(props) {
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

export function TimePeriod(props) {
    if (isValid(props.end) && isValid(props.start)) {
        return format(props.start, 'hh:mm aaa') + ' - ' + format(props.end, 'hh:mm aaa')
    } else if (isValid(props.start)) {
        return format(props.start, 'hh:mm aaa') + ' -  ... '
    }
    else {
        return ''
    }
}