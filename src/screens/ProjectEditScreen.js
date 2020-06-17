import React, { useState, useEffect, useContext } from 'react'
import { trimSoul } from '../constants/Functions'
import { gun, createProject, updateProject, deleteProject } from '../constants/Data'
import { colorValid, nameValid, projectValid } from '../constants/Validators'
import { useAlert } from '../hooks/useAlert'
import { projectsListLink, projectlink } from '../routes/routes'
import { PopupContext } from '../contexts/PopupContext'
import { useStyles } from '../themes/DefaultTheme'
import ProjectEdit from '../components/templates/ProjectEdit'
import {getProject} from '../constants/Effects'

export default function ProjectEditScreen({ useParams, useHistory }) {
  const { projectId, } = useParams()
  const [online, setOnline] = useState(false)
  const [alerted, setAlert] = useState([])
  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const [project, setProject] = useState([])
  const alert = useAlert()
  let history = useHistory()
  let { state, dispatch } = useContext(PopupContext)

  const classes = useStyles();
  const debug = false

  useEffect(() => {
    if (alerted && alerted.length > 0) {
      alert.show(alerted[1], {
        type: alerted[0]
      })
    }
    return () => alerted
  }, [alerted])

  useEffect(() => getProject({projectId, setProject}), [online])

  useEffect(() => {
    if (projectId && project) {
      setName(project.name)
      setColor(project.color)
    }
    return () => project
  }, [project])

  const handleSelectedColor = (color) => {
    setColor(color)
  }

  const handleSubmitProject = () => {
    if (!nameValid(name)) {
      // alert('Need valid name');
      setAlert([
        'Error',
        'Need valid name',
      ])
      return false
    }
    if (!colorValid(color)) {
      // alert('Need valid color');
      setAlert([
        'Error',
        'Need valid color',
      ])
      return false
    }
    else if (projectId && projectValid(project)) {
      // debug && console.log('updating', project)
      updateProject(project, { name: name, color: color })
      setAlert([
        'Success',
        `Project ${name} Updated!`,
      ])
      history.push(projectlink(projectId))
    }
    else {
      createProject(name, color)
      setAlert([
        'Success',
        `Project ${name} Created!`,
      ])
      history.push(projectlink(projectId))
    }
  }

  const removeProject = () => {
    deleteProject(project)
    setAlert(['Success', 'Timer Deleted!'])
    closePopup()
    history.push(projectsListLink())
  }
  const openPopup = () => dispatch({ type: "open" });
  const closePopup = () => dispatch({ type: "close" });
  return (
    <ProjectEdit
      classes={classes}
      name={name}
      setName={setName}
      color={color}
      selectColor={handleSelectedColor}
      sideMenuOptions={[{ name: 'delete', action: () => openPopup() }]}
      popupAccept={removeProject}
      popupReject={closePopup}
      submitProject={handleSubmitProject}
      cancelEdit={() => history.goBack()}
    />
  )
}