import React from 'react'
import { Link } from "react-router-dom"
import { Grid, Button } from '@material-ui/core/'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGrin, faSmile, faMeh, faFrown, faDizzy } from "@fortawesome/free-solid-svg-icons";

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
        size={40} 
        color={mood[1]} 
        style={props.style}
        />
    )
}