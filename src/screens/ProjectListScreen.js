import React, { useState, useEffect } from 'react'
import useCounter from '../hooks/useCounter'
import { isRunning, isTimer } from '../constants/Validators'
import { elapsedTime , trimSoul} from '../constants/Functions'
import { gun, finishTimer, createTimer } from '../constants/Data'
import { projectEditlink, projectCreatelink, projectlink, timerRunninglink } from '../routes/routes'
import { useStyles } from '../themes/DefaultTheme'
import ProjectList from '../components/templates/ProjectList'

export default function ProjectListScreen({useParams, useHistory}) {
  const [online, setOnline] = useState(false)
  const [projects, setProjects] = useState([])
  const [runningTimer, setRunningTimer] = useState('')
  const [runningProject, setRunningProject] = useState('')
  const { count, setCount, start, stop } = useCounter(1000, false)
  const classes = useStyles();
  let history = useHistory()


  useEffect(() => {
    gun.get('projects').map().on((projectValue, projectKey) => {
      console.log(projectValue)
      if (projectValue && projectValue.status !== 'deleted') {
        setProjects(projects => [...projects, [projectKey, projectValue]])
      }
    }
      , { change: true })
    return () => gun.get('projects').off()
  }, [online])

  useEffect(() => {
    gun.get('running').get('timer').on((runningTimerGun, runningTimerKeyGun) => {
      const runningTimerFound = trimSoul(JSON.parse(runningTimerGun))
      if (isRunning(runningTimerFound)) {
        setRunningTimer(runningTimerFound)
        console.log('runningTimerFound', runningTimerFound)
        setCount(elapsedTime(runningTimerFound[1].started))
        start()
      }
      else if (!runningTimerGun) {
        console.log('running Timer not Found')
        stop()
        setRunningTimer({})
      }
    }, { change: true })

    return () => gun.get('running').off()
  }, [online, setCount, start, stop]);

  useEffect(() => {
    if (runningTimer[1] && isTimer(runningTimer)) {
      gun.get('projects').get(runningTimer[1].project).on((projectValue, projectKey) => {
        console.log(projectValue)
        if (projectValue && projectValue.status !== 'deleted') {
          setRunningProject([projectKey, projectValue])
        }
      }, { change: true })
      return () => gun.get('projects').off()
    }
  }, [runningTimer])

  const startTimer = (project) => {
    createTimer(project[0])
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