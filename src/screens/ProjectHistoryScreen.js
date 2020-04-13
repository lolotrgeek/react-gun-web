import React, { useState, useEffect, useContext } from 'react'
import useCounter from '../hooks/useCounter'
import { isRunning, isTimer, projectValid } from '../constants/Validators'
import { elapsedTime, fullDate, trimSoul} from '../constants/Functions'
import { gun, restoreProject } from '../constants/Data'
import { projectEditlink, projectCreatelink, projectlink, timerRunninglink } from '../routes/routes'
import { useStyles } from '../themes/DefaultTheme'
import { PopupContext } from '../contexts/PopupContext'
import { useAlert } from '../hooks/useAlert'
import ProjectHistory from '../components/templates/ProjectHistory'

export default function ProjectHistoryScreen({useParams, useHistory}) {
  const { projectId } = useParams()
  const [online, setOnline] = useState(false)
  const [alerted, setAlert] = useState([])
  const [project, setProject] = useState([])
  const [edits, setEdits] = useState([])
  const classes = useStyles();
  const alert = useAlert()
  let history = useHistory()
  let { state, dispatch } = useContext(PopupContext)

  const debug = false


  useEffect(() => {
    if (alerted && alerted.length > 0) {
      alert.show(alerted[1], {
        type: alerted[0]
      })
    }
    return () => alerted
  }, [alerted])
  useEffect(() => {
    gun.get('history').get('projects').get(projectId).map().on((projectValue, projectGunKey) => {
      debug && console.log('History ', projectGunKey, projectValue)
      setEdits(edits => [...edits, [projectId, trimSoul(projectValue), projectGunKey]])
    }, { change: true })
    return () => gun.get('history').off()
  }, [online]);

  useEffect(() => {
    gun.get('projects').get(projectId).on((projectValue, projectGunKey) => {
      setProject([projectId, trimSoul(projectValue)])
    }, { change: true })
    return () => gun.get('projects').off()
  }, [online]);

  const displayStatusDate = edit => {
    if (edit[1]) {
      if (edit[1].edited && edit[1].edited.length > 0) return fullDate(new Date(edit[1].edited))
      else if (edit[1].deleted && typeof edit[1].deleted === 'string') return fullDate(new Date(edit[1].deleted))
      else return fullDate(new Date(edit[1].created))
    }
  }

  const displayStatus = edit => {
    // debug && console.log(edit[1], project[1])
    if (JSON.stringify(edit[1]) === JSON.stringify(project[1])) return 'Current Entry'
    else if (edit[1].deleted && typeof edit[1].deleted === 'string') return 'Deleted Entry'
    else if (!edit[1].edited && edits.length > 1) return 'Original Entry'
    // else if (edit[1].edited && edit[1].edited.length > 0) return fullDate(new Date(edit[1].edited))
    else if (edit[1].edited && edit[1].edited.length > 0) return 'Edit Entry'
    else return ''
  }

  const displayRestoreButton = edit => {
    if (JSON.stringify(edit[1]) === JSON.stringify(project[1])) return false
    else if (!edit[1].edited && edits.length > 1) return true
    else if (edit[1].edited && edit[1].edited.length > 0) return true
    else return false
  }

  const editRestore = edit => restoreProject([edit[0], edit[1]])

  return (
    <ProjectHistory
      classes={classes}
      project={project}
      edits={edits}
      headerButtonAction={() => history.push(projectEditlink(project[0]))}
      displayStatus={displayStatus}
      displayStatusDate={displayStatusDate}
      displayRestoreButton={displayRestoreButton}
      restoreButtonAction={editRestore}
    />

  )
}