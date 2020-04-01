import React from 'react'
import { Typography, Button} from '@material-ui/core';
import Grid from '../atoms/Grid'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { secondsToString } from '../../constants/Functions';
import { Link } from '../atoms/Link'
import { timerRunninglink } from '../../routes/routes'

const useStyles = makeStyles(theme => ({
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
        marginTop: theme.spacing(5),
        marginBottom: 12,
        maxWidth: 350,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    button: {
        right: 0,
    }
}));

export function RunningTimer(props) {
    const classes = useStyles();
    return (
        <Grid container className={classes.pos} direction='column' justify='center' alignItems='stretch' >
            <Card className={classes.root} style={{ background: props.color }}>
                <Link to={props.link ? props.link : timerRunninglink() }>
                    <CardContent>
                        <Grid container direction='row' justify='center' alignItems='flex-start' >
                            <Grid item xs>
                                <Typography variant='h5'>
                                    {props.name}
                                </ Typography>
                            </Grid>
                            <Grid item xs>
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
