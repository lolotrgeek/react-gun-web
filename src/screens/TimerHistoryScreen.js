import React, { useState, useEffect, useRef } from 'react'
import { useParams } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { gun, finishTimer, createTimer } from '../constants/Data'
import { isRunning } from '../constants/Validators'
import { elapsedTime } from '../constants/Functions'
import useCounter from '../hooks/useCounter'
import SpacingGrid from '../components/Grid'
import { Grid } from '@material-ui/core/'
import { RunningTimer } from '../components/RunningTimer'
import { timerlink } from '../routes/routes'
import { Title } from '../components/Title'
import { Link } from '../components/Link'
import { Button } from '../components/Button'
import { useStyles } from '../themes/DefaultTheme'

export default function TimerHistoryScreen() {
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
    <Grid>
      <h2>Timer History {projectId}/{timerId} </h2>
      {isRunning(runningTimer) ? <RunningTimer project={runningTimer[1].project} count={count} stop={() => { finishTimer(runningTimer); stop() }} /> : ''}
      <Button variant="contained" color="primary"  onClick={() => { if (isRunning(runningTimer)) { finishTimer(runningTimer); stop() } }}>Stop Timer</Button>
      <Button variant="contained" color="primary"  onClick={() => { if (isRunning(runningTimer)) { finishTimer(runningTimer); stop() }; createTimer(projectId) }}>New Timer</Button>
      {timers.map(timer => {
        return (
          <Grid>
            <Link to={timerlink(projectId,timerId)}>
              <SpacingGrid values={Object.values(timer[1])}></SpacingGrid>
            </Link>
          </Grid>
        )
      })}

    </Grid >
  )
}
