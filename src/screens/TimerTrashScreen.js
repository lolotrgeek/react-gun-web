import React, { useState, useEffect, useContext, useRef } from 'react'
import { useParams, useHistory } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { gun, restoreTimer } from '../constants/Data'
import { isRunning, nameValid, isTimer } from '../constants/Validators'
import { elapsedTime, fullDate, secondsToString, totalTime, simpleDate } from '../constants/Functions'
import useCounter from '../hooks/useCounter'
import SpacingGrid, { UnEvenGrid, EvenGrid } from '../components/Grid'
import { Grid, Typography, CardContent, CardActions } from '@material-ui/core/'
import { RunningTimer } from '../components/RunningTimer'
import { Button } from '../components/Button'
import { useStyles } from '../themes/DefaultTheme'
import { SubHeader } from '../components/Header'
import Popup from '../components/Popup'
import { PopupContext } from '../contexts/PopupContext'
import { useAlert } from 'react-alert'
import { timerlink, projectlink } from '../routes/routes'
import { MoodDisplay, EnergyDisplay, TimePeriod } from '../components/TimerDisplay'
import Stateless from '../components/Stateless'
import Card from '@material-ui/core/Card';
import { Link } from '../components/Link'


export default function TimerTrashScreen() {
  const { projectId } = useParams()
  const [online, setOnline] = useState(false)
  const [alerted, setAlert] = useState([])
  const [timers, setTimers] = useState([])
  const [project, setProject] = useState([])
  const alert = useAlert()
  let history = useHistory()
  let { state, dispatch } = useContext(PopupContext)
  const classes = useStyles();


  useEffect(() => {
    if (alerted && alerted.length > 0) {
      alert.show(alerted[1], {
        type: alerted[0]
      })
    }
    return () => alerted
  }, [alerted])

  useEffect(() => {
    gun.get('projects').get(projectId).on((projectValue, projectKey) => {
      console.log(projectValue)
      setProject([projectKey, trimSoul(projectValue)])
    }
      , { change: true })
    return () => gun.get('projects').off()
  }, [online])

  useEffect(() => {
    let currentTimers = []
    gun.get('timers').get(projectId).map().on((timerValue, timerKey) => {
      if (timerValue) {
        const foundTimer = [timerKey, trimSoul(timerValue)]
        if (foundTimer[1].status === 'deleted') {
          let check = currentTimers.some(id => id === foundTimer[0])
          if (!check) {
            console.log('Adding Timer', foundTimer)
            setTimers(timers => [...timers, foundTimer])
          }
          currentTimers.push(foundTimer[0])
        }
        else if (foundTimer[1].status === 'running') {
          gun.get('running').get('timer').put(JSON.stringify(foundTimer))
        }
      }
    }, { change: true })

    return () => gun.get('timers').off()
  }, [online]);
  const openPopup = () => dispatch({ type: "open" });
  const closePopup = () => dispatch({ type: "close" });

  // const displayStatusTitle = timer => {
  //   if (timer[1].edited || timer[1].edited.length > 0) return 'Edit'
  //   if (timer[1].status === 'running') return 'Start'
  //   if (timer[1].status === 'done') return 'End'

  // }
  // const displayStatusDate = edit => {
  //   if (edit[1].edited || edit[1].edited.length > 0) return fullDate(new Date(edit[1].edited))
  //   if (edit[1].status === 'running') return fullDate(new Date(edit[1].created))
  //   if (edit[1].status === 'done') return fullDate(new Date(edit[1].ended))


  const timerRestore = timer => restoreTimer([timer[0], timer[1]])

  return (
    <Grid className={classes.Content} container direction='column' justify='center' alignItems='center'>
      {project && project[1] ?
        <SubHeader
          color={project[1].color}
          title={nameValid(project[1].name) ? project[1].name : ''}
        />
        : <Stateless />}

      <Typography className={classes.spaceBelow} variant='h4'> Trash</Typography>

      {timers.map(timer => {
        if (!isTimer(timer)) return (null)
        if (timer[1].status === 'running') return (null)
        let started = new Date(timer[1].started)
        let ended = new Date(timer[1].ended)
        let deleted = new Date(timer[1].deleted)
        return (
          <Card key={timer[0]} className={classes.card}>
            <Popup content='Confirm Restore?' onAccept={() => { timerRestore(timer); closePopup() }} onReject={() => closePopup()} />
            <CardContent>
              <Grid container direction='row' justify='center' alignItems='flex-start'>
                <Grid item xs={12}><Typography variant='h6'>{fullDate(deleted)}</Typography></Grid>
              </Grid>
              <Grid container direction='row' justify='center' alignItems='flex-start'>
                <Grid item xs={12}>
                  <Typography variant='subtitle1'>{'Deleted'}</Typography>
                </Grid>
              </Grid>
              <Grid className={classes.space3} container direction='row' justify='space-evenly' alignItems='flex-start'>
                <Grid item xs={3}><TimePeriod start={started} end={ended} /></Grid>
                <Grid item xs={1}><EnergyDisplay energy={timer[1].energy} /></Grid>
                <Grid item xs={1}><MoodDisplay mood={timer[1].mood} /></Grid>
                <Grid item xs={2}>{secondsToString(totalTime(started, ended))}</Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Grid container direction='row' justify='center' alignItems='flex-start'>


                <Button variant='contained' color='primary' size="small" onClick={() => {timerRestore(timer); history.push(projectlink(timer[1].project))}}> Restore </Button>


              </Grid>

            </CardActions>
          </Card>
        )
      })}

    </Grid >
  )
}
