import React, { useState, useEffect, useContext } from 'react'
import { gun, updateTimer, deleteTimer, createTimer, finishTimer } from '../constants/Data'
import { timeRules, totalTime, trimSoul } from '../constants/Functions'
import { isTimer } from '../constants/Validators'
import { useAlert } from 'react-alert'
import { projectlink, projectsListLink } from '../routes/routes'
import { PopupContext } from '../contexts/PopupContext'
import useCounter from '../hooks/useCounter'
import { elapsedTime } from '../constants/Functions'
import { useStyles } from '../themes/DefaultTheme'
import TimerRunning from '../components/templates/TimerRunning'

export default function TimerRunningScreen({useParams, useHistory}) {

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
        setCount(elapsedTime(runningTimerFound[1].started))
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
    if (!timeRulesEnforcer(runningTimer[1].started, new Date().toString())) return false
    let completeTimer = runningTimer
    completeTimer[1].ended = new Date().toString()
    completeTimer[1].mood = mood
    completeTimer[1].energy = energy
    completeTimer[1].total = totalTime(completeTimer[1].started, completeTimer[1].ended)
    if (isTimer(completeTimer)) {
      stop()
      finishTimer(completeTimer)
      setAlert(['Success', 'Timer Updated!',])
      history.push((projectlink(completeTimer[1].project)))
    }
    else {
      setAlert(['Error', 'Timer Invalid!',])
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