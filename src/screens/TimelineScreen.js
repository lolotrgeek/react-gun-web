import { Grid, makeStyles } from '@material-ui/core/'
import React, { useEffect, useState } from 'react'
import SpacingGrid, { UnEvenGrid } from '../components/Grid'
import { RunningTimer } from '../components/RunningTimer'
import { createTimer, finishTimer, gun } from '../constants/Data'
import { dayHeaders, elapsedTime, sayDay, secondsToString, sumProjectTimers } from '../constants/Functions'
import { trimSoul } from '../constants/Store'
import { isRunning } from '../constants/Validators'
import useCounter from '../hooks/useCounter'
import { projectlink, projectsListLink } from '../routes/routes'
import { Title, SubTitle } from '../components/Title'
import { Link } from '../components/Link'
import { Button } from '../components/Button'
import { Header, SubHeader } from '../components/Header'

const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  listClass: {
    flexGrow: 1,
    maxWidth: 500,
    minWidth: 350,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}))

export default function TimerScreen() {
  const [online, setOnline] = useState(false)
  const [projects, setProjects] = useState([])
  const [timers, setTimers] = useState([])
  const [runningTimer, setRunningTimer] = useState('')
  const { count, setCount, start, stop } = useCounter(1000, false)
  const classes = useStyles();

  useEffect(() => {
    gun.get('projects').map().on((projectValue, projectKey) => {
      console.log(projectValue)
      setProjects(projects => [...projects, [projectKey, projectValue]])
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
    let currentTimers = []
    gun.get('timers').map().on((timerGunId, projectKey) => {
      gun.get('timers').get(projectKey).map().on((timerValue, timerKey) => {
        const foundTimer = [timerKey, trimSoul(timerValue)]
        if (foundTimer[1].status === 'done') {
          let check = currentTimers.some(id => id === foundTimer[0])
          if (!check) {
            console.log('Adding Timer', foundTimer)
            setTimers(timers => [...timers, foundTimer])
          }
          currentTimers.push(foundTimer[0])
        }
        else {
          gun.get('running').get('timer').put(JSON.stringify(foundTimer))
        }
      })
    }, { change: true })
    return () => gun.get('timers').off()
  }, [online]);

  return (
    <Grid className={classes.content} >
      <SubHeader title='Timeline' buttonLink={projectsListLink()} buttonText='Projects' />
      {isRunning(runningTimer) ? <RunningTimer project={runningTimer[1].project} count={count} stop={() => { finishTimer(runningTimer); stop() }} /> : ''}

      <Grid >
        {sumProjectTimers(dayHeaders(timers.sort((a, b) => new Date(b[1].created) - new Date(a[1].created)))).map(day => {
          return (
            <Grid className={classes.listClass}>
              <SubTitle>{sayDay(day.title)}</SubTitle>
              {day.data.map(item => projects.map(project => {
                if (item.status === 'running') return (null)
                if (project[0] === item.project) {
                  return (
                    <UnEvenGrid values={[
                      <Link to={projectlink(item.project)}>
                        <Title variant='h6' color={project[1].color} name={project[1].name} />
                      </Link>,
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          if (isRunning(runningTimer)) { finishTimer(runningTimer); stop() };
                          createTimer(item.project)
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