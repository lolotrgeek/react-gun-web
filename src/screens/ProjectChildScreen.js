import React, { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import { newTimer, updateProject, updateTimer } from '../constants/Models'
import { trimSoul } from '../constants/Store'
import { isRunning } from '../constants/Functions'
import { gun } from '../constants/Data'
import useGlobalState from '../hooks/useGlobalState'


export default function ProjectChildScreen() {
  const { projectId, runningId } = useParams()
  const [online, setOnline] = useState(false)
  const [timers, setTimers] = useState([])
  const [edits, setEdits] = useState([])
  const globalState = useGlobalState()
  const setRunningTimer = timer => globalState.setItem(timer)
  const runningTimer = globalState.item 
  console.log('runningTimer', runningTimer)

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
    if (runningTimer && typeof runningTimer === 'object' && Object.keys(runningTimer).length === 2 && runningTimer.key && runningTimer.value) {
      let doneTimer = [runningTimer.key, runningTimer.value]
      doneTimer[1].status = 'done'
      updateTimer(doneTimer)
      let filteredTimers = timers.filter(timer => timer[0] !== doneTimer[0])
      setTimers(filteredTimers)
      gun.get('history').get('timers').get(projectId).get(doneTimer[0]).set(doneTimer[1])
      gun.get('timers').get(projectId).get(doneTimer[0]).put(doneTimer[1])
    }
    const timer = newTimer({ project: projectId })
    setRunningTimer(timer)
    gun.get('history').get('timers').get(projectId).get(timer[0]).set(timer[1])
    gun.get('timers').get(projectId).get(timer[0]).put(timer[1])
  }

  const stopTimer = (timer) => {
    if (timer && Array.isArray(timer) && timer.length === 2 && timer[1].status === 'running') {
      let doneTimer = timer
      doneTimer[1].status = 'done'
      updateTimer(doneTimer)
      let filteredTimers = timers.filter(timer => timer[0] !== doneTimer[0])
      setTimers(filteredTimers)
      setRunningTimer({})
      console.log('runningTimer', runningTimer)
      gun.get('history').get('timers').get(doneTimer[1].project).get(doneTimer[0]).set(doneTimer[1])
      gun.get('timers').get(doneTimer[1].project).get(doneTimer[0]).put(doneTimer[1])
    }
  }

  useEffect(() => {
    gun.get('timers').get(projectId).map().on((timerValue, timerKey) => {
      const timer = [timerKey, trimSoul(timerValue)]
      setTimers(timers => [...timers, timer])
      if (isRunning(timer)) setRunningTimer(timer)
    }, { change: true })
    return () => gun.get('timers').off()
  }, [online]);

  return (
    <div>
      <h2>Project {projectId}</h2>
      <h4>{runningTimer && typeof runningTimer === 'object' && Object.keys(runningTimer).length === 2 && runningTimer.key && runningTimer.value ? `Running Timer ${runningTimer.value.project}/ ${runningTimer.key}` : ''}</h4>
      <button type='button' onClick={() => runningTimer.key && runningTimer.value ? stopTimer([runningTimer.key, runningTimer.value]) : null}>Stop Timer</button>
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
                <Link to={`/timer/${projectId}/${timer[0]}/${runningTimer[0]}`}>
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