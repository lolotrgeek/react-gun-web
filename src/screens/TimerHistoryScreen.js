import React, { useState, useEffect, useContext, useRef } from 'react'
import { restoreTimer, getRunningTimer, getProject, getProjectHistoryTimers, getTimerHistory} from '../Data/Data'
import { isRunning,} from '../constants/Validators'
import { elapsedTime, fullDay, trimSoul } from '../constants/Functions'
import useCounter from '../hooks/useCounter'
import { useStyles } from '../themes/DefaultTheme'
import { PopupContext } from '../contexts/PopupContext'
import { useAlert } from '../hooks/useAlert'
import { projectlink } from '../routes/routes'
import TimerHistory from '../components/templates/TimerHistory'
import { projectHandler, runningHandler, projectHistoryHandler, timerHandler, timerHistoryHandler } from '../Data/Handlers'
import * as chain from '../Data/Chains'
import messenger from '../constants/Messenger'

const debug = false

export default function TimerHistoryScreen({useParams, useHistory}) {
  const { projectId, timerId } = useParams()
  const [online, setOnline] = useState(false)
  const [alerted, setAlert] = useState([])
  const [edits, setEdits] = useState([])
  const [timer, setTimer] = useState([])
  const [project, setProject] = useState([])
  const [runningTimer, setRunningTimer] = useState('')
  const { count, setCount, start, stop } = useCounter(1000, false)
  const running = useRef({ id: 'none', name: 'none', project: 'none' })
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
    //TODO need browser count/running implementation here
    messenger.addListener("count", event => setCount(event))
    return () => messenger.removeAllListeners("count")
  }, [])

  useEffect(() => {
    messenger.addListener(chain.project(projectId), event => projectHandler(event, {project, setProject}))
    messenger.addListener(chain.projectHistory(projectId), event => projectHistoryHandler(event, {edits, setEdits}))
    messenger.addListener("running", event => runningHandler(event, {running: running}))
    messenger.addListener(chain.timer(timerId), event => timerHandler(event, {timer, setTimer}))
    messenger.addListener(chain.timerHistory(timerId), event => timerHistoryHandler(event, {edits, setEdits}))
    getProject(projectId)
    return () => {
      messenger.removeAllListeners(chain.project(projectId))
      messenger.removeAllListeners(chain.projectHistory(projectId))
      messenger.removeAllListeners("running")
      messenger.removeAllListeners(chain.timer(timerId))
      messenger.removeAllListeners(chain.timerHistory(timerId))
    }
  },[online])

  // TODO re-implement project history timers?
  // useEffect(() => getProjectHistoryTimers({timerId, projectId, setAlert, projectlink, history, setTimer}), [online]);

  const openPopup = () => dispatch({ type: "open" });
  const closePopup = () => dispatch({ type: "close" });

  const displayStatusTitle = timer => {
    if (timer.edited || timer.edited.length > 0) return 'Edit'
    if (timer.status === 'running') return 'Start'
    if (timer.status === 'done') return 'End'

  }
  const displayStatusDate = edit => {
    if (edit.edited || edit.edited.length > 0) return fullDay(new Date(edit.edited))
    if (edit.status === 'running') return fullDay(new Date(edit.created))
    if (edit.status === 'done') return fullDay(new Date(edit.ended))

  }
  const displayStatus = edit => {
    if (edit.status === 'running') return 'Start Entry'
    else if (JSON.stringify(edit) === JSON.stringify(timer)) return 'Current Entry'
    else if(edit.deleted && typeof edit.deleted === 'string') return 'Restored Entry'
    else if (edit.status === 'done' && edit.edited.length === 0) return 'End Entry'
    else if (edit.status === 'done' && edit.edited.length > 0) return 'Edit Entry'
    else return false
  }
  const displayRestoreButton = edit => {
    if (JSON.stringify(edit) === JSON.stringify(timer)) return false
    else if (edit.status === 'done') return true
    else return false
  }
  const editRestore = edit => {
    restoreTimer([edit.id, edit])
    closePopup()
  }

  return (
    <TimerHistory 
      classes={classes}
      project={project}
      timer={timer}
      edits={edits}
      popupAccept={editRestore}
      displayRestoreButton={displayRestoreButton}
      displayStatusDate={displayStatusDate}
      displayStatus={displayStatus}
      restoreButtonAction={editRestore}
    />
  )
}
