import React from 'react'

import Grid from '../atoms/Grid'
import { secondsToString } from '../../constants/Functions';
import { Link } from '../atoms/Link'
import { timerRunninglink } from '../../routes/routes'

import {Button} from '../atoms/Button'
import Typography from '../atoms/Typography'
import {Card, CardActions, CardContent} from '../atoms/Card';
import {useStyles} from '../../themes/DefaultTheme'


export function RunningTimer(props) {
    const classes = useStyles();
    return (
        <Grid container className={classes.pos} direction='column' justify='center' alignItems='stretch' >
            <Card className={classes.root} style={{ background: props.color }}>
                <Link to={props.link ? props.link : timerRunninglink() }>
                    <CardContent>
                        <Grid container direction='row' justify='center' alignItems='flex-start' >
                            <Grid item>
                                <Typography variant='h5'>
                                    {props.name}
                                </ Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant='h4'>
                                    {`${secondsToString(props.count)}`}
                                </ Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Link>
                <CardActions>
                    <Grid container direction='row' justify='flex-end' alignItems='baseline' >
                        <Button className={classes.button} variant="contained" color="primary" onClick={props.stop}>Stop</Button>
                    </Grid>
                </CardActions>
            </Card>
        </Grid>

    )
}
