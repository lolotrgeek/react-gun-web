import React, { useState, useEffect, useContext } from 'react'
import { useParams, useHistory } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { gun, updateTimer, deleteTimer, createTimer, finishTimer } from '../constants/Data'
import { addMinutes, isValid, endOfDay, sub, add } from 'date-fns'
import { timeRules, dateRules, totalTime, secondsToString } from '../constants/Functions'
import { MoodPicker, EnergySlider } from '../components/TimerEditors'
import { isRunning, isTimer, projectValid } from '../constants/Validators'
import { Grid, makeStyles } from '@material-ui/core/'
import { useAlert } from 'react-alert'
import { Title, SubTitle } from '../components/Title'
import { Button } from '../components/Button'
import { SubHeader } from '../components/Header'
import { projectlink, projectsListLink } from '../routes/routes'
import SideMenu from '../components/SideMenu'
import Popup from '../components/Popup'
import { PopupContext } from '../contexts/PopupContext'
import useCounter from '../hooks/useCounter'
import { elapsedTime } from '../constants/Functions'

import { useStyles } from '../themes/DefaultTheme'

export default function TimerRunningScreen() {

  const [online, setOnline] = useState(false)
  const [runningProject, setRunningProject] = useState([])
  const [runningTimer, setRunningTimer] = useState([])
  const [mood, setMood] = useState('')
  const [energy, setEnergy] = useState(0)
  const [alerted, setAlert] = useState([])
  const { count, setCount, start, stop } = useCounter(1000, false)
  const alert = useAlert()
  let history = useHistory()
  let { state, dispatch } = useContext(PopupContext)
  const classes = useStyles()

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
      if (!runningTimerGun) {
        setAlert(['Error', 'No Timer Exists'])
      }
      else {
        const runningTimerFound = trimSoul(JSON.parse(runningTimerGun))
        setMood(runningTimerFound[1].mood)
        setEnergy(runningTimerFound[1].energy)
        setRunningTimer(runningTimerFound)
        setCount(elapsedTime(runningTimerFound[1].created))
        start()
      }
    }, { change: true })
    return () => gun.get('running').off()
  }, [online]);

  useEffect(() => {
    if (runningTimer[1] && isTimer(runningTimer)) {
      gun.get('projects').get(runningTimer[1].project).on((projectValue, projectKey) => {
        console.log(projectValue)
        if (projectValue && projectValue.status !== 'deleted') {
          setRunningProject([projectKey, projectValue])
        }
      }, { change: true })
      return () => gun.get('projects').off()
    }
  }, [runningTimer])

  useEffect(() => runningTimer[1] ? setEnergy(runningTimer[1].energy) : runningTimer[1], [runningTimer])

  const openPopup = () => dispatch({ type: "open" });
  const closePopup = () => dispatch({ type: "close" });

  const timeRulesEnforcer = (start, end) => {
    if (!timeRules(start, end)) {
      setAlert([
        'Error',
        'Cannot Start after End.',
      ])
      return false
    }
    else if (!timeRules(start, new Date())) {
      setAlert([
        'Error',
        'Cannot Start before now.',
      ])
      return false

    }
    else if (!timeRules(end, new Date())) {
      setAlert([
        'Error',
        'Cannot End before now.',
      ])
      return false
    }
    else {
      setAlert(false)
      return true
    }
  }

  const timerComplete = () => {
    if (!timeRulesEnforcer(runningTimer[1].created, new Date().toString())) return false
    let completeTimer = runningTimer
    completeTimer[1].ended = new Date().toString()
    completeTimer[1].mood = mood
    completeTimer[1].energy = energy
    completeTimer[1].total = totalTime(completeTimer[1].created, completeTimer[1].ended)
    if (isTimer(completeTimer)) {
      updateTimer(completeTimer)
      finishTimer(completeTimer)
      setAlert(['Success', 'Timer Updated!',])
      history.push((projectlink(completeTimer[1].project)))
    }
    else {
      setAlert(['Error', 'Timer Invalid!',])
    }
  }

  const removeTimer = () => {
    deleteTimer(runningTimer)
    setAlert(['Success', 'Timer Deleted!'])
    closePopup()
    history.push((projectlink(runningTimer[1].project)))
  }

  return (
    <Grid >
      <Popup content='Confirm Delete?' onAccept={() => removeTimer()} onReject={() => closePopup()} />
      <SubHeader title={projectValid(runningProject) ? `${runningProject[1].name}` : 'No Running Timer'} color={projectValid(runningProject) ? runningProject[1].color : ''} />
      {!runningTimer[1] ?
        <Grid container direction='column' justify='center' alignItems='center'>
          <Button variant="contained" color="primary" onClick={() => history.push(projectsListLink())} > Project List </Button>
        </Grid>
        : ''}

      <SideMenu
        options={[{ name: 'delete', action: () => openPopup() }, { name: 'edit' }, { name: 'history' }, { name: 'archive' }]}
      />
      {runningTimer && runningTimer[1] ?
        <Grid container direction='column' justify='center' alignItems='center'>
          <Grid item xs={12}> <Title variant='h2'>{secondsToString(count)}</Title> </Grid>

          <Grid item xs={12}>


            <MoodPicker
              onGreat={() => setMood('great')}
              onGood={() => setMood('good')}
              onMeh={() => setMood('meh')}
              onSad={() => setMood('bad')}
              onAwful={() => setMood('awful')}
              selected={mood}
            />

            <EnergySlider
              startingEnergy={energy}
              onEnergySet={(event, value) => setEnergy(value)}
            />


          </Grid >
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={() => {
              if (isRunning(runningTimer)) {
                timerComplete()
                stop()
              };
            }}>Done</Button>
          </Grid>
        </Grid >
        : ''}
    </Grid >
  )
}