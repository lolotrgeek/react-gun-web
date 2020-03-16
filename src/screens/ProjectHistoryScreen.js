import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import useCounter from '../hooks/useCounter'
import { isRunning, isTimer } from '../constants/Validators'
import { elapsedTime, fullDate } from '../constants/Functions'
import { trimSoul } from '../constants/Store'
import { gun, finishTimer, createProject, createTimer, updateProject } from '../constants/Data'
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

export default function ProjectHistory() {
  const { projectId, } = useParams()
  const [online, setOnline] = useState(false)
  const [project, setProject] = useState([])
  const [timers, setTimers] = useState([])
  const [edits, setEdits] = useState([])
  const [runningTimer, setRunningTimer] = useState('')
  const { count, setCount, start, stop } = useCounter(1000, false)
  const classes = useStyles();
  let history = useHistory()

  useEffect(() => {
    let filteredTimers = timers.filter(timer => timer[0] !== runningTimer[0])
    setTimers(filteredTimers)
  }, [runningTimer])

  useEffect(() => {
    gun.get('projects').get(projectId).on((projectValue, projectGunKey) => {
      setProject([projectId, trimSoul(projectValue)])
    }, { change: true })
    return () => gun.get('projects').off()
  }, [online]);

  useEffect(() => {
    gun.get('history').get('projects').get(projectId).map().on((projectValue, projectGunKey) => {
      console.log('History ', projectValue)
      setEdits(edits => [...edits, [projectId, trimSoul(projectValue), projectGunKey]])
    }, { change: true })
    return () => gun.get('history').off()
  }, [online]);

  useEffect(() => {
    let currentTimers = []
    gun.get('timers').get(projectId).map().on((timerValue, timerKey) => {
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
    }, { change: true })

    return () => gun.get('timers').off()
  }, [online]);

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
  }, [online]);

  return (
    <Grid className={classes.content}>
      <SubHeader
        className={classes.space}
        title={projectValid(project) ? `${project[1].name} History` : 'Project History'}
        buttonClick={() => {
          // history.push(projectEditlink(project[0]))
          updateProject(project, {name: project[1].name + '1', color: '#000'})
        }}
        buttonText='Edit'
      />
      {/* <Grid className={classes.listClass} container direction='row' justify='center' alignItems='flex-start'>
        <Typography variant='h6'>
        started : {projectValid(project) && project[1].started ? fullDate(new Date(project[1].started)) : ''}
        </Typography>
      </Grid> */}
      {/* {isRunning(runningTimer) ?
        <RunningTimer
          className={classes.space}
          name={runningProject[1] ? runningProject[1].name : ''}
          color={runningProject[1] ? runningProject[1].color : ''}
          count={count}
          stop={() => { finishTimer(runningTimer); stop() }}
        />
        : ''} */}
      <Grid className={classes.space}>
        {edits.map(edit => {
          return (
            <Grid key={edit[2]} className={classes.listClass}>
              <Link to={projectlink(edit[0])}>
                {edit.length === 3 ? <Title color={edit[1].color} variant='h6' >
                  {edit.length === 3 ? edit[1].name : ''}
                </Title>
                  : ''}
              </Link>
              {edit[1].edited ?
                <UnEvenGrid
                  values={[
                    <Typography>{fullDate(new Date(edit[1].edited))}</Typography>,
                    <Button variant="contained" color="primary" onClick={() => {

                    }}>Restore</Button>
                  ]}
                />
                // <Grid container direction='row' justify='space-evenly' alignItems='flex-start'>
                //   <Grid item xs>
                //     <Typography>{fullDate(new Date(edit[1].edited))}</Typography>
                //   </Grid>
                //   <Grid item xs>
                //     <Button variant="contained" color="primary" onClick={() => {

                //     }}>Restore</Button>
                //   </Grid>
                // </Grid>
                : <UnEvenGrid values={['Current']} />}
            </Grid>
          )
        })}
      </Grid>
    </Grid >
  )
}