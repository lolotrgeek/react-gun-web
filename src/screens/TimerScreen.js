import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { isRunning, elapsedTime } from '../constants/Functions'
import { updateTimer } from '../constants/Models'
import { gun } from '../constants/Data'
import useGlobalState from '../hooks/useGlobalState'
import useCounter from '../hooks/useCounter'


export default function TimerScreen() {
  const [online, setOnline] = useState(false)
  const [timers, setTimers] = useState([])

  const globalState = useGlobalState()
  const setRunningTimer = timer => globalState.setItem(timer)
  const runningTimer = globalState.item

  const { count, setCount, start, stop } = useCounter(1000, false)

  useEffect(() => {
    // if (runningTimer && typeof runningTimer === 'object' && Object.keys(runningTimer).length === 2 && runningTimer.key && runningTimer.value && runningTimer.value.status === 'running') {
    gun.get('timers').get('running').on((runningTimerGun, runningTimerKeyGun) => {
      setRunningTimer(runningTimerGun)
      console.log('runningTimer', runningTimer)
      setCount(elapsedTime(runningTimerGun.value.created))
      start()
    })
    // }
  }, [timers])


  useEffect(() => {
    console.log(runningTimer)
    gun.get('timers').map().on((timerId, projectKey) => {
      gun.get('timers').get(projectKey).map().on((timerValue, timerKey) => {
        const timer = [timerKey, trimSoul(timerValue)]
        setTimers(timers => [...timers, timer])
        // if (isRunning(timer)) setRunningTimer(timer)
      })
    }, { change: true })
    return () => gun.get('timers').off()
  }, [online]);

  const stopTimer = (timer) => {
    if (timer && Array.isArray(timer) && timer.length === 2 && timer[1].status === 'running') {
      stop()
      let doneTimer = timer
      doneTimer[1].status = 'done'
      updateTimer(doneTimer)
      let filteredTimers = timers.filter(timer => timer[0] !== doneTimer[0])
      setTimers(filteredTimers)
      setRunningTimer({})
      console.log('runningTimer', runningTimer)
      gun.get('history').get('timers').get(doneTimer[1].project).get(doneTimer[0]).set(doneTimer[1])
      gun.get('timers').get(doneTimer[1].project).get(doneTimer[0]).put(doneTimer[1])
      gun.get('timers').get('running').put({})
    }
  }
  
  return (
    <div>
      <h2>Timers</h2>
      <h4>
        {runningTimer && typeof runningTimer === 'object' && Object.keys(runningTimer).length === 2 && runningTimer.key && runningTimer.value ?
          `Running Timer ${runningTimer.value.project}/${runningTimer.key}/ Count: ${count}` : ''
        }
      </h4>
      <button type='button' onClick={() => runningTimer.key && runningTimer.value ? stopTimer([runningTimer.key, runningTimer.value]) : null}>Stop Timer</button>
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