import React from 'react';
import Grid from '../atoms/Grid'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGrin, faSmile, faMeh, faFrown, faDizzy } from "@fortawesome/free-solid-svg-icons";
import {IconButton} from '../atoms/IconButton';
import Typography  from '../atoms/Typography';

export function MoodPicker(props) {
    let moods = [
        { name: 'great', click: props.onGreat, icon: faGrin, color: 'orange' },
        { name: 'good', click: props.onGood, icon: faSmile, color: 'green' },
        { name: 'meh', click: props.onMeh, icon: faMeh, color: 'purple' },
        { name: 'bad', click: props.onBad, icon: faFrown, color: 'blue' },
        { name: 'awful', click: props.onAwful, icon: faDizzy, color: 'grey' },

    ]
    return (
        <Grid>
            <Grid container direction='row' justify='space-between' alignItems='center'>
                <Grid item>
                    <Typography variant='h3'>{props.label ? props.label : 'Mood'}</Typography>
                </Grid>
                {moods.map(mood => (
                    <Grid key={mood.name} item>
                        <IconButton edge='end' onClick={mood.click} >
                            <FontAwesomeIcon
                                icon={mood.icon}
                                color={mood.color}
                                style={{
                                    fontWeight: props.selected === mood.name ? 'bold' : 'normal',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    fontSize: props.selected === mood.name ? 40 : 20
                                }}

                            />
                        </IconButton>
                    </Grid>
                ))}

            </Grid>
        </Grid>
    );
}