import React from 'react'
import { Typography, Button, Grid } from '@material-ui/core';

export function RunningTimer(props) {
    return (
        <Grid container direction='column' justify='center' alignItems='center' spacing={2}>
            <Typography variant='h5'>
                {`Running Timer ${props.project}/ Count: ${props.count}`}
            </ Typography>
            <Button variant="contained" color="primary" onClick={props.stop}>Stop Timer</Button>
        </Grid>
    )
}
