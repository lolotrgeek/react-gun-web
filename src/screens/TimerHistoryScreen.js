import React, { useState, useEffect, useContext, useRef } from 'react'
import { useParams, useHistory } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { gun, finishTimer, createTimer } from '../constants/Data'
import { isRunning, nameValid, isTimer } from '../constants/Validators'
import { elapsedTime, fullDate, secondsToString, totalTime } from '../constants/Functions'
import useCounter from '../hooks/useCounter'
import SpacingGrid, { UnEvenGrid } from '../components/Grid'
import { Grid, Typography } from '@material-ui/core/'
import { RunningTimer } from '../components/RunningTimer'
import { timerlink } from '../routes/routes'
import { Title } from '../components/Title'
import { Link } from '../components/Link'
import { Button } from '../components/Button'
import { useStyles } from '../themes/DefaultTheme'
import { SubHeader } from '../components/Header'
import Popup from '../components/Popup'
import { PopupContext } from '../contexts/PopupContext'
import { useAlert } from 'react-alert'
import { projectsListLink, projectlink } from '../routes/routes'
import { MoodDisplay, EnergyDisplay, TimePeriod } from '../components/TimerDisplay'


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

  return (
    <Grid container direction='column' justify='center' alignItems='center'>
      <SubHeader title={project[1] && nameValid(project[1].name) ? project[1].name : ''} />
      <SubHeader title={timer[1] && nameValid(timer[1].name) && isTimer(timer) ? timer[1].name : ' Timer History '} />
      {edits.map((edit) => {
        return (
          <Grid key={edit[0]} className={classes.listClass} container direction='row' justify='space-between' alignItems='flex-start' >
            {/* <Link to={timerlink(projectId, timerId)}>
              <SpacingGrid values={Object.values(edit[1])}></SpacingGrid>
            </Link> */}



            <Grid>
              {/* <Typography>{fullDate(new Date(edit[1].started))}</Typography> */}
              {edit[1].ended ? <TimePeriod start={new Date(edit[1].started)} end={new Date(edit[1].ended)} /> : ''}

            </Grid>
            <Grid>
              {/* <Typography>{fullDate(new Date(edit[1].edited))}</Typography> */}

            </Grid>
            <Grid>
              <EnergyDisplay energy={timer[1].energy} />

            </Grid>
            <Grid>
              <MoodDisplay mood={timer[1].mood} />

            </Grid>
            <Grid>
              <Typography>{secondsToString(totalTime(new Date(edit[1].started), new Date(edit[1].ended)))}</Typography>
            </Grid>
          </Grid>
        )
      })}

    </Grid >
  )
}
