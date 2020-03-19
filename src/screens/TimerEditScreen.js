import React, { useState, useEffect, useContext } from 'react'
import { useParams, useHistory } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { gun, updateTimer, deleteTimer } from '../constants/Data'
import { addMinutes, isValid, endOfDay, sub, add, getMonth, getYear, getHours, getMinutes, getSeconds, getDate } from 'date-fns'
import { timeRules, dateRules, totalTime, secondsToString } from '../constants/Functions'
import { PickerDate, PickerTime } from '../components/Pickers'
import { EnergySlider } from '../components/EnergySlider'
import { MoodPicker } from '../components/MoodPicker'
import { isRunning, isTimer, projectValid } from '../constants/Validators'
import { Grid, makeStyles, Button } from '@material-ui/core/'
import { useAlert } from 'react-alert'
import { Title, SubTitle } from '../components/Title'
// import { Button } from '../components/Button'
import { SubHeader } from '../components/Header'
import { projectlink, projectsListLink, timerHistorylink } from '../routes/routes'
import SideMenu from '../components/SideMenu'
import Popup from '../components/Popup'
import { PopupContext } from '../contexts/PopupContext'
import { useStyles } from '../themes/DefaultTheme'
import Stateless from '../components/Stateless'

export default function TimerEditScreen() {
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
  const [date, setDate] = useState('')
  const [picker, setPicker] = useState(false)
  const [deleted, setDeleted] = useState(false)
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
      else {
        let foundTimer = [timerId, trimSoul(timerValue)]
        setStarted(new Date(foundTimer[1].started))
        setEnded(new Date(foundTimer[1].ended))
        setMood(foundTimer[1].mood)
        setEnergy(foundTimer[1].energy)
        setTotal(foundTimer[1].total === 0 ? totalTime(started, ended) : foundTimer[1].total)
        setTimer(foundTimer)
      }

    }, { change: true })
    return () => gun.get('timers').off()
  }, [online]);

  useEffect(() => {
    gun.get('projects').get(projectId).on((projectValue, projectKey) => {
      console.log(projectValue)
      setProject([projectKey, projectValue])
    }
      , { change: true })
    return () => gun.get('projects').off()
  }, [timer])
  useEffect(() => timer[1] ? setEnergy(timer[1].energy) : timer[1], [timer])
  useEffect(() => setTotal(totalTime(started, ended)), [started, ended])

  const openPopup = () => dispatch({ type: "open" });
  const closePopup = () => dispatch({ type: "close" });

  const chooseNewStart = newTime => {
    if (!timeRules(newTime, ended)) {
      setPicker(false);
      setAlert([
        'Error',
        'Cannot Start after End.',
      ])
    }
    else if (!timeRules(newTime, new Date())) {
      setPicker(false);
      setAlert([
        'Error',
        'Cannot Start before now.',
      ])
    }
    else if (newTime && !dateRules(newTime)) {
      setPicker(false);
      setAlert([
        'Error',
        'Cannot Pick Date before Today.',
      ])
    }
    else {
      setPicker(false)
      setAlert(false)
      return isValid(newTime) ? setStarted(newTime) : false
    }
  }

  const chooseNewEnd = newTime => {
    if (!timeRules(started, newTime)) {
      setPicker(false);
      setAlert([
        'Error',
        'Cannot Start after End.',
      ])
    }
    else if (!timeRules(newTime, new Date())) {
      setPicker(false);
      setAlert([
        'Error',
        'Cannot End before now.',
      ])
    }
    else if (newTime && !dateRules(newTime)) {
      setPicker(false);
      setAlert([
        'Error',
        'Cannot Pick Date before Today.',
      ])
    }
    else {
      setPicker(false)
      setAlert(false)
      return isValid(newTime) ? setEnded(newTime) : false
    }
  }

  const chooseNewDate = newDate => {
    if (dateRules(newDate)) {
      setPicker(false);
      if (isValid(newDate)) {
        let newStart = new Date(getYear(newDate), getMonth(newDate), getDate(newDate), getHours(started), getMinutes(started), getSeconds(started))
        setStarted(newStart)
        let newEnd = new Date(getYear(newDate), getMonth(newDate), getDate(newDate), getHours(ended), getMinutes(ended), getSeconds(ended))
        setEnded(newEnd)
      }
      else return false
    } else {
      setPicker(false);
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
    <Grid className={classes.listRoot}>
      <Popup content='Confirm Delete?' onAccept={() => removeTimer()} onReject={() => closePopup()} />
      {projectValid(project) && isTimer(timer) ?
        <SubHeader title={projectValid(project) ? `${project[1].name}` : 'No Timer Here'} color={projectValid(project) ? project[1].color : ''} />
        : <Stateless />
      }

      {timer && isTimer(timer) ?
        <SideMenu
          options={[
            { name: 'history', action: () => history.push(timerHistorylink(projectId, timer[0])) },
            { name: 'delete', action: () => openPopup() }
          ]}
        />
        : ' '}
      {timer && isTimer(timer) ?
        <Grid container direction='column' justify='flex-start' alignItems='center'>
          <Grid item xs={12}> <Title variant='h5'>{secondsToString(total)}</Title> </Grid>

          <Grid item xs={12}>
            <PickerDate
              label='Date'
              startdate={started}
              onDateChange={newDate => chooseNewDate(newDate)}
              maxDate={endOfDay(new Date())}
              previousDay={() => previousDay()}
              nextDay={() => nextDay()}
            />
            {/* {started.toString()} */}
            <PickerTime
              label='Start'
              time={started}
              onTimeChange={newTime => chooseNewStart(newTime)}
              addMinutes={() => increaseStarted()}
              subtractMinutes={() => decreaseStarted()}
            />
            {/* {ended.toString()} */}
            <PickerTime
              label='End'
              time={ended}
              onTimeChange={newTime => chooseNewEnd(newTime)}
              addMinutes={() => increaseEnded()}
              running={isRunning(timer)}
              subtractMinutes={() => decreaseEnded()}
            />

            {
              timer[1] ?
                <EnergySlider
                  startingEnergy={energy}
                  onEnergySet={(event, value) => setEnergy(value)}
                /> : ''
            }
            <MoodPicker
              onGreat={() => setMood('great')}
              onGood={() => setMood('good')}
              onMeh={() => setMood('meh')}
              onBad={() => setMood('bad')}
              onAwful={() => setMood('awful')}
              selected={mood}
            />
          </Grid >
          <Grid item className={classes.space2} xs={12}>
            <Button variant="contained" color="primary" onClick={() => editComplete()}>Save</Button>
          </Grid>
        </Grid >
        :
        <Grid container direction='column' justify='center' alignItems='center'>
          <Button variant="contained" color="primary" onClick={(() => history.push(projectsListLink()))}> Projects </Button>
        </Grid>
      }
    </Grid >
  )
}