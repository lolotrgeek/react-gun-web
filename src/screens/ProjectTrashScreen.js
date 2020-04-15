import React, { useState, useEffect } from 'react'
import { gun, restoreProject } from '../constants/Data'
import { projectlink } from '../routes/routes'
import { useStyles } from '../themes/DefaultTheme'
import ProjectTrash from '../components/templates/ProjectTrash'
import {getDeletedProjects} from '../constants/Effects'

const debug = false


export default function ProjectTrashScreen({useParams, useHistory}) {
  const [online, setOnline] = useState(false)
  const [projects, setProjects] = useState([])
  const classes = useStyles();
  let history = useHistory()

  useEffect(() => getDeletedProjects({setProjects}), [online]);

  // const displayStatus = edit => {
  //   debug && console.log(edit[1], project[1])
  //   if (JSON.stringify(edit[1]) === JSON.stringify(project[1])) return 'Current Entry'
  //   else if (!edit[1].edited && edits.length > 1) return 'Original Entry'
  //   else if (edit[1].edited && edit[1].edited.length > 0) return fullDate(new Date(edit[1].edited))
  //   else return ''
  // }

  // const displayRestoreButton = edit => {
  //   if (JSON.stringify(edit[1]) === JSON.stringify(project[1])) return false
  //   else if (!edit[1].edited && edits.length > 1) return true
  //   else if (edit[1].edited && edit[1].edited.length > 0) return true
  //   else return false
  // }

  const restoreButtonAction = (project) => {
    restoreProject(project);
    history.push(projectlink(project[0]))
  }

  return (
    <ProjectTrash
      classes={classes}
      projects={projects}
      restoreButtonAction={restoreButtonAction}
    />
  )
}