import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from "react-router-dom"
import { updateTimer } from '../constants/Models'
import { trimSoul } from '../constants/Store'
import {gun} from '../constants/Data'


export default function TimerChildScreen() {
  const { id } = useParams()
  const [online, setOnline] = useState(false)
  const [timers, setTimers] = useState([])

  const idObject = useRef(id.split(','))
  const projectId = useRef(idObject.current[0])
  const timerId = useRef(idObject.current[1])

  const createTimer = (timer) => {
    const timerNew = updateTimer(timer)
    gun.get('history').get('timers').get(projectId.current).get(timerId.current).set(timerNew[1])
    gun.get('timers').get(projectId.current).get(timerId.current).put(timerNew[1])
  }

  useEffect(() => {
    gun.get('history').get('timers').get(projectId.current).get(timerId.current).map().on((timerValue, timerGunId) => {
      console.log(timerValue)
      setTimers(timers => [...timers, [timerId, trimSoul(timerValue), timerGunId]])
    }
      , { change: true })
    return () => gun.get('timers').off()
  }, [online]);


  return (
    <div>
      <h2>Timer History {id} </h2>
      <div>
        <ol>
          {timers.map(timer => {
            return (
              <li key={timer[2]}>
                <Link to={`/timer/${timer[0]}`}>{`${JSON.stringify(timer[1])}`}</Link>
                <button type='button' onClick={() => createTimer(timer)}>Stop Timer</button>
              </li>
            )
          })}
        </ol></div>
    </div >
  )
}
