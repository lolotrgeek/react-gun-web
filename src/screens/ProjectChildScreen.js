import React, { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { elapsedTime } from '../constants/Functions'
import useCounter from '../hooks/useCounter'
import { gun, createProject, stopTimer, createTimer } from '../constants/Data'
import { isRunning } from '../constants/Validators'


export default function ProjectChildScreen() {
  const { projectId } = useParams()
  const [online, setOnline] = useState(false)
  const [timers, setTimers] = useState([])
  const [edits, setEdits] = useState([])
  const [runningTimer, setRunningTimer] = useState('')
  const { count, setCount, start, stop } = useCounter(1000, false)

  useEffect(() => {
    let filteredTimers = timers.filter(timer => timer[0] !== runningTimer[0])
    setTimers(filteredTimers)
  }, [runningTimer])

  useEffect(() => {
    gun.get('history').get('projects').get(projectId).map().on((projectValue, projectGunKey) => {
      setEdits(projects => [...projects, [projectId, trimSoul(projectValue), projectGunKey]])
    }, { change: true })
    return () => gun.get('history').off()
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
    <div>
      <h2>Project {projectId}</h2>
      <h4>
        {runningTimer && Array.isArray(runningTimer) && runningTimer.length === 2 ?
          `Running Timer ${runningTimer[1].project}/${runningTimer[0]}/ Count: ${count}` : ''
        }
      </h4>
      <button type='button' onClick={() => { if (isRunning(runningTimer)) {stopTimer(runningTimer); stop() } }}>Stop Timer</button>
      <button type='button' onClick={() => {
        if (isRunning(runningTimer)) { stop(); stopTimer(runningTimer) }
        createTimer(projectId)
      }}>New Timer</button>
      <h3>Edit History</h3>
      <div>
        <ol>
          {edits.map(project => {
            return (
              <li key={project[2]}>
                <Link to={`/project/${project[0]}`}>{`${JSON.stringify(project[1].name)}`}</Link>
                <button type='button' onClick={() => {
                  let update = project
                  update[1].color = `#${Math.random()}`
                  update[1].name = `${project[1].name} edited`
                  console.log(update)
                  createProject(update, projectId)
                }}>Edit project</button>
              </li>
            )
          })}
        </ol></div>
      <h3>Timers</h3>
      <div>
        <ol>
          {timers.map(timer => {
            return (
              <li key={timer[0]}>
                <Link to={`/timer/${projectId}/${timer[0]}}`}>
                  {`${timer[0]}`}
                  <ul>
                    {/* <li>{`${timer[1].created}`}</li>
                    <li>{`${timer[1].ended}`}</li> */}
                    <li>{`${timer[1].status}`}</li>
                  </ul>

                </Link>
              </li>
            )
          })}
        </ol></div>
    </div >
  )
}