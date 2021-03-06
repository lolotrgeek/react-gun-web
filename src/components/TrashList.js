import React from 'react'
import { Grid, Typography, CardContent, CardActions } from '@material-ui/core/'
import { MoodDisplay, EnergyDisplay, TimePeriod } from '../components/TimerDisplay'
import { fullDate, secondsToString, totalTime } from '../constants/Functions'
import { nameValid, isTimer } from '../constants/Validators'
import { SubHeader } from '../components/Header'
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Popup from './Popup'
import Stateless from '../components/Stateless'


/**
 * @param {*} props  
 * @param {Object} props.classes 
 * @param {Array} props.timers 
 * @param {Array} props.project
 * @param {function} props.restoreButton
 * @param {function} props.popupAccept  
 * @param {function} props.popupReject  
 * 
 */
export default function TrashList(props) {
  return (
    <Grid className={props.classes.Content} container direction='column' justify='center' alignItems='center'>
      {props.project && props.project[1] ?
        <SubHeader
          color={props.project[1].color}
          title={nameValid(props.project[1].name) ? props.project[1].name : ''}
        />
        : <Stateless />}

      <Typography className={props.classes.spaceBelow} variant='h4'> Trash</Typography>

      {props.timers.map(timer => {
        if (!isTimer(timer)) return (null)
        if (timer[1].status === 'running') return (null)
        let started = new Date(timer[1].started)
        let ended = new Date(timer[1].ended)
        let deleted = new Date(timer[1].deleted)
        return (
          <Card key={timer[0]} className={props.classes.card}>
            <Popup content='Confirm Restore?' onAccept={() => props.popupAccept(timer) } onReject={() => props.popupReject()} />
            <CardContent>
              <Grid container direction='row' justify='center' alignItems='flex-start'>
                <Grid item xs={12}><Typography variant='h6'>{fullDate(deleted)}</Typography></Grid>
              </Grid>
              <Grid container direction='row' justify='center' alignItems='flex-start'>
                <Grid item xs={12}>
                  <Typography variant='subtitle1'>{'Deleted'}</Typography>
                </Grid>
              </Grid>
              <Grid className={props.classes.space3} container direction='row' justify='space-evenly' alignItems='flex-start'>
                <Grid item xs={3}><TimePeriod start={started} end={ended} /></Grid>
                <Grid item xs={1}><EnergyDisplay energy={timer[1].energy} /></Grid>
                <Grid item xs={1}><MoodDisplay mood={timer[1].mood} /></Grid>
                <Grid item xs={2}>{secondsToString(totalTime(started, ended))}</Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Grid container direction='row' justify='center' alignItems='flex-start'>
                <Button
                  variant='contained'
                  color='primary'
                  size="small"
                  onClick={() => props.restoreButton()}>
                  Restore
                </Button>
              </Grid>
            </CardActions>
          </Card>
        )
      })}
    </Grid >
  )
}
