import React, { useState, useEffect, useContext } from 'react'
import { trimSoul } from '../constants/Functions'
import { gun, restoreTimer } from '../constants/Data'
import { useStyles } from '../themes/DefaultTheme'
import { PopupContext } from '../contexts/PopupContext'
import { useAlert } from '../hooks/useAlert'
import { projectlink } from '../routes/routes'
import TrashList from '../components/templates/TrashList'
import { getDeletedTimers, getProject } from '../constants/Effects'

const debug = false

export default function TimerTrashScreen({useParams, useHistory}) {
  const { projectId } = useParams()
  const [online, setOnline] = useState(false)
  const [alerted, setAlert] = useState([])
  const [timers, setTimers] = useState([])
  const [current, setCurrent] = useState([])
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

  useEffect(() => getProject({projectId, setProject}), [online])
  useEffect(() => getDeletedTimers({current, setCurrent, setTimers, projectId}), [online]);

  const openPopup = () => dispatch({ type: "open" });
  const closePopup = () => dispatch({ type: "close" });

  function restoreTimerAction(timer) { 
    restoreTimer([timer[0], timer[1]])
    closePopup()
    history.push(projectlink(timer[1].project)) 
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
