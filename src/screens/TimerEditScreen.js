import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { gun, updateTimer } from '../constants/Data'
import { addMinutes, isValid, endOfDay, set } from 'date-fns'
import { timeRules, simpleDate, timeString, dateRules, totalTime } from '../constants/Functions'
import { DatePicker, TimePicker } from '../components/DatePickers'
import { MoodPicker, EnergySlider } from '../components/TimerEditors'
import { isRunning, isTimer } from '../constants/Validators'
import { useAlert } from 'react-alert'

export default function TimerEditScreen() {
  const { projectId, timerId } = useParams()
  const [online, setOnline] = useState(false)
  const [timer, setTimer] = useState([])
  const [created, setCreated] = useState('')
  const [ended, setEnded] = useState('')
  const [mood, setMood] = useState('')
  const [energy, setEnergy] = useState(0)
  const [alerted, setAlert] = useState([])
  const [picker, setPicker] = useState(false)
  const alert = useAlert()

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
    gun.get('timers').get(projectId).get(timerId).on((timerValue, timerGunId) => {
      let foundTimer = [timerId, trimSoul(timerValue)]
      setCreated(new Date(foundTimer[1].created))
      setEnded(new Date(foundTimer[1].ended))
      setMood(foundTimer[1].mood)
      setEnergy(foundTimer[1].energy)
      setTimer(foundTimer)
    }, { change: true })
    return () => gun.get('timers').off()
  }, [online]);

  useEffect(() => timer[1] ? setEnergy(timer[1].energy) : timer[1], [timer])

  const chooseNewTime = newTime => {
    if (!timeRules(created, ended)) {
      setPicker(false);
      setAlert([
        'Error',
        'Cannot Start after End.',
      ])
    }
    else if (!timeRules(created, new Date())) {
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

  const chooseNewDate = newDate => {
    if (dateRules(newDate)) {
      setPicker(false);
      return isValid(newDate) ? setCreated(newDate) : false
    } else {
      setPicker(false);
      setAlert([
        'Error',
        'Cannot Pick Date before Today.'
      ]
      )
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
    }
    else {
      setAlert(['Error', 'Timer Invalid!',])
    }
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

  return (
    <div>
      <h2>Timer Edit {projectId}/{timerId} </h2>
      <div>
        <DatePicker
          label=' '
          startdate={created}
          onDateChange={newDate => chooseNewDate(newDate)}
          maxDate={endOfDay(created)}
        />

        <TimePicker
          label=' '
          time={created}
          onTimeChange={newTime => setCreated(newTime)}
          addMinutes={() => increaseCreated()}
          subtractMinutes={() => decreaseCreated()}
        />

        <TimePicker
          label=' '
          time={ended}
          onTimeChange={newTime => setEnded(newTime)}
          running={isRunning(timer)}
          addMinutes={() => increaseEnded()}
          subtractMinutes={() => decreaseEnded()}
        />
        <MoodPicker
          onGreat={() => setMood('great')}
          onGood={() => setMood('good')}
          onMeh={() => setMood('meh')}
          onSad={() => setMood('bad')}
          onAwful={() => setMood('awful')}
          selected={mood}
        />
        {timer[1] ?
          <EnergySlider
            startingEnergy={energy}
            onEnergySet={(event, value) => setEnergy(value)}
          /> : ''}

        <button onClick={() => editComplete()}>Done</button>
      </div>
    </div >
  )
}