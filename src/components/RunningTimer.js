import React from 'react'
import { Typography, Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { secondsToString } from '../constants/Functions'

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    button: {
        right: 0,
    }
});

export function RunningTimer(props) {
    const classes = useStyles();
    return (
        <Grid container direction='column' justify='center' alignItems='center' spacing={2}>
            <Card className={classes.root} style={{ background: props.color }}>
                <CardContent>
                    <Grid container direction='row' justify='center' alignItems='center' spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant='h5'>
                                {`${props.name}`}
                            </ Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant='h4'>
                                {`${secondsToString(props.count)}`}
                            </ Typography>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Button className={classes.button} variant="contained" color="primary" onClick={props.stop}>Stop</Button>
                </CardActions>
            </Card>
        </Grid>

    )
}
