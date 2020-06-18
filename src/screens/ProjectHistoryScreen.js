import React, { useState, useEffect, useContext } from 'react'
import useCounter from '../hooks/useCounter'
import { isRunning, isTimer, projectValid } from '../constants/Validators'
import { elapsedTime, fullDate, trimSoul } from '../constants/Functions'
import { gun, restoreProject, getProject, getProjectHistory } from '../Data/Data'
import { projectEditlink, projectCreatelink, projectlink, timerRunninglink } from '../routes/routes'
import { useStyles } from '../themes/DefaultTheme'
import { PopupContext } from '../contexts/PopupContext'
import { useAlert } from '../hooks/useAlert'
import ProjectHistory from '../components/templates/ProjectHistory'
import { projectHistoryHandler, projectHandler } from '../Data/Handlers'
import * as chain from '../Data/Chains'
import messenger from '../constants/Messenger'

export default function ProjectHistoryScreen({ useParams, useHistory }) {
  const { projectId } = useParams()
  const [online, setOnline] = useState(false)
  const [alerted, setAlert] = useState([])
  const [project, setProject] = useState([])
  const [edits, setEdits] = useState([])
  const classes = useStyles();
  const alert = useAlert()
  let history = useHistory()
  let { state, dispatch } = useContext(PopupContext)

  const debug = true

  useEffect(() => {
    if (alerted && alerted.length > 0) {
      alert.show(alerted[1], {
        type: alerted[0]
      })
    }
    return () => alerted
  }, [alerted])

  useEffect(() => {
    messenger.addListener(chain.projectHistory(projectId), event => projectHistoryHandler(event, {edits, setEdits }))
    messenger.addListener(chain.project(projectId), event => projectHandler(event, { project, setProject }))
    getProject(projectId)
    getProjectHistory(projectId)
    return () => {
      messenger.removeAllListeners(chain.project(projectId))
      messenger.removeAllListeners(chain.projectHistory(projectId))
    }
  }, [online, projectId])


  const displayStatusDate = edit => {
    if (edit) {
      if (edit.edited && edit.edited.length > 0) return fullDate(new Date(edit.edited))
      else if (edit.deleted && typeof edit.deleted === 'string') return fullDate(new Date(edit.deleted))
      else return fullDate(new Date(edit.created))
    }
  }

  const displayStatus = edit => {
    // debug && console.log(edit, project)
    if (JSON.stringify(edit) === JSON.stringify(project)) return 'Current Entry'
    else if (edit.deleted && typeof edit.deleted === 'string') return 'Deleted Entry'
    else if (!edit.edited && edits.length > 1) return 'Original Entry'
    // else if (edit.edited && edit.edited.length > 0) return fullDate(new Date(edit.edited))
    else if (edit.edited && edit.edited.length > 0) return 'Edit Entry'
    else return ''
  }

  const displayRestoreButton = edit => {
    if (JSON.stringify(edit) === JSON.stringify(project)) return false
    else if (!edit.edited && edits.length > 1) return true
    else if (edit.edited && edit.edited.length > 0) return true
    else return false
  }

  const editRestore = edit => restoreProject([edit.id, edit])

  return (
    <ProjectHistory
      classes={classes}
      project={project}
      edits={edits}
      headerButtonAction={() => history.push(projectEditlink(project.id))}
      displayStatus={displayStatus}
      displayStatusDate={displayStatusDate}
      displayRestoreButton={displayRestoreButton}
      restoreButtonAction={editRestore}
    />

  )
}