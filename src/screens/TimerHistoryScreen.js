import React, { useState, useEffect, useContext, useRef } from 'react'
import { useParams, useHistory } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { gun, finishTimer, createTimer } from '../constants/Data'
import { isRunning, nameValid, isTimer } from '../constants/Validators'
import { elapsedTime, fullDate, secondsToString, totalTime } from '../constants/Functions'
import useCounter from '../hooks/useCounter'
import SpacingGrid, { UnEvenGrid, EvenGrid } from '../components/Grid'
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

  const displayStatus = timer => {
    if (timer[1].edited || timer[1].edited.length > 0) return `Edited : ${fullDate(new Date(timer[1].edited))}`
    if (timer[1].status === 'running') return `Started : ${fullDate(new Date(timer[1].created))}`
    if (timer[1].status === 'done') return `Ended : ${fullDate(new Date(timer[1].ended))}`

  }

  return (
    <Grid container className={classes.listClass} direction='column' justify='center' alignItems='center'>
      {project[1] ?
        <SubHeader
          color={project[1].color}
          title={nameValid(project[1].name) ? project[1].name : ''}
        />
        : ''}

      <Typography className={classes.spaceBelow} variant='h4'> {timer[1] && nameValid(timer[1].name) && isTimer(timer) ? timer[1].name : ' Timer History '}</Typography>
      {edits.map((edit) => {
        return (
          <Grid key={edit[0]} container direction='column' justify='center' alignItems='center'>
            <Typography variant='h6'>
              {displayStatus(edit)}
            </Typography>

            <EvenGrid
              values={[
                <EnergyDisplay energy={edit[1].energy} />,
                <MoodDisplay mood={edit[1].mood} />,
                <Typography>{secondsToString(totalTime(new Date(edit[1].started), new Date(edit[1].ended)))}</Typography>
              ]}
            />
          </Grid>
        )
      })}

    </Grid >
  )
}
