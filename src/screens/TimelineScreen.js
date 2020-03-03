import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { elapsedTime, dayHeaders, sumProjectTimers, secondsToString, sayDay } from '../constants/Functions'
import { isRunning } from '../constants/Validators'
import { gun, stopTimer, createTimer } from '../constants/Data'
import useCounter from '../hooks/useCounter'
import SpacingGrid from '../components/Grid'

export default function TimerScreen() {
  const [online, setOnline] = useState(false)
  const [projects, setProjects] = useState([])
  const [timers, setTimers] = useState([])
  const [daysWithTimer, setDaysWithTimer] = useState([]); // disply the timers within each day
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
        {isRunning(runningTimer) ? `Running Timer ${runningTimer[1].project}/${runningTimer[0]}/ Count: ${count}` : ''}
      </h4>
      <button type='button' onClick={() => { if (isRunning(runningTimer)) stopTimer(runningTimer); stop() }}>Stop Timer</button>
      <div>
        {sumProjectTimers(dayHeaders(timers.sort((a, b) => new Date(b[1].created) - new Date(a[1].created)))).map(day => {
          return (
            <div>
              <h2>{`${sayDay(day.title)}`}</h2>
              {day.data.map(item => projects.map(project => {
                if (item.status === 'running') return (null)
                if (project[0] === item.project) {
                  return (
                    <div>
                      <SpacingGrid values={[
                        <Link to={`/project/${item.project}`}>{project[1].name}</Link>,
                        secondsToString(item.total),
                        <button type='button' onClick={() => { if (isRunning(runningTimer)) { stopTimer(runningTimer); stop() }; createTimer(item.project) }}>New Timer</button>
                      ]}></SpacingGrid>
                    </div>
                  )
                }
                else return (null)
              })
              )}
            </div>
          )
        })}
      </div>
    </div >
  )
}