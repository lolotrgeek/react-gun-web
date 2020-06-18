import React, { useEffect, useState, useRef } from 'react'
import useCounter from '../hooks/useCounter'
import { projectlink, projectsListLink, timerRunninglink, projectCreatelink } from '../routes/routes'
import { useStyles } from '../themes/DefaultTheme'
import Timeline from '../components/templates/Timeline'
import { getProjects, getRunningTimer, getRunningProject, getTimers, getDayTimers } from '../Data/Data'
import { projectsHandler, timersHandler, runningHandler } from '../Data/Handlers'
import messenger from '../constants/Messenger'

export default function TimelineScreen({ useParams, useHistory }) {
  const [online, setOnline] = useState(0)
  const [projects, setProjects] = useState([])
  const [timers, setTimers] = useState([])
  const running = useRef({ id: 'none', name: 'none', project: 'none' })
  const { count, setCount, start, stop } = useCounter(1000, false)
  const classes = useStyles()
  const history = useHistory()

  useEffect(() => {
    //TODO need browser count/running implementation here
    messenger.addListener("count", event => setCount(event))
    return () => messenger.removeAllListeners("count")
  }, [])

  useEffect(() => {
    messenger.addListener("projects", event => projectsHandler(event, { projects, setProjects, running }))
    messenger.addListener("running", event => runningHandler(event, { running: running }))
    messenger.addListener("timers", event => timersHandler(event, { timers, setTimers, running }))
    getProjects()
    getTimers()
    return () => {
      messenger.removeAllListeners("projects")
      messenger.removeAllListeners("timers")
      messenger.removeAllListeners("running")
    }
  }, [online])

  const startTimer = (projectId) => {
    return start(projectId)
  }

  const finishTimer = (timer) => {
    return stop(timer)
  }

  return (
    <Timeline
      classes={classes}
      projects={projects}
      timers={timers}
      headerButtonAction={() => projects && projects.length > 0 ? history.push(projectsListLink()) : history.push(projectCreatelink())}
      runningProject={running}
      runningTimer={running}
      count={count}
      stop={stop}
      projectlink={projectlink}
      finishTimer={finishTimer}
      startTimer={startTimer}
      countButtonAction={() => history.push(timerRunninglink())}
    />
  )
}