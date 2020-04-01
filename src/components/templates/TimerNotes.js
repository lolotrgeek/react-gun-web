import React, { useState } from 'react';
import Grid from '../atoms/Grid'



export function TimerStartNotes(props) {
    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
        >
            <textarea
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