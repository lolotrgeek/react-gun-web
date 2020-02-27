import React, { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import { newTimer, updateProject, updateTimer } from '../constants/Models'
import { trimSoul } from '../constants/Store'
import { isRunning, elapsedTime } from '../constants/Functions'
import { gun } from '../constants/Data'
import useGlobalState from '../hooks/useGlobalState'
import useCounter from '../hooks/useCounter'


export default function ProjectChildScreen() {
  const { projectId } = useParams()
  const [online, setOnline] = useState(false)
  const [timers, setTimers] = useState([])
  const [edits, setEdits] = useState([])
  // const globalState = useGlobalState()
  // const setRunningTimer = timer => globalState.setItem(timer)
  // const runningTimer = globalState.item
  const [runningTimer, setRunningTimer] = useState('')

  const { count, setCount, start, stop } = useCounter(1000, false)

  useEffect(() => {
    let filteredTimers = timers.filter(timer => timer[0] !== runningTimer[0])
    setTimers(filteredTimers)
  }, [runningTimer])

  const createProject = (project) => {
    const projectNew = updateProject(project)
    gun.get('history').get('projects').get(projectId).set(projectNew[1])
    gun.get('projects').get(projectId).set(projectNew[1])
  }

  useEffect(() => {
    gun.get('history').get('projects').get(projectId).map().on((projectValue, projectGunKey) => {
      setEdits(projects => [...projects, [projectId, trimSoul(projectValue), projectGunKey]])
    }, { change: true })
    return () => gun.get('projects').off()
  }, [online]);

  const createTimer = () => {
    // if (runningTimer && typeof runningTimer === 'object' && Object.keys(runningTimer).length === 2 && runningTimer.key && runningTimer.value) {
    if (runningTimer && Array.isArray(runningTimer) && runningTimer.length === 2) {
      stop()
      let doneTimer = runningTimer
      doneTimer[1].status = 'done'
      updateTimer(doneTimer)
      gun.get('history').get('timers').get(projectId).get(doneTimer[0]).set(doneTimer[1])
      gun.get('timers').get(projectId).get(doneTimer[0]).put(doneTimer[1])
      gun.get('timers').get('running').put(JSON.stringify(doneTimer))
    }
    const timer = newTimer({ project: projectId })
    gun.get('timers').get('running').put(JSON.stringify(timer))
    gun.get('history').get('timers').get(projectId).get(timer[0]).set(timer[1])
    gun.get('timers').get(projectId).get(timer[0]).put(timer[1])
  }

  const stopTimer = (timer) => {
    if (timer && Array.isArray(timer) && timer.length === 2 && timer[1].status === 'running') {
      stop()
      let doneTimer = timer
      doneTimer[1].status = 'done'
      updateTimer(doneTimer)
      // setRunningTimer({})
      // setTimers(timers => [...timers, doneTimer])
      gun.get('history').get('timers').get(doneTimer[1].project).get(doneTimer[0]).set(doneTimer[1])
      gun.get('timers').get(doneTimer[1].project).get(doneTimer[0]).put(doneTimer[1])
      gun.get('timers').get('running').put(JSON.stringify(doneTimer))
    }
  }

  useEffect(() => {
    gun.get('timers').get('running').on((runningTimerGun, runningTimerKeyGun) => {
      const runningTimerFound = trimSoul(JSON.parse(runningTimerGun))
      if (runningTimerFound && Array.isArray(runningTimerFound) && runningTimerFound.length === 2 && runningTimerFound[1].status === 'running') {
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
      if (runningTimerFound && Array.isArray(runningTimerFound) && runningTimerFound.length === 2 && runningTimerFound[1].status === 'done') {
        console.log('Timer just finished', runningTimerFound)
        stop()
        setRunningTimer({})
        setTimers(timers => [...timers, runningTimerFound])
      }
    }, { change: true })
    gun.get('timers').get(projectId).map().once((timerValue, timerKey) => {
      const foundTimer = [timerKey, trimSoul(timerValue)]
      // const filteredTimers = []
      if (!runningTimer && !Array.isArray(runningTimer) && foundTimer[1].status === 'done') {
        console.log('Adding Timer', foundTimer)
        setTimers(timers => [...timers, foundTimer])
      }
      else setRunningTimer(foundTimer)
    }, { change: false })
    return () => gun.get('timers').off()
  }, [online]);

  return (
    <div>
      <h2>Project {projectId}</h2>
      <h4>
        {runningTimer && Array.isArray(runningTimer) && runningTimer.length === 2 ?
          `Running Timer ${runningTimer[1].project}/${runningTimer[0]}/ Count: ${count}` : ''
        }
      </h4>
      <button type='button' onClick={() => runningTimer && Array.isArray(runningTimer) && runningTimer.length === 2 ? stopTimer(runningTimer) : null}>Stop Timer</button>
      <button type='button' onClick={() => createTimer()}>New Timer</button>
      <h3>Edit History</h3>
      <div>
        <ol>
          {edits.map(project => {
            return (
              <li key={project[2]}>
                <Link to={`/project/${project[0]}`}>{`${JSON.stringify(project[1])}`}</Link>
                <button type='button' onClick={() => {
                  let update = project
                  update[1].color = `#${Math.random()}`
                  update[1].name = `${project[1].name} edited`
                  console.log(update)
                  createProject(update)
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
                    <li>{`${timer[1].created}`}</li>
                    <li>{`${timer[1].ended}`}</li>
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