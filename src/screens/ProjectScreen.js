import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { gun, createProject } from '../constants/Data'
import SpacingGrid from '../components/Grid'
import { Grid, Button, TextField, makeStyles } from '@material-ui/core/'

const useStyles = makeStyles(theme => ({
  form: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

export default function ProjecScreen() {
  const [online, setOnline] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const [projects, setProjects] = useState([])

  const classes = useStyles();

  useEffect(() => {
    gun.get('projects').map().on((projectValue, projectKey) => {
      console.log(projectValue)
      setProjects(projects => [...projects, [projectKey, projectValue]])
    }
      , { change: true })
    return () => gun.get('projects').off()
  }, [online])

  return (
    <Grid container direction='column' justify='center' alignItems='center' spacing={4}>
      <h2>Projects</h2>
      <Grid container direction='column' justify='flex-start' alignItems='center'>
        <h3>New Project</h3>
        <form className={classes.form}>
          <TextField variant="outlined" label="name" onChange={event => setName(event.target.value)} />
          <TextField variant="outlined" label="color" onChange={event => setColor(event.target.value)} />
        </form>
        <Button variant="contained" color="primary" onClick={() => name.length > 0 && color.length > 0 ? createProject(name, color) : alert('Need name and color')}>Submit</Button>
      </Grid>
      <h3>Project List</h3>
      <Grid container direction='column' justify='center' alignItems='center'>


        {projects.map(project => {
          return (
            <Grid item xs={6}>
              <Link to={`/project/${project[0]}/${project[1].name}`}>{project[0]} : {project[1].name}</Link>
            </Grid>
          )
        })}
      </Grid>
    </Grid>
  )
}