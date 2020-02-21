import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom"
import { newProject, newTimer } from '../constants/Models'
import { trimSoul } from '../constants/Store'

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
          <Route path="/timer/:id" children={<TimersChild />} />
          <Route path="/project/:id" children={<ProjectsChild />} />
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

  useEffect(() => {
    gun.get('projects').map().on((data, key) => setProjects(projects => [...projects, [key, data]])
      , { change: true })
    return () => gun.get('projects').off()
  }, [online])

  return (
    <div>
      <h2>Projects</h2>
      <div>Value: <ul>
        {projects.map(project => {
          return (
            <li><Link to={`/project/${project[0]}`}>{project[0]}</Link></li>
          )
        })}
      </ul></div>
    </div>
  )
}


function Timers() {
  const [online, setOnline] = useState(false)
  const [timers, setTimers] = useState([])

  useEffect(() => {
    gun.get('timers').map().on((timerId, projectKey) => {
      gun.get('timers').get(projectKey).map().on((timerId, timerKey) => {
        gun.get('timers').get(projectKey).get(timerKey).map().on((timerValue, timerGunId) => {
          console.log(timerValue)
          setTimers(timers => [...timers, [timerKey, trimSoul(timerValue)]])
        })
      })
    }
      , { change: true })
    return () => gun.get('timers').off()
  }, [online]);

  return (
    <div>
      <h2>Timers</h2>
      <div>
        <ol>
          {timers.map(timer => {
            return (
              <li><Link to={`/timer/${timer[0]}`}>{`${JSON.stringify(timer[1])}`}</Link></li>
              // <li><Link to={`/timer/${timer[0]}`}>{`${timer[1].status}, ${timer[1].created}`}</Link></li>
            )
          })}
        </ol></div>
    </div >
  )
}

function ProjectsChild() {
  const { id } = useParams()
  const [online, setOnline] = useState(false)
  const [timers, setTimers] = useState([])

  const createTimer = () => {
    const timer = newTimer({ project: id })
    gun.get('timers').get(id).get(timer[0]).set(timer[1])
    // setTimers(timers => [...timers, timer])
  }

  useEffect(() => {
    gun.get('timers').get(id).map().once((timerId, timerKey) => {
      gun.get('timers').get(id).get(timerKey).map().on((timerValue, timerGunId) => {
        console.log(timerValue)
        setTimers(timers => [...timers, [timerKey, trimSoul(timerValue)]])
      })
    }
      , { change: true })
    return () => gun.get('timers').off()
  }, [online]);


  return (
    <div>
      <h2>Project {id}</h2>
      <button type='button' onClick={() => createTimer()}>New Timer</button>
      <h3>Timers</h3>
      <div>
        <ol>
          {timers.map(timer => {
            return (
              <li><Link to={`/timer/${timer[0]}`}>{`${JSON.stringify(timer[1])}`}</Link></li>
              // <li><Link to={`/timer/${timer[0]}`}>{`${timer[1].status}, ${timer[1].created}`}</Link></li>
            )
          })}
        </ol></div>
    </div >
  )
}

function TimersChild() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.

  return (
    <div>
      <h2>Timer </h2>
      <div>

      </div>
    </div>
  )
}
