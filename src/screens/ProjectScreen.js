import React, { useState, useEffect } from 'react'
import useCounter from '../hooks/useCounter'
import { isRunning } from '../constants/Validators'
import { elapsedTime } from '../constants/Functions'
import { trimSoul } from '../constants/Store'
import { gun, finishTimer, createTimer } from '../constants/Data'
import SpacingGrid, { UnEvenGrid } from '../components/Grid'
import { Grid, TextField, makeStyles, Divider } from '@material-ui/core/'
import { projectValid } from '../constants/Validators'
import { projectEditlink, projectCreatelink, projectlink } from '../routes/routes'
import { Title } from '../components/Title'
import { Link } from '../components/Link'
import { Button } from '../components/Button'
import { Header, SubHeader } from '../components/Header'
import{ RunningTimer} from '../components/RunningTimer'

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
}));

export default function ProjectCreateScreen() {
  const [online, setOnline] = useState(false)
  const [projects, setProjects] = useState([])
  const [runningTimer, setRunningTimer] = useState('')
  const { count, setCount, start, stop } = useCounter(1000, false)
  const classes = useStyles();

  useEffect(() => {
    gun.get('projects').map().on((projectValue, projectKey) => {
      console.log(projectValue)
      setProjects(projects => [...projects, [projectKey, projectValue]])
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

  return (
    <Grid className={classes.content}>
      <SubHeader title='Projects' buttonLink={projectCreatelink()} buttonText='New Project' />
      {isRunning(runningTimer) ? <RunningTimer project={runningTimer[1].project} count={count} stop={() => { finishTimer(runningTimer); stop() }} /> : ''}

      <Grid className={classes.listClass}>
        {projects.map(project => {
          return (
            <UnEvenGrid
              values={[
                <Link to={projectlink(project[0])} >
                  <Title
                    color={project[1].color}
                    name={projectValid(project) ? project[1].name : ''}
                    variant='h6'
                  />
                </Link>,
                <Button variant="contained" color="primary" onClick={() => {
                  if (isRunning(runningTimer)) { finishTimer(runningTimer); stop() };
                  createTimer(project[0])
                }}>Start</Button>
                
              ]}
            />
          )
        })}
      </Grid>
    </Grid>

  )
}