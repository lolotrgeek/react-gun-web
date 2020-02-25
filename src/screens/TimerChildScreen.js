import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from "react-router-dom"
import { updateTimer, newTimer } from '../constants/Models'
import { trimSoul } from '../constants/Store'
import { gun } from '../constants/Data'
import useGlobalState from '../hooks/useGlobalState'


export default function TimerChildScreen() {
  const { projectId, timerId, runningId } = useParams()
  const [online, setOnline] = useState(false)
  const [timers, setTimers] = useState([])

  const globalState = useGlobalState()
  const setRunningTimer = timer => globalState.setItem(timer)
  const runningTimer = globalState.item


  // const idObject = useRef(id.split(','))
  // const projectId = useRef(idObject[0])
  // const timerId = useRef(idObject[1])

  const createTimer = () => {
    if (runningTimer && typeof runningTimer === 'object' && Object.keys(runningTimer).length === 2 && runningTimer.key && runningTimer.value) {
      let doneTimer = [runningTimer.key, runningTimer.value]
      doneTimer[1].status = 'done'
      updateTimer(doneTimer)
      let filteredTimers = timers.filter(timer => timer[0] !== doneTimer[0])
      setTimers(filteredTimers)
      gun.get('history').get('timers').get(projectId).get(doneTimer[0]).set(doneTimer[1])
      gun.get('timers').get(projectId).get(doneTimer[0]).put(doneTimer[1])
    }
    const timer = newTimer({ project: projectId })
    gun.get('history').get('timers').get(projectId).get(timer[0]).set(timer[1])
    gun.get('timers').get(projectId).get(timer[0]).put(timer[1])
  }

  const stopTimer = (timer) => {
    if (timer && Array.isArray(timer) && timer.length === 2 && timer[1].status === 'running') {
      let doneTimer = timer
      doneTimer[1].status = 'done'
      updateTimer(doneTimer)
      let filteredTimers = timers.filter(timer => timer[0] !== doneTimer[0])
      setTimers(filteredTimers)
      setRunningTimer({})
      gun.get('history').get('timers').get(doneTimer[1].project).get(doneTimer[0]).set(doneTimer[1])
      gun.get('timers').get(doneTimer[1].project).get(doneTimer[0]).put(doneTimer[1])
    }
  }

  useEffect(() => {
    if(runningId && typeof runningId === 'string') {
      gun.get('timers').get(projectId).get(runningId).on((timerValue, timerKey) => {
        if (timerValue.status === 'running') {
          let runningValue = trimSoul(timerValue)
          setRunningTimer([timerKey, runningValue])
        }
      })
    }
  }, [online]);

  useEffect(() => {
    gun.get('history').get('timers').get(projectId).get(timerId).map().on((timerValue, timerGunId) => {
      setTimers(timers => [...timers, [timerId, trimSoul(timerValue), timerGunId]])
    }
      , { change: true })
    return () => gun.get('timers').off()
  }, [online]);


  return (
    <div>
      <h2>Timer History {projectId}/{timerId} </h2>
      <h4>{runningTimer && typeof runningTimer === 'object' && Object.keys(runningTimer).length === 2 && runningTimer.key && runningTimer.value ? `Running Timer ${runningTimer.value.project}/ ${runningTimer.key}` : ''}</h4>
      <button type='button' onClick={() => runningTimer.key && runningTimer.value ? stopTimer([runningTimer.key, runningTimer.value]) : null}>Stop Timer</button>
      <div>
        <ol>
          {timers.map(timer => {
            return (
              <li key={timer[2]}>
                <Link to={`/timer/${timer[0]}/${runningTimer ? runningTimer[0]: ''}`}>{`${JSON.stringify(timer[1])}`}</Link>
                <button type='button' onClick={() => createTimer(timer)}>New Timer</button>
              </li>
            )
          })}
        </ol></div>
    </div >
  )
}
