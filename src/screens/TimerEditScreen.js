import React, { useState, useEffect, useContext } from 'react'
import { gun, updateTimer, deleteTimer } from '../constants/Data'
import { addMinutes, isValid, sub, add, getMonth, getYear, getHours, getMinutes, getSeconds, getDate } from 'date-fns'
import { timeRules, dateRules, totalTime, trimSoul } from '../constants/Functions'
import { isRunning, isTimer } from '../constants/Validators'
import { useAlert } from '../hooks/useAlert'
import { projectlink, projectsListLink, timerHistorylink } from '../routes/routes'
import { PopupContext } from '../contexts/PopupContext'
import { useStyles } from '../themes/DefaultTheme'
import TimerEdit from '../components/templates/TimerEdit'
import { getTimerForEdit, getProject } from '../constants/Effects'

const debug = false

export default function TimerEditScreen({useParams, useHistory}) {
  const { projectId, timerId } = useParams()
  const [online, setOnline] = useState(false)
  const [project, setProject] = useState([])
  const [timer, setTimer] = useState([])
  const [started, setStarted] = useState('')
  const [ended, setEnded] = useState('')
  const [mood, setMood] = useState('')
  const [energy, setEnergy] = useState(0)
  const [alerted, setAlert] = useState([])
  const [total, setTotal] = useState(0)
  const alert = useAlert()
  let history = useHistory()
  const classes = useStyles()

  let { state, dispatch } = useContext(PopupContext)

  useEffect(() => {
    if (alerted && alerted.length > 0) {
      alert.show(alerted[1], {
        type: alerted[0]
      })
    }
    return () => alerted
  }, [alerted])

  useEffect(() => getTimerForEdit({
    setAlert,
    setStarted,
    setEnded,
    setEnergy,
    setMood,
    setTotal,
    setTimer,
    projectlink,
    projectId,
    timerId,
    history,
    started,
    ended
  }), [online]);

  useEffect(() => getProject({projectId, setProject}), [timer])
  useEffect(() => timer ? setEnergy(timer.energy) : timer, [timer])
  useEffect(() => setTotal(totalTime(started, ended)), [started, ended])

  const openPopup = () => dispatch({ type: "open" });
  const closePopup = () => dispatch({ type: "close" });

  const chooseNewStart = newTime => {
    if (!timeRules(newTime, ended)) {
      
      setAlert([
        'Error',
        'Cannot Start after End.',
      ])
    }
    else if (!timeRules(newTime, new Date())) {
      
      setAlert([
        'Error',
        'Cannot Start before now.',
      ])
    }
    else if (newTime && !dateRules(newTime)) {
      
      setAlert([
        'Error',
        'Cannot Pick Date before Today.',
      ])
    }
    else {
      
      setAlert(false)
      return isValid(newTime) ? setStarted(newTime) : false
    }
  }

  const chooseNewEnd = newTime => {
    if (!timeRules(started, newTime)) {
      
      setAlert([
        'Error',
        'Cannot Start after End.',
      ])
    }
    else if (!timeRules(newTime, new Date())) {
      
      setAlert([
        'Error',
        'Cannot End before now.',
      ])
    }
    else if (newTime && !dateRules(newTime)) {
      
      setAlert([
        'Error',
        'Cannot Pick Date before Today.',
      ])
    }
    else {
      
      setAlert(false)
      return isValid(newTime) ? setEnded(newTime) : false
    }
  }

  const chooseNewDate = newDate => {
    if (dateRules(newDate)) {
      
      if (isValid(newDate)) {
        let newStart = new Date(getYear(newDate), getMonth(newDate), getDate(newDate), getHours(started), getMinutes(started), getSeconds(started))
        setStarted(newStart)
        let newEnd = new Date(getYear(newDate), getMonth(newDate), getDate(newDate), getHours(ended), getMinutes(ended), getSeconds(ended))
        setEnded(newEnd)
      }
      else return false
    } else {
      
      setAlert([
        'Error',
        'Cannot Pick Date before Today.'
      ])
      return false
    }
  }
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

  const editComplete = () => {
    if (!timeRulesEnforcer(started, ended)) return false
    let updatedTimer = timer
    updatedTimer[1].started = started.toString()
    updatedTimer[1].ended = ended.toString()
    updatedTimer[1].mood = mood
    updatedTimer[1].energy = energy
    updatedTimer[1].total = totalTime(started, ended)
    if (isTimer(updatedTimer)) {
      updateTimer(updatedTimer)
      setAlert(['Success', 'Timer Updated!',])
      history.push((projectlink(projectId)))
    }
    else {
      setAlert(['Error', 'Timer Invalid!',])
    }
  }

  const nextDay = () => {
    let newDate = add(started, { days: 1 })
    return chooseNewDate(newDate) ? newDate : started
  }

  const previousDay = () => {
    let newDate = sub(started, { days: 1 })
    return chooseNewDate(newDate) ? newDate : started
  }

  const decreaseStarted = () => {
    let newStarted = addMinutes(new Date(started), -5)
    let checkedEnd = isRunning(timer) ? new Date() : ended
    return timeRulesEnforcer(newStarted, checkedEnd) ? setStarted(newStarted) : started
  }

  const increaseStarted = () => {
    let newStarted = addMinutes(new Date(started), 5)
    let checkedEnd = isRunning(timer) ? new Date() : ended
    return timeRulesEnforcer(newStarted, checkedEnd) ? setStarted(newStarted) : started
  }

  const decreaseEnded = () => {
    let newEnded = isRunning(timer) ? new Date() : addMinutes(new Date(ended), -5)
    return timeRulesEnforcer(started, newEnded) ? setEnded(newEnded) : ended
  }

  const increaseEnded = () => {
    let newEnded = isRunning(timer) ? new Date() : addMinutes(new Date(ended), 5)
    return timeRulesEnforcer(started, newEnded) ? setEnded(newEnded) : ended
  }

  const removeTimer = () => {
    deleteTimer(timer)
    setAlert(['Success', 'Timer Deleted!'])
    closePopup()
    history.push((projectlink(projectId)))
  }

  return (
    <TimerEdit
      classes={classes}
      timer={timer}
      project={project}
      popupAccept={removeTimer}
      popupReject={closePopup}
      sideMenuOptions={[
        { name: 'history', action: () => history.push(timerHistorylink(projectId, timer.id)) },
        { name: 'delete', action: () => openPopup() }
      ]}
      total={total}
      started={started}
      ended={ended}
      chooseNewDate={chooseNewDate}
      previousDay={previousDay}
      nextDay={nextDay}
      chooseNewStart={chooseNewStart}
      increaseStarted={increaseStarted}
      decreaseStarted={decreaseStarted}
      chooseNewEnd={chooseNewEnd}
      increaseEnded={increaseEnded}
      decreaseEnded={decreaseEnded}
      energy={energy}
      setEnergy={setEnergy}
      setMood={setMood}
      mood={mood}
      saveButtonAction={editComplete}
      noTimersAction={() => history.push(projectsListLink())}
    />
    
  )
}