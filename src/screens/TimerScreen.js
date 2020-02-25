import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { isRunning } from '../constants/Functions'
import { gun } from '../constants/Data'
import useGlobalState from '../hooks/useGlobalState'


export default function TimerScreen() {
  const [online, setOnline] = useState(false)
  const [timers, setTimers] = useState([])

  const globalState = useGlobalState()
  const setRunningTimer = timer => globalState.setItem(timer)
  const runningTimer = globalState.item

  useEffect(() => {
    console.log(runningTimer)
    gun.get('timers').map().on((timerId, projectKey) => {
      gun.get('timers').get(projectKey).map().on((timerValue, timerKey) => {
        const timer = [timerKey, trimSoul(timerValue)]
        setTimers(timers => [...timers, timer])
        if (isRunning(timer)) setRunningTimer(timer)
      })
    }
      , { change: true })
    return () => gun.get('timers').off()
  }, [online]);

  return (
    <div>
      <h2>Timers</h2>
      <h4>{runningTimer && Array.isArray(runningTimer) ? `Running Timer ${runningTimer[1].project}/ ${runningTimer[0]}` : ''}</h4>
      <div>
        <ol>
          {timers.map(timer => {
            return (
              <li key={timer[0]}>
                <Link to={`/timer/${timer[1].project}/${timer[0]}`}>{`${JSON.stringify(timer[1])}`}</Link>
              </li>
              // <li key={project[0]}><Link to={`/timer/${timer[0]}`}>{`${timer[1].status}, ${timer[1].created}`}</Link></li>
            )
          })}
        </ol></div>
    </div >
  )
}