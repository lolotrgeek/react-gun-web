import React, { useEffect, useState } from 'react'
import { createTimer, finishTimer } from '../constants/Data'
import useCounter from '../hooks/useCounter'
import { projectlink, projectsListLink, timerRunninglink, projectCreatelink } from '../routes/routes'
import { useStyles } from '../themes/DefaultTheme'
import Timeline from '../components/templates/Timeline'
import { getProjects, getRunningTimer, getRunningProject, getTimers } from '../constants/Effects'

export default function TimelineScreen({ useParams, useHistory }) {
  const [online, setOnline] = useState(false)
  const [projects, setProjects] = useState([])
  const [timers, setTimers] = useState([])
  const [current, setCurrent] = useState([])
  const [runningTimer, setRunningTimer] = useState('')
  const [runningProject, setRunningProject] = useState('')
  const { count, setCount, start, stop } = useCounter(1000, false)
  const classes = useStyles()
  const history = useHistory()

  useEffect(() => getProjects({ setProjects }), [online])
  useEffect(() => getRunningTimer({ setCount, start, stop, setRunningTimer }), [online])
  useEffect(() => getRunningProject({ setRunningProject, runningTimer }), [runningTimer])
  useEffect(() => getTimers({ current, setCurrent, setTimers }), [online]);

  const startTimer = (projectId) => {
    return createTimer(projectId) ? history.push(timerRunninglink()) : projectId
  }

  return (
    <Timeline
      classes={classes}
      projects={projects}
      timers={timers}
      headerButtonAction={() => projects && projects.length > 0 ? history.push(projectsListLink()) : history.push(projectCreatelink())}
      runningProject={runningProject}
      runningTimer={runningTimer}
      count={count}
      stop={stop}
      projectlink={projectlink}
      finishTimer={finishTimer}
      createTimer={createTimer}
      startTimer={startTimer}
      countButtonAction={() => history.push(timerRunninglink())}
    />
  )
}