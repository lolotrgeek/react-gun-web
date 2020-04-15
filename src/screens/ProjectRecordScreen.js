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
import { getProject, getTimersProject, getRunningTimer, getRunningProject } from '../constants/Effects'

const debug = true


export default function ProjectRecordScreen({ useParams, useHistory }) {
  const { projectId } = useParams()
  const [online, setOnline] = useState(false)
  const [project, setProject] = useState([])
  const [timers, setTimers] = useState([])
  const [current, setCurrent] = useState([])
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

  useEffect(() => getProject({projectId, setProject}), [online]);
  useEffect(() => getTimersProject({ projectId, setCurrent, current, setTimers}), [online]);
  useEffect(() => getRunningTimer({setCount, start, stop, setRunningTimer}), [online]);
  useEffect(() => getRunningProject({runningTimer, setRunningProject}), [runningTimer])

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