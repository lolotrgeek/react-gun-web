import React, { useState, useEffect } from 'react'
import { gun, restoreProject } from '../constants/Data'
import { projectlink } from '../routes/routes'
import { useHistory } from "react-router-dom"
import { useStyles } from '../themes/DefaultTheme'
import ProjectTrash from '../components/ProjectTrash'


export default function ProjectTrashScreen() {
  const [online, setOnline] = useState(false)
  const [projects, setProjects] = useState([])
  const classes = useStyles();
  let history = useHistory()

  useEffect(() => {
    gun.get('projects').map().on((projectValue, projectKey) => {
      if (projectValue.status === 'deleted') {
        console.log(projectValue)
        setProjects(projects => [...projects, [projectKey, projectValue]])
      }
    }, { change: true })
    return () => gun.get('projects').off()
  }, [online]);


  // const displayStatus = edit => {
  //   console.log(edit[1], project[1])
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