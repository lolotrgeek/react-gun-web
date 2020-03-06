import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { elapsedTime } from '../constants/Functions'
import { isRunning } from '../constants/Validators'
import { gun, finishTimer } from '../constants/Data'
import useCounter from '../hooks/useCounter'
import SpacingGrid from '../components/Grid'
import { Grid, Button } from '@material-ui/core/'
import {timerlink} from '../routes/routes'


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
    <Grid>
      <h2>Timeline</h2>
      <h4>
        {isRunning(runningTimer) ?`Running Timer ${runningTimer[1].project}/${runningTimer[0]}/ Count: ${count}` : ''}
      </h4>
      <Button variant="contained" color="primary"  onClick={() => { if (isRunning(runningTimer)) finishTimer(runningTimer); stop()  }}>Stop Timer</Button>
      <Grid>
        
        {timers.map(timer => {
          console.log(timer[0])
            return (
                <Link to={ timerlink(timer[1].project, timer[0])}>
                  <SpacingGrid values={Object.values(timer[1])}></SpacingGrid>
                </Link>
            )
          })}
        </Grid>
    </Grid >
  )
}