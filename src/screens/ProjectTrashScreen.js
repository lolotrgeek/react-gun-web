import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import useCounter from '../hooks/useCounter'
import { isRunning, isTimer } from '../constants/Validators'
import { elapsedTime, fullDate } from '../constants/Functions'
import { trimSoul } from '../constants/Store'
import { gun, restoreProject } from '../constants/Data'
import SpacingGrid, { UnEvenGrid } from '../components/Grid'
import { Grid, Typography, makeStyles, Divider, Button } from '@material-ui/core/'
import { projectValid } from '../constants/Validators'
import { projectEditlink, projectCreatelink, projectlink, timerRunninglink } from '../routes/routes'
import { Title } from '../components/Title'
import { Link } from '../components/Link'
// import { Button } from '../components/Button'
import { Header, SubHeader } from '../components/Header'
import { RunningTimer } from '../components/RunningTimer'
import { useHistory } from "react-router-dom"
import { useStyles } from '../themes/DefaultTheme'
import Stateless from '../components/Stateless'

export default function ProjectTrash() {
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
  return (
    <Grid>
      <SubHeader
        className={classes.space}
        title='Project Trash'
      />

      <Grid className={classes.space}>
        {projects.map(project => {
          return (
            <Grid key={project[0]} className={classes.listClass}>
              <UnEvenGrid
                values={[
                  <Title color={project[1].color} variant='h6' >{ project[1].name }</Title>,
                  <Button variant="contained" color="primary" onClick={() => {restoreProject(project); history.push(projectlink(project[0]))} }>Restore</Button>
                ]}
              />

            </Grid>
          )
        })}
      </Grid>
    </Grid >
  )
}