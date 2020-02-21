import React, { useState, useEffect, useRef } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom"
import { newProject, newTimer, updateTimer, updateProject } from '../constants/Models'
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
              <li key={timer[0]}>
                <Link to={`/timer/${timer[0]}`}>{`${JSON.stringify(timer[1])}`}</Link>
              </li>
              // <li key={project[0]}><Link to={`/timer/${timer[0]}`}>{`${timer[1].status}, ${timer[1].created}`}</Link></li>
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

function TimersChild() {
  const { id } = useParams()
  const [online, setOnline] = useState(false)
  const [timers, setTimers] = useState([])

  const idObject = useRef(id.split(','))
  const projectId = useRef(idObject.current[0])
  const timerId = useRef(idObject.current[1])

  const createTimer = (timer) => {
    const timerNew = updateTimer(timer)
    gun.get('timers').get(projectId.current).get(timerId.current).set(timerNew[1])
  }

  useEffect(() => {
    gun.get('timers').get(projectId.current).get(timerId.current).map().on((timerValue, timerGunId) => {
      console.log(timerValue)
      setTimers(timers => [...timers, [timerId, trimSoul(timerValue), timerGunId]])
    }
      , { change: true })
    return () => gun.get('timers').off()
  }, [online]);


  return (
    <div>
      <h2>Timer History {id} </h2>
      <div>
        <ol>
          {timers.map(timer => {
            return (
              <li key={timer[2]}>
                <Link to={`/timer/${timer[0]}`}>{`${JSON.stringify(timer[1])}`}</Link>
                <button type='button' onClick={() => createTimer(timer)}>Stop Timer</button>
              </li>
            )
          })}
        </ol></div>
    </div >
  )
}
