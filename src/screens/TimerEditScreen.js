import React, { useState, useEffect, useContext } from 'react'
import { useParams, useHistory } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { gun, updateTimer, deleteTimer } from '../constants/Data'
import { addMinutes, isValid, endOfDay, sub, add,  getMonth, getYear, getHours, getMinutes, getSeconds, getDate } from 'date-fns'
import { timeRules, dateRules, totalTime, secondsToString } from '../constants/Functions'
import { PickerDate, PickerTime } from '../components/Pickers'
import { EnergySlider } from '../components/TimerEditors'
import { MoodPicker } from '../components/MoodPicker'
import { isRunning, isTimer, projectValid } from '../constants/Validators'
import { Grid, makeStyles, Button } from '@material-ui/core/'
import { useAlert } from 'react-alert'
import { Title, SubTitle } from '../components/Title'
// import { Button } from '../components/Button'
import { SubHeader } from '../components/Header'
import { projectlink, projectsListLink } from '../routes/routes'
import SideMenu from '../components/SideMenu'
import Popup from '../components/Popup'
import { PopupContext } from '../contexts/PopupContext'
import { useStyles } from '../themes/DefaultTheme'

export default function TimerEditScreen() {
  const { projectId, timerId } = useParams()
  const [online, setOnline] = useState(false)
  const [project, setProject] = useState([])
  const [timer, setTimer] = useState([])
  const [created, setCreated] = useState('')
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
        setCreated(new Date(foundTimer[1].created))
        setEnded(new Date(foundTimer[1].ended))
        setMood(foundTimer[1].mood)
        setEnergy(foundTimer[1].energy)
        setTotal(foundTimer[1].total === 0 ? totalTime(created, ended) : foundTimer[1].total)
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
  useEffect(() => setTotal(totalTime(created, ended)), [created, ended])

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
      return isValid(newTime) ? setCreated(newTime) : false
    }
  }

  const chooseNewEnd = newTime => {
    if (!timeRules(created, newTime)) {
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
        let newStart = new Date(getYear(newDate), getMonth(newDate), getDate(newDate), getHours(created), getMinutes(created), getSeconds(created))
        setCreated(newStart)
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
    if (!timeRulesEnforcer(created, ended)) return false
    let updatedTimer = timer
    updatedTimer[1].created = created.toString()
    updatedTimer[1].ended = ended.toString()
    updatedTimer[1].mood = mood
    updatedTimer[1].energy = energy
    updatedTimer[1].total = totalTime(created, ended)
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
    let newDate = add(created, { days: 1 })
    return chooseNewDate(newDate) ? newDate : created
  }

  const previousDay = () => {
    let newDate = sub(created, { days: 1 })
    return chooseNewDate(newDate) ? newDate : created
  }

  const decreaseCreated = () => {
    let newCreated = addMinutes(new Date(created), -5)
    let checkedEnd = isRunning(timer) ? new Date() : ended
    return timeRulesEnforcer(newCreated, checkedEnd) ? setCreated(newCreated) : created
  }

  const increaseCreated = () => {
    let newCreated = addMinutes(new Date(created), 5)
    let checkedEnd = isRunning(timer) ? new Date() : ended
    return timeRulesEnforcer(newCreated, checkedEnd) ? setCreated(newCreated) : created
  }

  const decreaseEnded = () => {
    let newEnded = isRunning(timer) ? new Date() : addMinutes(new Date(ended), -5)
    return timeRulesEnforcer(created, newEnded) ? setEnded(newEnded) : ended
  }

  const increaseEnded = () => {
    let newEnded = isRunning(timer) ? new Date() : addMinutes(new Date(ended), 5)
    return timeRulesEnforcer(created, newEnded) ? setEnded(newEnded) : ended
  }

  const removeTimer = () => {
    deleteTimer(timer)
    setAlert(['Success', 'Timer Deleted!'])
    closePopup()
    history.push((projectlink(projectId)))
  }

  return (
    <Grid >
      <Popup content='Confirm Delete?' onAccept={() => removeTimer()} onReject={() => closePopup()} />
      <SubHeader title={projectValid(project) ? `${project[1].name}` : 'No Timer Here'} color={projectValid(project) ? project[1].color : ''} />
      {timer && isTimer(timer) ?
        <SideMenu
          options={[{ name: 'delete', action: () => openPopup() }, { name: 'archive', action: () => { } }]}
        />
        : ' '}
      {timer && isTimer(timer) ?
        <Grid container direction='column' justify='center' alignItems='center'>
          <Grid item xs={12}> <Title variant='h5'>{secondsToString(total)}</Title> </Grid>

          <Grid item xs={12}>
            <PickerDate
              label='Date'
              startdate={created}
              onDateChange={newDate => chooseNewDate(newDate)}
              maxDate={endOfDay(new Date())}
              previousDay={() => previousDay()}
              nextDay={() => nextDay()}
            />
            {/* {created.toString()} */}
            <PickerTime
              label='Start'
              time={created}
              onTimeChange={newTime => chooseNewStart(newTime)}
              addMinutes={() => increaseCreated()}
              subtractMinutes={() => decreaseCreated()}
            />
            {/* {ended.toString()} */}
            <PickerTime
              label='End'
              time={ended}
              onTimeChange={newTime => chooseNewEnd(newTime)}
              running={isRunning(timer)}
              addMinutes={() => increaseEnded()}
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