import React, { useEffect, useState } from 'react'
import { createTimer, finishTimer, gun } from '../constants/Data'
import { elapsedTime, trimSoul } from '../constants/Functions'
import { isRunning, isTimer } from '../constants/Validators'
import useCounter from '../hooks/useCounter'
import { projectlink, projectsListLink, timerRunninglink, projectCreatelink } from '../routes/routes'
import { useStyles } from '../themes/DefaultTheme'
import Timeline from '../components/templates/Timeline'

const debug = true


export default function TimelineScreen({useParams, useHistory}) {
  const [online, setOnline] = useState(false)
  const [projects, setProjects] = useState([])
  const [timers, setTimers] = useState([])
  const [runningTimer, setRunningTimer] = useState('')
  const [runningProject, setRunningProject] = useState('')
  const { count, setCount, start, stop } = useCounter(1000, false)
  const classes = useStyles()
  const history = useHistory()

  useEffect(() => {
    gun.get('projects').map().on((projectValue, projectKey) => {
      debug && console.log(projectValue)
      if (projectValue && projectValue.status !== 'deleted') {
        setProjects(projects => [...projects, [projectKey, projectValue]])
      }
    }, { change: true })
    return () => gun.get('projects').off()
  }, [online])

  useEffect(() => {
    gun.get('running').get('timer').on((runningTimerGun, runningTimerKeyGun) => {
      const runningTimerFound = trimSoul(JSON.parse(runningTimerGun))
      if (isRunning(runningTimerFound)) {
        setRunningTimer(runningTimerFound)
        debug && console.log('runningTimerFound', runningTimerFound)
        setCount(elapsedTime(runningTimerFound[1].started))
        start()
      }
      else if (!runningTimerGun) {
        debug && console.log('running Timer not Found')
        stop()
        setRunningTimer({})
      }
    }, { change: true })

    return () => gun.get('running').off()
  }, [online, setCount, start, stop])

  useEffect(() => {
    if (runningTimer[1] && isTimer(runningTimer)) {
      gun.get('projects').get(runningTimer[1].project).on((projectValue, projectKey) => {
        debug && console.log(projectValue)
        if (projectValue && projectValue.status !== 'deleted') {
          setRunningProject([projectKey, projectValue])
        }
      }, { change: true })
      return () => gun.get('projects').off()
    }
  }, [runningTimer])

  useEffect(() => {
    let currentTimers = []
    gun.get('timers').map().on((timerGunId, projectKey) => {
      gun.get('timers').get(projectKey).map().on((timerValue, timerKey) => {
        if (timerValue) {
          const foundTimer = [timerKey, trimSoul(timerValue)]
          if (foundTimer[1].status === 'done') {
            let check = currentTimers.some(id => id === foundTimer[0])
            if (!check) {
              debug && console.log('Adding Timer', foundTimer)
              setTimers(timers => [...timers, foundTimer])
            }
            currentTimers.push(foundTimer[0])
          }
          else if (foundTimer[1].status === 'running') {
            gun.get('running').get('timer').put(JSON.stringify(foundTimer))
          }
        }
      })
    }, { change: true })
    return () => gun.get('timers').off()
  }, [online]);

  const startTimer = (project) => {
    createTimer(project[0])
    history.push(timerRunninglink())
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