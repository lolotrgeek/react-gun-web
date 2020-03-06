import { Button, Grid } from '@material-ui/core/'
import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import SpacingGrid from '../components/Grid'
import { createTimer, finishTimer, gun } from '../constants/Data'
import { dayHeaders, elapsedTime, sayDay, secondsToString, sumProjectTimers } from '../constants/Functions'
import { trimSoul } from '../constants/Store'
import { isRunning } from '../constants/Validators'
import useCounter from '../hooks/useCounter'
import {projectlink} from '../routes/routes'

export default function TimerScreen() {
  const [online, setOnline] = useState(false)
  const [projects, setProjects] = useState([])
  const [timers, setTimers] = useState([])
  const [runningTimer, setRunningTimer] = useState('')
  const { count, setCount, start, stop } = useCounter(1000, false)

  useEffect(() => {
    gun.get('projects').map().on((projectValue, projectKey) => {
      console.log(projectValue)
      setProjects(projects => [...projects, [projectKey, projectValue]])
    }, { change: true })
    return () => gun.get('projects').off()
  }, [online])

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
  }, [online, setCount, start, stop]);


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
        {isRunning(runningTimer) ? `Running Timer ${runningTimer[1].project}/${runningTimer[0]}/ Count: ${count}` : ''}
      </h4>
      <Button variant="contained" color="primary" onClick={() => { if (isRunning(runningTimer)) finishTimer(runningTimer); stop() }}>Stop Timer</Button>
      <Grid>
        {sumProjectTimers(dayHeaders(timers.sort((a, b) => new Date(b[1].created) - new Date(a[1].created)))).map(day => {
          return (
            <Grid>
              <h2>{`${sayDay(day.title)}`}</h2>
              {day.data.map(item => projects.map(project => {
                if (item.status === 'running') return (null)
                if (project[0] === item.project) {
                  return (
                    <SpacingGrid values={[
                      <Link to={  projectlink(item.project)}>{project[1].name}</Link>,
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          if (isRunning(runningTimer)) { finishTimer(runningTimer); stop() };
                          createTimer(item.project)
                        }}>
                        {secondsToString(item.total)}
                      </Button>
                    ]} />
                  )
                }
                else return (null)
              })
              )}
            </Grid>
          )
        })}
      </Grid>
    </Grid >
  )
}