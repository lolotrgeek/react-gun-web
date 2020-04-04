import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGrin, faSmile, faMeh, faFrown, faDizzy } from "@fortawesome/free-solid-svg-icons";

export default function MoodDisplay(props) {
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