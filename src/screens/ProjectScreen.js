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

export default function ProjectCreateScreen() {
  const [online, setOnline] = useState(false)
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
      <Link to='/project/create'><Button variant="contained" color="primary">New Project</Button></Link>
      <h3>Project List</h3>
      <Grid container direction='column' justify='center' alignItems='center'>
        {projects.map(project => {
          return (
            <Grid item xs={6}>
              <Link to={`/project/${project[0]}/${project[1].name}`}>{project[0]} : {project[1].name} : {project[1].color}</Link>
              <Link to={`/edit/${project[0]}`}><Button variant="contained" color="primary">Edit</Button></Link>
            </Grid>
          )
        })}
      </Grid>
    </Grid>
  )
}