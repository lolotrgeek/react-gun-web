import React, { useState, useEffect } from 'react'
import { gun, restoreProject, getProjects } from '../Data/Data'
import { projectlink } from '../routes/routes'
import { useStyles } from '../themes/DefaultTheme'
import ProjectTrash from '../components/templates/ProjectTrash'
import { } from '../constants/Effects'
import {projectsDeletedHandler } from '../Data/Handlers'
import * as chain from '../Data/Chains'
import messenger from '../constants/Messenger'
const debug = false


export default function ProjectTrashScreen({ useParams, useHistory }) {
  const [online, setOnline] = useState(false)
  const [projects, setProjects] = useState([])
  const classes = useStyles();
  let history = useHistory()

  useEffect(() => {
    messenger.addListener("projects", event => projectsDeletedHandler(event, { projects, setProjects }))
    return () => messenger.removeAllListeners("projects")
  }, [online]);

  // const displayStatus = edit => {
  //   debug && console.log(edit, project)
  //   if (JSON.stringify(edit) === JSON.stringify(project)) return 'Current Entry'
  //   else if (!edit.edited && edits.length > 1) return 'Original Entry'
  //   else if (edit.edited && edit.edited.length > 0) return fullDate(new Date(edit.edited))
  //   else return ''
  // }

  // const displayRestoreButton = edit => {
  //   if (JSON.stringify(edit) === JSON.stringify(project)) return false
  //   else if (!edit.edited && edits.length > 1) return true
  //   else if (edit.edited && edit.edited.length > 0) return true
  //   else return false
  // }

  const restoreButtonAction = (project) => {
    restoreProject(project);
    history.push(projectlink(project.id))
  }

  return (
    <ProjectTrash
      classes={classes}
      projects={projects}
      restoreButtonAction={restoreButtonAction}
    />
  )
}