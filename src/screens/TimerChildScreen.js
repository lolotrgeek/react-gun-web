import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { gun, stopTimer, createTimer } from '../constants/Data'
import { isRunning } from '../constants/Validators'
import { elapsedTime } from '../constants/Functions'
import useCounter from '../hooks/useCounter'
import SpacingGrid from '../components/Grid'

export default function TimerChildScreen() {
  const { projectId, timerId } = useParams()
  const [online, setOnline] = useState(false)
  const [timers, setTimers] = useState([])
  const [runningTimer, setRunningTimer] = useState('')
  const { count, setCount, start, stop } = useCounter(1000, false)

  useEffect(() => {
    gun.get('running').get('timer').on((runningTimerGun, runningTimerKeyGun) => {
      const runningTimerFound = trimSoul(JSON.parse(runningTimerGun))
      if (isRunning(runningTimerFound)) {
        setRunningTimer(runningTimerFound)
        console.log('runningTimerFound', runningTimerFound)
        setCount(elapsedTime(runningTimerFound[1].created))
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
    gun.get('history').get('timers').get(projectId).get(timerId).map().on((timerValue, timerGunId) => {
      setTimers(timers => [...timers, [timerId, trimSoul(timerValue), timerGunId]])
    }, { change: true })
    return () => gun.get('timers').off()
  }, [online]);

  return (
    <div>
      <h2>Timer History {projectId}/{timerId} </h2>
      <h4>
        {isRunning(runningTimer) ? `Running Timer ${runningTimer[1].project}/${runningTimer[0]}/ Count: ${count}` : ''}
      </h4>
      <button type='button' onClick={() => { if (isRunning(runningTimer)) { stopTimer(runningTimer); stop() } }}>Stop Timer</button>
      <button type='button' onClick={() => { if (isRunning(runningTimer)) { stopTimer(runningTimer); stop() }; createTimer(projectId) }}>New Timer</button>
      {timers.map(timer => {
        return (
          <div>
            <Link to={`/timer/${timer[0]}`}>
              <SpacingGrid values={Object.values(timer[1])}></SpacingGrid>
            </Link>
          </div>
        )
      })}

    </div >
  )
}
