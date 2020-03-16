import React, { useState, useEffect } from 'react'
import useCounter from '../hooks/useCounter'
import { isRunning, isTimer } from '../constants/Validators'
import { elapsedTime } from '../constants/Functions'
import { trimSoul } from '../constants/Store'
import { gun, finishTimer, createTimer } from '../constants/Data'
import SpacingGrid, { UnEvenGrid } from '../components/Grid'
import { Grid, TextField, makeStyles, Divider, Button } from '@material-ui/core/'
import { projectValid } from '../constants/Validators'
import { projectEditlink, projectCreatelink, projectlink, timerRunninglink } from '../routes/routes'
import { Title } from '../components/Title'
import { Link } from '../components/Link'
// import { Button } from '../components/Button'
import { Header, SubHeader } from '../components/Header'
import { RunningTimer } from '../components/RunningTimer'
import { useHistory } from "react-router-dom"
import { useStyles } from '../themes/DefaultTheme'

export default function ProjectCreateScreen() {
  const [online, setOnline] = useState(false)
  const [projects, setProjects] = useState([])
  const [runningTimer, setRunningTimer] = useState('')
  const [runningProject, setRunningProject] = useState('')
  const { count, setCount, start, stop } = useCounter(1000, false)
  const classes = useStyles();
  let history = useHistory()


  useEffect(() => {
    gun.get('projects').map().on((projectValue, projectKey) => {
      console.log(projectValue)
      if (projectValue && projectValue.status !== 'deleted') {
        setProjects(projects => [...projects, [projectKey, projectValue]])
      }
    }
      , { change: true })
    return () => gun.get('projects').off()
  }, [online])

  useEffect(() => {
    gun.get('running').get('timer').on((runningTimerGun, runningTimerKeyGun) => {
      const runningTimerFound = trimSoul(JSON.parse(runningTimerGun))
      if (isRunning(runningTimerFound)) {
        setRunningTimer(runningTimerFound)
        console.log('runningTimerFound', runningTimerFound)
        setCount(elapsedTime(runningTimerFound[1].started))
        start()
      }
      else if (!runningTimerGun) {
        console.log('running Timer not Found')
        stop()
        setRunningTimer({})
      }
    }, { change: true })

    return () => gun.get('running').off()
  }, [online, setCount, start, stop]);

  useEffect(() => {
    if (runningTimer[1] && isTimer(runningTimer)) {
      gun.get('projects').get(runningTimer[1].project).on((projectValue, projectKey) => {
        console.log(projectValue)
        if (projectValue && projectValue.status !== 'deleted') {
          setRunningProject([projectKey, projectValue])
        }
      }, { change: true })
      return () => gun.get('projects').off()
    }
  }, [runningTimer])

  return (
    <Grid className={classes.listRoot}>
      <SubHeader className={classes.space} title='Projects' buttonClick={() => history.push(projectCreatelink())} buttonText='New Project' />
      {isRunning(runningTimer) ?
        <RunningTimer
          className={classes.space}
          name={runningProject[1] ? runningProject[1].name : ''}
          color={runningProject[1] ? runningProject[1].color : ''}
          count={count}
          stop={() => { finishTimer(runningTimer); stop() }}
        />
        : ''}

      <Grid className={classes.space}>
        {projects.map(project => {
          return (
            <Grid key={project[0]} className={classes.listClass}>
              <UnEvenGrid
                values={[
                  <Link to={projectlink(project[0])} >
                    <Title color={project[1].color} variant='h6'>
                      {projectValid(project) ? project[1].name : ''}
                    </Title>
                  </Link>,
                  <Button variant="contained" color="primary" onClick={() => {
                    if (isRunning(runningTimer)) { finishTimer(runningTimer); stop() };
                    createTimer(project[0])
                    history.push(timerRunninglink())
                  }}>Start</Button>

                ]}
              />
            </Grid>
          )
        })}
      </Grid>
    </Grid>

  )
}