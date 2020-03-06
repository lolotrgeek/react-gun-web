import React, { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { gun, createProject, updateProject } from '../constants/Data'
import SpacingGrid from '../components/Grid'
import { Grid, Button, TextField, makeStyles } from '@material-ui/core/'
import { CirclePicker } from 'react-color'
import { colorValid, nameValid, projectValid } from '../constants/Validators'

const useStyles = makeStyles(theme => ({
  form: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

export default function ProjectCreateScreen() {
  const { projectId,  } = useParams()
  const [online, setOnline] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const [project, setProject] = useState([])

  const classes = useStyles();

  useEffect(() => {
    if (projectId) {
      gun.get('projects').get(projectId).on((projectValue, projectGunKey) => {
        console.log(projectValue)
        setProject([projectId, projectValue])
      }
        , { change: true })
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
    if (!nameValid(name)) { alert('Need valid name') }
    if (!colorValid(color)) { alert('Need valid color') }
    else if (projectId && projectValid(project)) {
      console.log('updating', project)
      updateProject(project, {name: name, color: color}) }
    else { 
      console.log('creating', project)
      createProject(name, color) }
  }
  return (
    <Grid container direction='column' justify='center' alignItems='center' spacing={4}>
      <h2>{nameValid(name) ? name : 'New Project'}</h2>
      <Grid container direction='column' justify='flex-start' alignItems='center' spacing={5}>
        <form className={classes.form}>
          <TextField variant="outlined" label="name" value={nameValid(name) ? name : ''} onChange={event => setName(event.target.value)} />
        </form>
        {color}
        <Grid item xs><CirclePicker onChangeComplete={handleSelectedColor} /></Grid>
        <Grid item xs>
          <Button variant="contained" color="primary" onClick={() => handleSubmitProject()}>Submit</Button>
        </Grid>
      </Grid>
    </Grid>
  )
}