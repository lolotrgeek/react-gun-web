import { Grid, Button, makeStyles } from '@material-ui/core/'
import React, { useEffect, useState } from 'react'
import SpacingGrid, { UnEvenGrid } from '../components/Grid'
import { RunningTimer } from '../components/RunningTimer'
import { createTimer, finishTimer, gun } from '../constants/Data'
import { dayHeaders, elapsedTime, sayDay, secondsToString, sumProjectTimers } from '../constants/Functions'
import { trimSoul } from '../constants/Store'
import { isRunning, projectValid, isTimer } from '../constants/Validators'
import useCounter from '../hooks/useCounter'
import { projectlink, projectsListLink, timerRunninglink } from '../routes/routes'
import { Title, SubTitle } from '../components/Title'
import { Link } from '../components/Link'
// import { Button } from '../components/Button'
import { Header, SubHeader } from '../components/Header'
import { useStyles } from '../themes/DefaultTheme'
import { useHistory } from "react-router-dom"

export default function TimerScreen() {
  const [online, setOnline] = useState(false)
  const [projects, setProjects] = useState([])
  const [timers, setTimers] = useState([])
  const [runningTimer, setRunningTimer] = useState('')
  const [runningProject, setRunningProject] = useState('')
  const { count, setCount, start, stop } = useCounter(1000, false)
  const classes = useStyles();
  const history = useHistory()

  useEffect(() => {
    gun.get('projects').map().on((projectValue, projectKey) => {
      console.log(projectValue)
      if (projectValue && projectValue.status !== 'deleted') {
        setProjects(projects => [...projects, [projectKey, projectValue]])
      }
    }, { change: true })
    return () => gun.get('projects').off()
  }, [online])

  useEffect(() => {
    gun.get('running').get('timer').on((runningTimerGun, runningTimerKeyGun) => {
      const runningTimerFound = trimSoul(JSON.parse(runningTimerGun))
      if (isRunning(runningTimerFound)) {
        setRunningTimer(runningTimerFound)
        console.log('runningTimerFound', runningTimerFound)
        setCount(elapsedTime(runningTimerFound[1].created))
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

  useEffect(() => {
    let currentTimers = []
    gun.get('timers').map().on((timerGunId, projectKey) => {
      gun.get('timers').get(projectKey).map().on((timerValue, timerKey) => {
        if (timerValue) {
          const foundTimer = [timerKey, trimSoul(timerValue)]
          if (foundTimer[1].status === 'done') {
            let check = currentTimers.some(id => id === foundTimer[0])
            if (!check) {
              console.log('Adding Timer', foundTimer)
              setTimers(timers => [...timers, foundTimer])
            }
            currentTimers.push(foundTimer[0])
          }
          else if (foundTimer[1].status === 'running') {
            gun.get('running').get('timer').put(JSON.stringify(foundTimer))
          }
        }
      })
    }, { change: true })
    return () => gun.get('timers').off()
  }, [online]);

  return (
    <Grid className={classes.listRoot} >
      <SubHeader className={classes.space} title='Timeline' buttonClick={() => history.push(projectsListLink())} buttonText='Projects' />
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
        {sumProjectTimers(dayHeaders(timers.sort((a, b) => new Date(b[1].created) - new Date(a[1].created)))).map((day, index) => {
          return (
            <Grid key={index} className={classes.listClass}>
              <SubTitle>{sayDay(day.title)}</SubTitle>
              {day.data.map(item => projects.map(project => {
                if (item.status === 'running') return (null)
                if (project[0] === item.project) {
                  return (
                    <UnEvenGrid key={project[0]} values={[
                      <Link to={projectlink(item.project)}>
                        <Title variant='h6' color={project[1].color} >{projectValid(project) ? project[1].name : ''}</Title>
                      </Link>,
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          if (isRunning(runningTimer)) { finishTimer(runningTimer); stop() };
                          createTimer(item.project)
                          history.push(timerRunninglink())
                        }}>
                        {secondsToString(item.total)}
                      </Button>
                    ]} />
                  )
                }
                else return (null)
              })
              )}
            </Grid>
          )
        })}
      </Grid>
    </Grid >
  )
}