import React, { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { elapsedTime, simpleDate, timeString } from '../constants/Functions'
import useCounter from '../hooks/useCounter'
import { gun, createProject, finishTimer, createTimer } from '../constants/Data'
import { isRunning } from '../constants/Validators'
import SpacingGrid from '../components/Grid'
import { Grid, Button } from '@material-ui/core/'
import { MoodDisplay } from '../components/TimerDisplay'
import { RunningTimer } from '../components/RunningTimer'
import { Title } from '../components/Title'
import { projectlink, timerlink} from '../routes/routes'


export default function ProjectRecordScreen() {
  const { projectId,  } = useParams()
  const [online, setOnline] = useState(false)
  const [project, setProject] = useState([])
  const [timers, setTimers] = useState([])
  const [runningTimer, setRunningTimer] = useState('')
  const { count, setCount, start, stop } = useCounter(1000, false)

  useEffect(() => {
    let filteredTimers = timers.filter(timer => timer[0] !== runningTimer[0])
    setTimers(filteredTimers)
  }, [runningTimer])

  useEffect(() => {
    gun.get('projects').get(projectId).on((projectValue, projectGunKey) => {
      setProject([projectId, trimSoul(projectValue)])
    }, { change: true })
    return () => gun.get('projects').off()
  }, [online]);

  useEffect(() => {
    let currentTimers = []
    gun.get('timers').get(projectId).map().on((timerValue, timerKey) => {
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
    }, { change: true })

    return () => gun.get('timers').off()
  }, [online]);

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

  return (
    <Grid container direction="column" justify="center" alignItems="center" spacing={4} >
      <Link to={projectlink(projectId)}> <Title project={project} /></Link>
      {isRunning(runningTimer) ? <RunningTimer project={runningTimer[1].project} count={count} stop={() => { finishTimer(runningTimer); stop() }} /> : ''}
      <Button variant="contained" color="primary" onClick={() => {
        if (isRunning(runningTimer)) { stop(); finishTimer(runningTimer) }
        createTimer(projectId)
      }}>New Timer</Button>
      <h3>Timers</h3>
      <Grid>
        <SpacingGrid headers={['Date', 'Started', 'Ended', 'Energy', 'Mood']} />
        {timers.map(timer => {
          let creation = new Date(timer[1].created)
          return (
            <Link to={timerlink(projectId, timer[0])}>
              <SpacingGrid
                values={[
                  simpleDate(creation),
                  timeString(creation),
                  timeString(new Date(timer[1].ended)),
                  timer[1].energy,
                  <MoodDisplay mood={timer[1].mood} />
                ]} />
            </Link>
          )
        })}
      </Grid>
    </Grid >
  )
}