import React, { useState, useEffect, useContext } from 'react'
import { deleteTimer, finishTimer } from '../constants/Data'
import { timeRules, totalTime, trimSoul } from '../constants/Functions'
import { isTimer } from '../constants/Validators'
import { useAlert } from '../hooks/useAlert'
import { projectlink, projectsListLink } from '../routes/routes'
import { PopupContext } from '../contexts/PopupContext'
import useCounter from '../hooks/useCounter'
import { elapsedTime } from '../constants/Functions'
import { useStyles } from '../themes/DefaultTheme'
import TimerRunning from '../components/templates/TimerRunning'
import { getProjects, getRunningTimer, getRunningProject, getTimers, getTimerRunning } from '../constants/Effects'

const debug = false

export default function TimerRunningScreen({ useParams, useHistory }) {
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
      alert.show(alerted[1], {type: alerted[0]})}
    return () => alerted
  }, [alerted])

  useEffect(() => getTimerRunning({setMood, setEnergy, setCount, start, stop, setRunningTimer, runningProject, setAlert}), [online]);
  useEffect(() => getRunningProject({runningTimer, setRunningProject}), [online, runningTimer])

  //TODO - nice to have: update mood and energy slider realtime
  // useEffect(() => {
  //   if (runningTimer.length > 0) {
  //     let updateRunningTimer = runningTimer
  //     updateRunningTimer[1].mood = mood
  //     gun.get('running').get('timer').put(updateRunningTimer)
  //   }

  // }, [mood])

  useEffect(() => runningTimer && runningTimer[1] ? setEnergy(runningTimer[1].energy) : () => null, [runningTimer])

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
    let ended = new Date()
    let started = new Date(runningTimer[1].started)
    if (!timeRulesEnforcer(started, ended)) return false
    let completeTimer = runningTimer
    completeTimer[1].ended = ended.toString()
    completeTimer[1].mood = mood
    completeTimer[1].energy = energy
    completeTimer[1].total = totalTime(started, ended)
    if (isTimer(completeTimer)) {
      debug && console.log('Completing Timer: ', completeTimer)
      stop()
      finishTimer(completeTimer)
      alert.show('Timer Complete!', {
        type: 'Success'
      })
      // setAlert(['Success', 'Timer Updated!',])
      history.push((projectlink(completeTimer[1].project)))
      return true
    }
    else {
      alert.show('Timer Invalid!', {
        type: 'Error'
      })
      // setAlert(['Error', 'Timer Invalid!',])
      return false
    }
  }

  const removeTimer = () => {
    finishTimer(runningTimer)
    stop()
    deleteTimer(runningTimer)
    setAlert(['Success', 'Timer Deleted!'])
    closePopup()
    history.push((projectlink(runningTimer[1].project)))
  }

  return (
    <TimerRunning
      classes={classes}
      runningTimer={runningTimer}
      runningProject={runningProject}
      count={count}
      popupAccept={removeTimer}
      popupReject={closePopup}
      noTimerAction={() => history.push(projectsListLink())}
      mood={mood}
      setMood={setMood}
      energy={energy}
      setEnergy={setEnergy}
      timerCompleteAction={timerComplete}
    />
  )
}