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
import { projectsListLink, projectlink } from '../routes/routes'
import { MoodDisplay, EnergyDisplay, TimePeriod } from '../components/TimerDisplay'
import Stateless from '../components/Stateless'
import Card from '@material-ui/core/Card';


export default function TimerHistoryScreen() {
  const { projectId, timerId } = useParams()
  const [online, setOnline] = useState(false)
  const [alerted, setAlert] = useState([])
  const [edits, setEdits] = useState([])
  const [timer, setTimer] = useState([])
  const [project, setProject] = useState([])
  const [runningTimer, setRunningTimer] = useState('')
  const { count, setCount, start, stop } = useCounter(1000, false)
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
    gun.get('running').get('timer').on((runningTimerGun, runningTimerKeyGun) => {
      const runningTimerFound = trimSoul(JSON.parse(runningTimerGun))
      if (isRunning(runningTimerFound)) {
        setRunningTimer(runningTimerFound)
        console.log('runningTimerFound', runningTimerFound)
        setCount(elapsedTime(runningTimerFound[1].started))
        start()
      }
      else if (!runningTimerGun) {
        console.log('running Timer not Found')
        stop()
        setRunningTimer({})
      }
    }, { change: true })

    return () => gun.get('running').off()
  }, [online]);

  useEffect(() => {
    gun.get('projects').get(projectId).on((projectValue, projectKey) => {
      console.log(projectValue)
      setProject([projectKey, projectValue])
    }
      , { change: true })
    return () => gun.get('projects').off()
  }, [timer])

  useEffect(() => {
    console.log('Getting: ', projectId, timerId)
    gun.get('timers').get(projectId, ack => {
      if (ack.err || !ack.put) setAlert(['Error', 'No Project Exists'])
    }).get(timerId, ack => {
      if (ack.err || !ack.put) setAlert(['Error', 'No Timer Exists'])
    }).on((timerValue, timerGunId) => {
      if (!timerValue) {
        setAlert(['Error', 'No Timer Exists'])
        history.push((projectlink(projectId)))
      }
      let foundTimer = [timerId, trimSoul(timerValue)]
      setTimer(foundTimer)

    }, { change: true })
    return () => gun.get('timers').off()
  }, [online]);


  useEffect(() => {
    gun.get('history').get('timers').get(projectId).get(timerId).map().on((timerValue, timerGunId) => {
      setEdits(timers => [...timers, [timerId, trimSoul(timerValue), timerGunId]])
    }, { change: true })
    return () => gun.get('timers').off()
  }, [online]);

  const openPopup = () => dispatch({ type: "open" });
  const closePopup = () => dispatch({ type: "close" });

  const displayStatusTitle = timer => {
    if (timer[1].edited || timer[1].edited.length > 0) return 'Edit'
    if (timer[1].status === 'running') return 'Start'
    if (timer[1].status === 'done') return 'End'

  }
  const displayStatusDate = edit => {
    if (edit[1].edited || edit[1].edited.length > 0) return fullDate(new Date(edit[1].edited))
    if (edit[1].status === 'running') return fullDate(new Date(edit[1].created))
    if (edit[1].status === 'done') return fullDate(new Date(edit[1].ended))

  }
  const displayStatus = edit => {
    if (edit[1].status === 'running') return 'Start Entry'
    else if (JSON.stringify(edit[1]) === JSON.stringify(timer[1])) return 'Current Entry'
    else if (edit[1].status === 'done' && edit[1].edited.length === 0) return 'End Entry'
    else if (edit[1].status === 'done' && edit[1].edited.length > 0) return 'Edit Entry'
    else return false
  }
  const displayRestoreButton = edit => {
    if (JSON.stringify(edit[1]) === JSON.stringify(timer[1])) return false
    else if (edit[1].status === 'done') return true
    else return false
  }
  const editRestore = edit => restoreTimer([edit[0], edit[1]])

  return (
    <Grid className={classes.Content} container direction='column' justify='center' alignItems='center'>
      {project && project[1] ?
        <SubHeader
          color={project[1].color}
          title={nameValid(project[1].name) ? project[1].name : ''}
        />
        : <Stateless />}

      <Typography className={classes.spaceBelow} variant='h4'> {timer[1] && nameValid(timer[1].name) && isTimer(timer) ? timer[1].name : ' Timer History '}</Typography>


      {edits.map((edit) => {
        let started = new Date(edit[1].started)
        let ended = new Date(edit[1].ended)
        return (
          <Card key={edit[2]} className={classes.card}>
            <Popup content='Confirm Restore?' onAccept={() => { editRestore(edit); closePopup() }} onReject={() => closePopup()} />
            <CardContent>
              <Grid container direction='row' justify='center' alignItems='flex-start'>
                <Grid item xs={12}><Typography variant='h6'>{displayStatusDate(edit)}</Typography></Grid>
              </Grid>
              <Grid container direction='row' justify='center' alignItems='flex-start'>
                <Grid item xs={12}>
                  <Typography variant='subtitle1'>{displayStatus(edit)}</Typography>
                </Grid>
              </Grid>
              <Grid className={classes.space3} container direction='row' justify='space-evenly' alignItems='flex-start'>
                <Grid item xs={3}><TimePeriod start={started} end={ended} /></Grid>
                <Grid item xs={1}><EnergyDisplay energy={edit[1].energy} /></Grid>
                <Grid item xs={1}><MoodDisplay mood={edit[1].mood} /></Grid>
                <Grid item xs={2}>{secondsToString(totalTime(started, ended))}</Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Grid container direction='row' justify='center' alignItems='flex-start'>

                {displayRestoreButton(edit) ?
                  <Button variant='contained' color='primary' size="small" onClick={() => editRestore(edit)}> Restore </Button>
                  : ''}

              </Grid>

            </CardActions>
          </Card>
        )
      })}

    </Grid >
  )
}
