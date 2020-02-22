import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { gun } from '../constants/Data'


export default function TimerScreen() {
  const [online, setOnline] = useState(false)
  const [timers, setTimers] = useState([])

  useEffect(() => {
    gun.get('timers').map().on((timerId, projectKey) => {
      gun.get('timers').get(projectKey).map().on((timerValue, timerKey) => {
        setTimers(timers => [...timers, [timerKey, trimSoul(timerValue)]])
      })
    }
      , { change: true })
    return () => gun.get('timers').off()
  }, [online]);

  return (
    <div>
      <h2>Timers</h2>
      <div>
        <ol>
          {timers.map(timer => {
            return (
              <li key={timer[0]}>
                <Link to={`/timer/${timer[1].project},${timer[0]}`}>{`${JSON.stringify(timer[1])}`}</Link>
              </li>
              // <li key={project[0]}><Link to={`/timer/${timer[0]}`}>{`${timer[1].status}, ${timer[1].created}`}</Link></li>
            )
          })}
        </ol></div>
    </div >
  )
}