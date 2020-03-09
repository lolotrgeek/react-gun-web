import React, { useState, useEffect } from 'react'
import { trimSoul } from '../constants/Store'
import { gun, createProject } from '../constants/Data'
import SpacingGrid from '../components/Grid'
import { Grid, TextField, makeStyles, Divider } from '@material-ui/core/'
import { projectValid } from '../constants/Validators'
import { projectEditlink, projectCreatelink, projectlink } from '../routes/routes'
import { Title } from '../components/Title'
import { Link } from '../components/Link'
import { Button } from '../components/Button'
import { Header, SubHeader } from '../components/Header'

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
    <Grid>
      <SubHeader title='Projects' buttonLink={projectCreatelink()} buttonText='New Project' />
      <Grid>
        {projects.map(project => {
          return (
            <SpacingGrid
              values={[
                <Link to={projectlink(project[0])} >
                  <Title
                    color={project[1].color}
                    name={projectValid(project) ? project[1].name : ''}
                    variant='body1'
                  />
                </Link>,
                <Button variant="contained" color="primary" to={projectEditlink(project[0])}>Edit</Button>
              ]}
            />
          )
        })}
      </Grid>
    </Grid>

  )
}