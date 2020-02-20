import React, { useState, useEffect } from 'react'
import { useAsyncRetry } from 'react-use';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom"
import { storeItem, multiGet, getAll, getItem } from '../constants/Store'
import { newProject, newTimer } from '../constants/Models'

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
  useAsyncRetry(async () => {
    const store = await storeItem(project)
    return store
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
      <div> {JSON.stringify(project)} </div>
    </div>
  )
}

function Projects() {
  const state = useAsyncRetry(async () => {
    const result = await getAll(value => value.type === 'project' ? true : false)
    return result
  }, [])
  return (
    <div>
      <h2>Projects</h2>
      <div>
        {state.loading
          ? <div>Loading...</div>
          : state.error
            ? <div>Error: {state.error.message}</div>
            : <div>Value: <ul>{
              state.value.map(item => {
                return (
                  <li><Link to={`/project/${item[0]}`}>{item[1].name}</Link></li>
                )
              })
            }</ul></div>
        }
      </div>
    </div>
  )
}

function Timers() {
  const state = useAsyncRetry(async () => {
    const result = await getAll(value => value.type === 'timer' ? true : false)
    return result
  }, [])
  return (
    <div>
      <h2>Timers</h2>
      <div>
        {state.loading
          ? <div>Loading...</div>
          : state.error
            ? <div>Error: {state.error.message}</div>
            : <div>Value: {JSON.stringify(state.value)}</div>
        }
      </div>
    </div>
  )
}

function ProjectsChild() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { id } = useParams();
  const [newtimers, setNewtimers] = useState([])
  const state = useAsyncRetry(async () => {
    const timerEntries = await getAll(value => value.type === 'timer' ? true : false)
    console.log('timerEntries', timerEntries)
    const projectTimers = timerEntries.filter(timer => timer[1].project === id ? true : false)
    console.log('projectTimers', projectTimers)
    return projectTimers
  }, [])

  return (
    <div>
      <h2>ID: {id}</h2>
      <button type='button' onClick={async () => {
        let timer = newTimer({ project: id })
        setNewtimers([...newtimers, timer])
        console.log(newtimers)
        await storeItem(timer)
      }}>New Timer</button>
      <h3>Timers</h3>
      <div>
        {state.loading
          ? <div>Loading...</div>
          : state.error
            ? <div>Error: {state.error.message}</div>
            : <div>Value: <ul>{
              state.value.map(timer => {
                return (
                  <li><Link to={`/timer/${timer[0]}`}>{`${timer[1].status}, ${timer[1].created}`}</Link></li>
                )
              })
            }
              {newtimers.map(timer => {
                return (
                  timer ? <li><Link to={`/timer/${timer[0]}`}>{`${timer[1].status}, ${timer[1].created}`}</Link></li> : null
                )
              })}
            </ul></div>
        }
      </div>
    </div>
  );
}
function TimersChild() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { id } = useParams();
  const state = useAsyncRetry(async () => {
    const timer = await getItem(id)
    return timer
  }, [])


  return (
    <div>
      <h2>Timer : {id}</h2>
      <div>
        {state.loading
          ? <div>Loading...</div>
          : state.error
            ? <div>Error: {state.error.message}</div>
            : <div>Value: {JSON.stringify(state.value)}</div>
        }
      </div>
    </div>
  )
}
