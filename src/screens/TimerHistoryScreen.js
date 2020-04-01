import React, { useState, useEffect, useContext } from 'react'
import { useParams, useHistory } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { gun, restoreTimer } from '../constants/Data'
import { isRunning,} from '../constants/Validators'
import { elapsedTime, fullDate } from '../constants/Functions'
import useCounter from '../hooks/useCounter'
import { useStyles } from '../themes/DefaultTheme'
import { PopupContext } from '../contexts/PopupContext'
import { useAlert } from 'react-alert'
import { projectlink } from '../routes/routes'
import TimerHistory from '../components/templates/TimerHistory'

export default function TimerHistoryScreen() {
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
  }, [online]);

  useEffect(() => {
    gun.get('projects').get(projectId).on((projectValue, projectKey) => {
      console.log(projectValue)
      setProject([projectKey, projectValue])
    }
      , { change: true })
    return () => gun.get('projects').off()
  }, [timer])

  useEffect(() => {
    console.log('Getting: ', projectId, timerId)
    gun.get('timers').get(projectId, ack => {
      if (ack.err || !ack.put) setAlert(['Error', 'No Project Exists'])
    }).get(timerId, ack => {
      if (ack.err || !ack.put) setAlert(['Error', 'No Timer Exists'])
    }).on((timerValue, timerGunId) => {
      if (!timerValue) {
        setAlert(['Error', 'No Timer Exists'])
        history.push((projectlink(projectId)))
      }
      let foundTimer = [timerId, trimSoul(timerValue)]
      setTimer(foundTimer)

    }, { change: true })
    return () => gun.get('timers').off()
  }, [online]);


  useEffect(() => {
    gun.get('history').get('timers').get(projectId).get(timerId).map().on((timerValue, timerGunId) => {
      setEdits(timers => [...timers, [timerId, trimSoul(timerValue), timerGunId]])
    }, { change: true })
    return () => gun.get('timers').off()
  }, [online]);

  const openPopup = () => dispatch({ type: "open" });
  const closePopup = () => dispatch({ type: "close" });

  const displayStatusTitle = timer => {
    if (timer[1].edited || timer[1].edited.length > 0) return 'Edit'
    if (timer[1].status === 'running') return 'Start'
    if (timer[1].status === 'done') return 'End'

  }
  const displayStatusDate = edit => {
    if (edit[1].edited || edit[1].edited.length > 0) return fullDate(new Date(edit[1].edited))
    if (edit[1].status === 'running') return fullDate(new Date(edit[1].created))
    if (edit[1].status === 'done') return fullDate(new Date(edit[1].ended))

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
