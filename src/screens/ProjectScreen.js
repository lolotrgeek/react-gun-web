import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"

import { trimSoul } from '../constants/Store'
import { gun, createProject } from '../constants/Data'
import SpacingGrid from '../components/Grid'

export default function ProjecScreen() {
  const [online, setOnline] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const [projects, setProjects] = useState([])

  useEffect(() => {
    gun.get('projects').map().on((projectValue, projectKey) => {
      console.log(projectValue)
      setProjects(projects => [...projects, [projectKey, projectValue]])
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
        <button type='button' onClick={() => name.length > 0 && color.length > 0 ? createProject(name, color) : alert('Need name and color')}>Submit</button>
      </div>
      <div>
        <h3>Project List</h3>

        {projects.map(project => {
          return (
            <div>
              <Link to={`/project/${project[0]}`}>{`${project[0]} ${typeof project[1] === 'object' ? project[1].name : ''}`}</Link>
              <br />
            </div>
          )
        })}
      </div>
    </div>
  )
}