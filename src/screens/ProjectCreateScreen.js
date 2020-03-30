import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { createProject } from '../constants/Data'
import { colorValid, nameValid } from '../constants/Validators'
import { useAlert } from 'react-alert'
import { projectsListLink } from '../routes/routes'
import { useStyles } from '../themes/DefaultTheme'
import ProjectCreate from '../components/ProjectCreate'

export default function ProjectCreateScreen() {
  const [alerted, setAlert] = useState([])
  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const alert = useAlert()
  let history = useHistory()

  const classes = useStyles();

  useEffect(() => {
    if (alerted && alerted.length > 0) {
      alert.show(alerted[1], {
        type: alerted[0]
      })
    }
    return () => alerted
  }, [alerted])


  const handleSelectedColor = (color, event) => {
    console.log(color)
    console.log(event)
    setColor(color.hex)
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
    else {

      createProject(name, color)
      setAlert([
        'Success',
        `Project ${name} Created!`,
      ])
      history.push(projectsListLink())
    }
  }
  return (
    <ProjectCreate
      classes={classes}
      name={name}
      setName={setName}
      color={color}
      selectColor={handleSelectedColor}
      submitProject={handleSubmitProject}
      />
  )
}