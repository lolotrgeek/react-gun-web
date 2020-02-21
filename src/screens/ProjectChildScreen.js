import React, { useState, useEffect } from 'react'
import {Link,useParams} from "react-router-dom"
import { newTimer, updateProject } from '../constants/Models'
import { trimSoul } from '../constants/Store'
import {gun} from '../constants/Data'


export default function ProjectChildScreen () {
  const { id } = useParams()
  const [online, setOnline] = useState(false)
  const [timers, setTimers] = useState([])
  const [edits, setEdits] = useState([])

  const createProject = (project) => {
    const projectNew = updateProject(project)
    gun.get('projects').get(id).set(projectNew[1])
  }

  useEffect(() => {
    gun.get('projects').get(id).map().on((projectValue, projectGunKey) => {
      console.log(projectValue)
      setEdits(projects => [...projects, [id, trimSoul(projectValue), projectGunKey]])
    }, { change: true })

    return () => gun.get('projects').off()
  }, [online]);

  const createTimer = () => {
    const timer = newTimer({ project: id })
    gun.get('timers').get(id).get(timer[0]).set(timer[1])
  }

  useEffect(() => {
    gun.get('timers').get(id).map().once((timerId, timerKey) => {
      let values = []
      gun.get('timers').get(id).get(timerKey).map().on((timerValue, timerGunId) => {
        console.log(timerValue)
        values.push(trimSoul(timerValue))
      })
      setTimers(timers => [...timers, [timerKey, values[values.length - 1]]])
    }
      , { change: true })
    return () => gun.get('timers').off()
  }, [online]);


  return (
    <div>
      <h2>Project {id}</h2>
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
                  update[1].name =`${project[1].name} edited`
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
              <li key={timer[0]}><Link to={`/timer/${id},${timer[0]}`}>{`${JSON.stringify(timer[1])}`}</Link></li>
            )
          })}
        </ol></div>
    </div >
  )
}