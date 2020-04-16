import React, { useState, useEffect, useContext } from 'react'
import { restoreTimer } from '../constants/Data'
import { isRunning,} from '../constants/Validators'
import { elapsedTime, fullDay, trimSoul } from '../constants/Functions'
import useCounter from '../hooks/useCounter'
import { useStyles } from '../themes/DefaultTheme'
import { PopupContext } from '../contexts/PopupContext'
import { useAlert } from '../hooks/useAlert'
import { projectlink } from '../routes/routes'
import TimerHistory from '../components/templates/TimerHistory'
import { getRunningTimer, getProject, getProjectHistoryTimers, getTimerHistory } from '../constants/Effects'

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
  
  useEffect(() => getRunningTimer({setCount, start, stop, setRunningTimer}), [online]);
  useEffect(() => getProject({projectId, setProject}), [timer])
  useEffect(() => getProjectHistoryTimers({timerId, projectId, setAlert, projectlink, history, setTimer}), [online]);
  useEffect(() => getTimerHistory({setEdits, projectId, timerId}), [online]);

  const openPopup = () => dispatch({ type: "open" });
  const closePopup = () => dispatch({ type: "close" });

  const displayStatusTitle = timer => {
    if (timer[1].edited || timer[1].edited.length > 0) return 'Edit'
    if (timer[1].status === 'running') return 'Start'
    if (timer[1].status === 'done') return 'End'

  }
  const displayStatusDate = edit => {
    if (edit[1].edited || edit[1].edited.length > 0) return fullDay(new Date(edit[1].edited))
    if (edit[1].status === 'running') return fullDay(new Date(edit[1].created))
    if (edit[1].status === 'done') return fullDay(new Date(edit[1].ended))

  }
  const displayStatus = edit => {
    if (edit[1].status === 'running') return 'Start Entry'
    else if (JSON.stringify(edit[1]) === JSON.stringify(timer[1])) return 'Current Entry'
    else if(edit[1].deleted && typeof edit[1].deleted === 'string') return 'Restored Entry'
    else if (edit[1].status === 'done' && edit[1].edited.length === 0) return 'End Entry'
    else if (edit[1].status === 'done' && edit[1].edited.length > 0) return 'Edit Entry'
    else return false
  }
  const displayRestoreButton = edit => {
    if (JSON.stringify(edit[1]) === JSON.stringify(timer[1])) return false
    else if (edit[1].status === 'done') return true
    else return false
  }
  const editRestore = edit => {
    restoreTimer([edit[0], edit[1]])
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
