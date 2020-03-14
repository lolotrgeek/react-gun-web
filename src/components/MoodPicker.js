import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGrin, faSmile, faMeh, faFrown, faDizzy } from "@fortawesome/free-solid-svg-icons";
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton';
import { useStyles } from '../themes/DefaultTheme'

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
                    <h3>{props.label ? props.label : 'Mood'}</h3>
                </Grid>
                {moods.map(mood => (
                    <Grid key={mood.name} item>
                        <IconButton aria-label={mood.name} edge='end' onClick={mood.click} >
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