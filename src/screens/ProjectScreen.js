import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { newProject } from '../constants/Models'
import { trimSoul } from '../constants/Store'
import {gun} from '../constants/Data'


export default function ProjecScreen() {
  const [online, setOnline] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const [projects, setProjects] = useState([])

  const createProject = () => {
    const project = newProject(name, color)
    gun.get('projects').get(project[0]).set(project[1])
  }

  useEffect(() => {
    gun.get('projects').map().on((projectId, projectKey) => {
      const values = []
      gun.get('projects').get(projectKey).map().on((projectValue, projectGunKey) => {
        console.log(projectValue)
        values.push(trimSoul(projectValue))
      })
      setProjects(projects => [...projects, [projectKey, values[values.length - 1]]])
    }
      , { change: true })
    return () => gun.get('projects').off()
  }, [online])

  return (
    <div>
      <h2>Projects</h2>
      <div>
        <h3>New Project</h3>
        <form>
          <label>Name : <input type="text" name="name" onChange={event => setName(event.target.value)} /></label>
          <br />
          <label>Color : <input type="text" name="color" onChange={event => setColor(event.target.value)} /></label>
          <br />
        </form>
        <button type='button' onClick={() => name.length > 0 && color.length > 0 ? createProject() : alert('Need name and color')}>Submit</button>
      </div>
      <div>
        <h3>Project List</h3>
        <ul>
          {projects.map(project => {
            return (
              <li key={project[0]}><Link to={`/project/${project[0]}`}>{`${project[0]} ${project[1].name}`}</Link></li>
            )
          })}
        </ul></div>
    </div>
  )
}