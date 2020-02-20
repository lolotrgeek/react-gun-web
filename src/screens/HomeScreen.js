import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom"
import { newProject, newTimer } from '../constants/Models'

import Gun from 'gun/gun'

const port = '8765'
const address = 'localhost'
const peers = [`http://${address}:${port}/gun`]

const gun = new Gun({
  peers: peers,
})

export default function HomeScreen() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/Projects">Projects</Link>
          </li>
          <li>
            <Link to="/Timers">Timers</Link>
          </li>
        </ul>

        <hr />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/projects">
            <Projects />
          </Route>
          <Route path="/timers">
            <Timers />
          </Route>
        </Switch>
      </div>
    </Router >
  );
}

function Home() {
  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const [project, setProject] = useState([])

  useEffect(() => {
    gun.get('projects').get(project[0]).set(project[1], ack => ack.err ? ack.err : project)
  }, [project])

  return (
    <div>
      <h2>Home</h2>
      <h3>New Project</h3>
      <form>
        <label>Name : <input type="text" name="name" onChange={event => setName(event.target.value)} /></label>
        <br />
        <label>Color : <input type="text" name="color" onChange={event => setColor(event.target.value)} /></label>
        <br />
      </form>
      <button type='button' onClick={() => name.length > 0 && color.length > 0 ? setProject(newProject(name, color)) : alert('Need name and color')}>Submit</button>
    </div>
  )
}

function Projects() {
  const [online, setOnline] = useState(false)
  const [projects, setProjects] = useState([])

  // useEffect(() => {
  //   gun.get('projects').once((data, key) => setOnline(true))
  //   console.log()
  //   return () => gun.get('projects').off()
  // }, []);

  useEffect(() => {
    gun.get('projects').map().on((data, key) => setProjects(projects => [...projects, [key, data]])
      , { change: true })
    return () => gun.get('projects').off()
  }, [online]);

  return (
    <div>
      <h2>Projects</h2>
      <div>Value: <ul>
        {projects.map(item => {
          return (
            <li>{item[0]}</li>
          )
        })}
      </ul></div>
    </div>
  )
}

function Timers() {

  return (
    <div>
      <h2>Timers</h2>

    </div>
  )
}
