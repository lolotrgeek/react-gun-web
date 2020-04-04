import React from 'react';
import Grid from '../atoms/Grid'
import TextField from '../atoms/TextField'

export function StartNotes(props) {
    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
        >
            <TextField
                multiline={false}
                placeholder="Motivation"
                placeholderGridColor="#abbabb"
                value={props.mood}
                editable={true}
                onChangeGrid={props.onChangeGrid}
                onFocus={props.onFocus}
            />
        </Grid >
    );
}