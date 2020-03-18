import React, { useState, useEffect, useContext } from 'react'
import { useParams, useHistory } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { gun, createProject, updateProject, deleteProject } from '../constants/Data'
import { Grid, Button, TextField, makeStyles } from '@material-ui/core/'
import { CirclePicker } from 'react-color'
import { colorValid, nameValid, projectValid } from '../constants/Validators'
import { SubHeader } from '../components/Header'
import { useAlert } from 'react-alert'
import { projectsListLink, projectlink } from '../routes/routes'
import SideMenu from '../components/SideMenu'
import Popup from '../components/Popup'
import { PopupContext } from '../contexts/PopupContext'
import { useStyles } from '../themes/DefaultTheme'


export default function ProjectEditScreen() {
  const { projectId, } = useParams()
  const [online, setOnline] = useState(false)
  const [alerted, setAlert] = useState([])
  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const [project, setProject] = useState([])
  const [deleted, setDeleted] = useState(false)
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
    if (projectId) {
      gun.get('projects').get(projectId).on((projectValue, projectGunKey) => {
        console.log(projectValue)
        setProject([projectId, trimSoul(projectValue)])
      }, { change: true })
    }
    return () => gun.get('projects').off()
  }, [online])

  useEffect(() => {
    if (projectId && project[1]) {
      setName(project[1].name)
      setColor(project[1].color)
    }
    return () => project
  }, [project])

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
    else if (projectId && projectValid(project)) {
      // console.log('updating', project)
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
    <Grid container direction='column' justify='center' alignItems='center'>
      <Popup content='Confirm Delete?' onAccept={() => removeProject()} onReject={() => closePopup()} />
      <SubHeader title={nameValid(name) ? name : 'New Project'} color={color ? color : ''} />
      <SideMenu
        options={[{ name: 'delete', action: () => openPopup() }, { name: 'archive', action: () => {} }]}
      />
      <Grid container direction='column' justify='flex-start' alignItems='center' className={classes.space}>
        <form className={classes.form}>
          <TextField variant="outlined" label="name" value={nameValid(name) ? name : ''} onChange={event => setName(event.target.value)} />
        </form>
        <Grid item xs className={classes.space}><CirclePicker onChangeComplete={handleSelectedColor} /></Grid>
        <Grid item xs className={classes.space}>
          <Button variant="contained" color="primary" onClick={() => handleSubmitProject()}>Submit</Button>
        </Grid>
      </Grid>
    </Grid>
  )
}