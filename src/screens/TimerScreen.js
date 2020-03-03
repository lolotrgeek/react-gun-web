import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { elapsedTime } from '../constants/Functions'
import { isRunning } from '../constants/Validators'
import { gun, stopTimer } from '../constants/Data'
import useCounter from '../hooks/useCounter'


export default function TimerScreen() {
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
    let currentTimers = []
    gun.get('timers').map().on((timerGunId, projectKey) => {
      gun.get('timers').get(projectKey).map().on((timerValue, timerKey) => {
        const foundTimer = [timerKey, trimSoul(timerValue)]
        if (foundTimer[1].status === 'done') {
          let check = currentTimers.some(id => id === foundTimer[0])
          if (!check) {
            console.log('Adding Timer', foundTimer)
            setTimers(timers => [...timers, foundTimer])
          }
          currentTimers.push(foundTimer[0])
        }
        else {
          gun.get('running').get('timer').put(JSON.stringify(foundTimer))
        }
      })
    }, { change: true })
    return () => gun.get('timers').off()
  }, [online]);


  return (
    <div>
      <h2>Timeline</h2>
      <h4>
        {isRunning(runningTimer) ?`Running Timer ${runningTimer[1].project}/${runningTimer[0]}/ Count: ${count}` : ''}
      </h4>
      <button type='button' onClick={() => { if (isRunning(runningTimer)) stopTimer(runningTimer); stop()  }}>Stop Timer</button>
      <div>
        <ol>
        {timers.map(timer => {
          console.log(timer[0])
            return (
              <li key={timer[0]}>
                <Link to={`/timer/${timer[1].project}/${timer[0]}`}>
                  {`${timer[0]}`}
                  <ul>
                    {/* <li>{`${timer[1].created}`}</li>
                    <li>{`${timer[1].ended}`}</li> */}
                    <li>{`${timer[1].status}`}</li>
                    <li>{`${timer[1].project}`}</li>
                  </ul>

                </Link>
              </li>
            )
          })}
        </ol></div>
    </div >
  )
}