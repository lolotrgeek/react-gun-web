import React, { useState, useEffect, useContext } from 'react'
import { trimSoul } from '../constants/Functions'
import { getDeletedTimers, getProject, restoreTimer, getTimers } from '../Data/Data'
import { useStyles } from '../themes/DefaultTheme'
import { PopupContext } from '../contexts/PopupContext'
import { useAlert } from '../hooks/useAlert'
import { projectlink } from '../routes/routes'
import TrashList from '../components/templates/TrashList'
import { projectHandler, timersDeletedHandler } from '../Data/Handlers'
import * as chain from '../Data/Chains'
import messenger from '../constants/Messenger'

const debug = false

export default function TimerTrashScreen({ useParams, useHistory }) {
  const { projectId } = useParams()
  const [online, setOnline] = useState(false)
  const [alerted, setAlert] = useState([])
  const [timers, setTimers] = useState([])
  const [project, setProject] = useState([])
  const alert = useAlert()
  let history = useHistory()
  let { state, dispatch } = useContext(PopupContext)
  const classes = useStyles();

  useEffect(() => {
    if (alerted && alerted.length > 0) {
      alert.show(alerted[1], {
        type: alerted[0]
      })
    }
    return () => alerted
  }, [alerted])

  useEffect(() => {
    messenger.addListener(chain.project(projectId), event => projectHandler(event, { project, setProject }))
    messenger.addListener(chain.timers(), event => timersDeletedHandler(event, { timers, setTimers }))
    getProject(projectId)
    getTimers()
    return () => {
      messenger.removeAllListeners(chain.project(projectId))
      messenger.removeAllListeners(chain.timers())
    }
  }, [online])

  const openPopup = () => dispatch({ type: "open" });
  const closePopup = () => dispatch({ type: "close" });

  function restoreTimerAction(timer) {
    restoreTimer([timer.id, timer])
    closePopup()
    history.push(projectlink(timer.project))
  }

  return (
    <TrashList
      classes={classes}
      history={history}
      timers={timers}
      project={project}
      restoreButton={openPopup}
      popupAccept={restoreTimerAction}
      popupReject={closePopup}
    />
  )
}
