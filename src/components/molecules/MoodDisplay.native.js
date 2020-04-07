import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useStyles } from '../../themes/DefaultTheme'


export default function MoodDisplay(props) {
    let mood
    if (props.mood === 'great') mood = ['grin', 'orange']
    else if (props.mood === 'good') mood = ['smile', 'green']
    else if (props.mood === 'meh') mood = ['meh', 'purple']
    else if (props.mood === 'bad') mood = ['frown', 'blue']
    else if (props.mood === 'awful') mood = ['dizzy', 'grey']

    return (
        <Icon
            name={mood[0]}
            size={20}
            color={mood[1]}
            style={props.style}
        />
    )
}