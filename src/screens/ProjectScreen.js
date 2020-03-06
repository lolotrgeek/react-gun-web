import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { gun, createProject } from '../constants/Data'
import SpacingGrid from '../components/Grid'
import { Grid, Button, TextField, makeStyles } from '@material-ui/core/'
import { Title } from '../components/Title'
import { projectValid } from '../constants/Validators'
import { projectEditlink, projectCreatelink, projectlink } from '../routes/routes'

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

      <Link to={projectCreatelink() }><Button variant="contained" color="primary">New Project</Button></Link>
      <h3>Project List</h3>
      <Grid container direction='column' justify='center' alignItems='center'>
        {projects.map(project => {
          return (
            <SpacingGrid
              values={[
                <Link to={projectlink(project[0])} style={{ textDecoration: 'none' }} >
                  <Title
                    color={project[1].color}
                    name={projectValid(project) ? project[1].name : ''}
                    variant='h6'
                  />
                </Link>,
                <Link to={projectEditlink(project[0])}><Button variant="contained" color="primary">Edit</Button></Link>
              ]}
            />
          )
        })}
      </Grid>
    </Grid>
  )
}