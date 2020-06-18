import React, { useState, useEffect, useRef } from 'react'
import useCounter from '../hooks/useCounter'
import { isRunning, isTimer } from '../constants/Validators'
import { elapsedTime, trimSoul } from '../constants/Functions'
import { finishTimer, createTimer, getProjects } from '../Data/Data'
import { projectEditlink, projectCreatelink, projectlink, timerRunninglink } from '../routes/routes'
import { useStyles } from '../themes/DefaultTheme'
import ProjectList from '../components/templates/ProjectList'
import { projectsHandler, runningHandler } from '../Data/Handlers'
import * as chain from '../Data/Chains'
import messenger from '../constants/Messenger'

const debug = false


export default function ProjectListScreen({ useParams, useHistory }) {
  const [online, setOnline] = useState(false)
  // const [renders, setRenders] = useState(0)
  const [projects, setProjects] = useState([])
  const running = useRef({ id: 'none', name: 'none', project: 'none' })
  const { count, setCount, start, stop } = useCounter(1000, false)
  const classes = useStyles();
  let history = useHistory()

  useEffect(() => {
    //TODO need browser count/running implementation here
    messenger.addListener("count", event => setCount(event))
    return () => messenger.removeAllListeners("count")
  }, [])

  useEffect(() => {
    messenger.addListener("projects", event => projectsHandler(event, { projects, setProjects, running }))
    messenger.addListener("running", event => runningHandler(event, { running: running }))
    getProjects()
    return () => {
      messenger.removeAllListeners("projects")
      messenger.removeAllListeners("running")
    }
  }, [online])

  const startTimer = (project) => {
    createTimer(project.id)
    history.push(timerRunninglink())
  }

  return (
    <ProjectList
      classes={classes}
      projects={projects}
      projectlink={projectlink}
      runningProject={running}
      runningTimer={running}
      startTimer={startTimer}
      headerButtonAction={() => history.push(projectCreatelink())}
      finishTimer={finishTimer}
      stop={stop}
      count={count}
    />
  )
}