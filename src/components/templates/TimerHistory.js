import React from 'react'
import Card from '@material-ui/core/Card';
import { MoodDisplay, EnergyDisplay, TimePeriod } from '../molecules/TimerDisplay'
import Stateless from '../molecules/Stateless'
import { SubHeader } from '../atoms/Header'
import Popup from '../atoms/Popup'
import {Typography, CardContent, CardActions } from '@material-ui/core/'
import Grid from '../atoms/Grid'
import { Button } from '../atoms/Button'
import { nameValid, isTimer } from '../../constants/Validators'
import { secondsToString, totalTime } from '../../constants/Functions'

/**
 * 
 * @param {*} props
 * @param {Object} props.classes
 * @param {Array} props.project
 * @param {Array} props.timer
 * @param {Array} props.edits
 * @param {boolean} props.displayRestoreButton
 * @param {function} props.displayStatusDate 
 * @param {function} props.displayStatus
 * @param {function} props.restoreButtonAction
 * @param {function} props.popupAccept
 * @param {function} props.popupReject
 */
export default function TimerHistory(props) {
    return (
        <Grid className={props.classes.Content} container direction='column' justify='center' alignItems='center'>
            {props.project && props.project[1] ?
                <SubHeader
                    color={props.project[1].color}
                    title={nameValid(props.project[1].name) ? props.project[1].name : ''}
                />
                : <Stateless />}

            <Typography className={props.classes.spaceBelow} variant='h4'>
                {props.timer[1] && nameValid(props.timer[1].name) && isTimer(props.timer) ? props.timer[1].name : 'Timer History '}
            </Typography>

            {props.edits.map((edit) => {
                console.log(edit[1])
                let started = new Date(edit[1].started)
                let ended = new Date(edit[1].ended)
                return (
                    <Card key={edit[2]} className={props.classes.card}>
                        <Popup content='Confirm Restore?' onAccept={() => props.popupAccept() } onReject={() => props.popupReject()} />
                        <CardContent>
                            <Grid container direction='row' justify='center' alignItems='flex-start'>
                                <Grid item xs={12}><Typography variant='h6'>{props.displayStatusDate(edit)}</Typography></Grid>
                            </Grid>
                            <Grid container direction='row' justify='center' alignItems='flex-start'>
                                <Grid item xs={12}>
                                    <Typography variant='subtitle1'>{props.displayStatus(edit)}</Typography>
                                </Grid>
                            </Grid>
                            <Grid className={props.classes.space3} container direction='row' justify='space-evenly' alignItems='flex-start'>
                                <Grid item xs={3}><TimePeriod start={started} end={ended} /></Grid>
                                <Grid item xs={1}><EnergyDisplay energy={edit[1].energy} /></Grid>
                                <Grid item xs={1}><MoodDisplay mood={edit[1].mood} /></Grid>
                                <Grid item xs={2}>{secondsToString(totalTime(started, ended))}</Grid>
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <Grid container direction='row' justify='center' alignItems='flex-start'>

                                {props.displayRestoreButton(edit) ?
                                    <Button variant='contained' color='primary' size="small" onClick={() => props.restoreButtonAction(edit)}> Restore </Button>
                                    : ''}

                            </Grid>

                        </CardActions>
                    </Card>
                )
            })}

        </Grid >
    )
}
