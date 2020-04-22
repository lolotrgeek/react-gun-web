import React, { useEffect, useState, useRef } from 'react'
import useCounter from '../hooks/useCounter'
import { projectlink, projectsListLink, timerRunninglink, projectCreatelink } from '../routes/routes'
import { useStyles } from '../themes/DefaultTheme'
import Timeline from '../components/templates/Timeline'
import { getProjects, getRunningTimer, getRunningProject, getTimers, updateState } from '../constants/Effects'

export default function TimelineScreen({ useParams, useHistory }) {
  const [online, setOnline] = useState(0)
  const [projects, setProjects] = useState([])
  const [timers, setTimers] = useState([])
  const [current, setCurrent] = useState([])
  const [runningTimer, setRunningTimer] = useState('')
  const [runningProject, setRunningProject] = useState('')
  const { count, setCount, start, stop } = useCounter(1000, false)
  const classes = useStyles()
  const history = useHistory()

  // const countRef = useRef(online);
  // countRef.current = online;
  // const getCountTimeout = () => {
  //   let timer = setInterval(() => {
  //     setOnline(countRef.current)
  //     console.log(countRef.current)
  //   }, 2000);
  //   return () => clearInterval(timer)
  // };
  // useEffect(() => getCountTimeout(), [] )

  useEffect(() => getProjects({ setProjects }), [online])
  useEffect(() => getRunningTimer({ setCount, start, stop, setRunningTimer }), [online])
  useEffect(() => getRunningProject({ setRunningProject, runningTimer }), [runningTimer])
  useEffect(() => getTimers({ current, timers, setCurrent, setTimers }), [online])

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
      runningProject={runningProject}
      runningTimer={runningTimer}
      count={count}
      stop={stop}
      projectlink={projectlink}
      finishTimer={finishTimer}
      startTimer={startTimer}
      countButtonAction={() => history.push(timerRunninglink())}
    />
  )
}