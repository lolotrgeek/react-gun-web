import React, { useState, useEffect, useContext, useRef } from 'react'
import useCounter from '../hooks/useCounter'
import { finishTimer, createTimer, deleteProject, getProject, getTimersProject, getProjectTimers } from '../Data/Data'
import { projectsListLink, projectEditlink, projectHistorylink, timerlink, timerRunninglink, timerTrashlink } from '../routes/routes'
import { useAlert } from '../hooks/useAlert'
import { PopupContext } from '../contexts/PopupContext'
import { useStyles } from '../themes/DefaultTheme'
import ProjectRecord from '../components/templates/ProjectRecord'
import { runningHandler, timersHandler, projectHandler } from '../Data/Handlers'
import * as chain from '../Data/Chains'
import messenger from '../constants/Messenger'

const debug = true


export default function ProjectRecordScreen({ useParams, useHistory }) {
  const { projectId } = useParams()
  const [online, setOnline] = useState(false)
  const [project, setProject] = useState([])
  const [timers, setTimers] = useState([])
  const [current, setCurrent] = useState([])
  const [alerted, setAlert] = useState([])
  const { count, setCount, start, stop } = useCounter(1000, false)
  const classes = useStyles();
  const alert = useAlert()
  let history = useHistory()
  let { state, dispatch } = useContext(PopupContext)
  const running = useRef({ id: 'none', name: 'none', project: 'none' })


  useEffect(() => {
    if (alerted && alerted.length > 0) {
      alert.show(alerted[1], {
        type: alerted[0]
      })
    }
    return () => alerted
  }, [alerted])

  useEffect(() => {
    messenger.addListener("count", event => setCount(event))
    return () => messenger.removeAllListeners("count")
  }, [])

  useEffect(() => {
    messenger.addListener(chain.project(projectId), event => projectHandler(event, { project, setProject }))
    messenger.addListener(chain.projectTimers(projectId), event => timersHandler(event, { timers, setTimers, running }))
    getProject(projectId)
    getProjectTimers(projectId)
    return () => {
      messenger.removeAllListeners(chain.project(projectId))
      messenger.removeAllListeners(chain.projectTimers(projectId))
    }
  }, [online])

  const removeProject = () => {
    deleteProject(project)
    setAlert(['Success', 'Timer Deleted!'])
    closePopup()
    history.push((projectsListLink()))
  }

  const openPopup = () => dispatch({ type: "open" });
  const closePopup = () => dispatch({ type: "close" });

  const startTimer = (project) => {
    createTimer(project.id)
    history.push(timerRunninglink())
  }

  return (
    <ProjectRecord
      classes={classes}
      project={project}
      timers={timers}
      runningProject={running}
      runningTimer={running}
      count={count}
      stop={stop}
      timerlink={timerlink}
      startTimer={startTimer}
      finishTimer={finishTimer}
      popupAccept={removeProject}
      popupReject={closePopup}
      sideMenuOptions={[
        { name: 'edit', action: () => history.push(projectEditlink(projectId)) },
        { name: 'history', action: () => history.push(projectHistorylink(projectId)) },
        { name: 'delete', action: () => openPopup() },
        { name: 'trash', action: () => history.push(timerTrashlink(projectId)) }
      ]}
    />
  )
}