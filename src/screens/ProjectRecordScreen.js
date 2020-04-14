import React, { useState, useEffect, useContext } from 'react'
import { elapsedTime, trimSoul } from '../constants/Functions'
import useCounter from '../hooks/useCounter'
import { gun, finishTimer, createTimer, deleteProject } from '../constants/Data'
import { isRunning, isTimer } from '../constants/Validators'
import { projectsListLink, projectEditlink, projectHistorylink, timerlink, timerRunninglink, timerTrashlink } from '../routes/routes'
import { useAlert } from '../hooks/useAlert'
import { PopupContext } from '../contexts/PopupContext'
import { useStyles } from '../themes/DefaultTheme'
import ProjectRecord from '../components/templates/ProjectRecord'

const debug = false


export default function ProjectRecordScreen({useParams, useHistory}) {
  const { projectId } = useParams()
  const [online, setOnline] = useState(false)
  const [project, setProject] = useState([])
  const [timers, setTimers] = useState([])
  const [deleted, setDeleted] = useState(false)
  const [alerted, setAlert] = useState([])
  const [runningTimer, setRunningTimer] = useState('')
  const [runningProject, setRunningProject] = useState('')
  const { count, setCount, start, stop } = useCounter(1000, false)
  const classes = useStyles();
  const alert = useAlert()
  let history = useHistory()
  let { state, dispatch } = useContext(PopupContext)


  useEffect(() => {
    if (alerted && alerted.length > 0) {
      alert.show(alerted[1], {
        type: alerted[0]
      })
    }
    return () => alerted
  }, [alerted])

  useEffect(() => {
    let filteredTimers = timers.filter(timer => timer[0] !== runningTimer[0])
    setTimers(filteredTimers)
  }, [runningTimer])

  useEffect(() => {
    gun.get('projects').get(projectId).on((projectValue, projectGunKey) => {
      setProject([projectId, trimSoul(projectValue)])
    }, { change: true })
    return () => gun.get('projects').off()
  }, [online]);

  useEffect(() => {
    let currentTimers = []
    gun.get('timers').get(projectId).map().on((timerValue, timerKey) => {
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
    }, { change: true })

    return () => gun.get('timers').off()
  }, [online]);

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
  }, [online]);

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

  const removeProject = () => {
    deleteProject(project)
    setAlert(['Success', 'Timer Deleted!'])
    closePopup()
    history.push((projectsListLink()))
  }

  const openPopup = () => dispatch({ type: "open" });
  const closePopup = () => dispatch({ type: "close" });

  const startTimer = (project) => {
    createTimer(project[0])
    history.push(timerRunninglink())
  }

  return (
    <ProjectRecord 
      classes={classes}
      project={project}
      timers={timers}
      runningProject={runningProject}
      runningTimer={runningTimer}
      count={count}
      stop={stop}
      timerlink={timerlink}
      startTimer={startTimer}
      finishTimer={finishTimer}
      popupAccept={closePopup}
      popupReject={removeProject}
      sideMenuOptions={[
          { name: 'edit', action: () => history.push(projectEditlink(projectId)) },
          { name: 'history', action: () => history.push(projectHistorylink(projectId)) },
          { name: 'delete', action: () => openPopup() },
          { name: 'trash', action: () => history.push(timerTrashlink(projectId)) }
        ]}
      />
  )
}