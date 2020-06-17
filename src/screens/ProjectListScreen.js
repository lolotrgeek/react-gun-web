import React, { useState, useEffect } from 'react'
import useCounter from '../hooks/useCounter'
import { isRunning, isTimer } from '../constants/Validators'
import { elapsedTime, trimSoul } from '../constants/Functions'
import { finishTimer, createTimer } from '../constants/Data'
import { projectEditlink, projectCreatelink, projectlink, timerRunninglink } from '../routes/routes'
import { useStyles } from '../themes/DefaultTheme'
import ProjectList from '../components/templates/ProjectList'
import { getProjects, getRunningTimer, getRunningProject } from '../constants/Effects'
import { gun } from '../constants/Store'
const debug = false


export default function ProjectListScreen({ useParams, useHistory }) {
  const [online, setOnline] = useState(false)
  // const [renders, setRenders] = useState(0)
  const [projects, setProjects] = useState([])
  const [runningTimer, setRunningTimer] = useState('')
  const [runningProject, setRunningProject] = useState('')
  const { count, setCount, start, stop } = useCounter(1000, false)
  const classes = useStyles();
  let history = useHistory()
  
  // useEffect(() => setRenders(render => render + 1))
  useEffect(() => getProjects({ setProjects }), [online])
  useEffect(() => getRunningTimer({ setCount, start, stop, setRunningTimer }), [online, setCount, start, stop])
  useEffect(() => getRunningProject({ setRunningProject, runningTimer }), [runningTimer])

  const startTimer = (project) => {
    createTimer(project.id)
    history.push(timerRunninglink())
  }

  return (
    <ProjectList
      classes={classes}
      projects={projects}
      projectlink={projectlink}
      runningProject={runningProject}
      runningTimer={runningTimer}
      startTimer={startTimer}
      headerButtonAction={() => history.push(projectCreatelink())}
      finishTimer={finishTimer}
      stop={stop}
      count={count}
    />
  )
}