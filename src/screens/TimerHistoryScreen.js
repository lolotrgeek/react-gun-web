import React, { useState, useEffect, useContext, useRef } from 'react'
import { useParams, useHistory } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { gun, finishTimer, createTimer } from '../constants/Data'
import { isRunning, nameValid, isTimer } from '../constants/Validators'
import { elapsedTime, fullDate, secondsToString, totalTime, simpleDate } from '../constants/Functions'
import useCounter from '../hooks/useCounter'
import SpacingGrid, { UnEvenGrid, EvenGrid } from '../components/Grid'
import { Grid, Typography, CardContent, CardActions } from '@material-ui/core/'
import { RunningTimer } from '../components/RunningTimer'
import { timerlink } from '../routes/routes'
import { Title } from '../components/Title'
import { Link } from '../components/Link'
import { Button } from '../components/Button'
import { useStyles } from '../themes/DefaultTheme'
import { SubHeader } from '../components/Header'
import Popup from '../components/Popup'
import { PopupContext } from '../contexts/PopupContext'
import { useAlert } from 'react-alert'
import { projectsListLink, projectlink } from '../routes/routes'
import { MoodDisplay, EnergyDisplay, TimePeriod } from '../components/TimerDisplay'
import Stateless from '../components/Stateless'
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Card from '@material-ui/core/Card';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FilterListIcon from '@material-ui/icons/FilterList';

export default function TimerHistoryScreen() {
  const { projectId, timerId } = useParams()
  const [online, setOnline] = useState(false)
  const [alerted, setAlert] = useState([])
  const [edits, setEdits] = useState([])
  const [timer, setTimer] = useState([])
  const [project, setProject] = useState([])
  const [runningTimer, setRunningTimer] = useState('')
  const { count, setCount, start, stop } = useCounter(1000, false)
  const alert = useAlert()
  let history = useHistory()
  let { state, dispatch } = useContext(PopupContext)
  const classes = useStyles();


  useEffect(() => {
    if (alerted && alerted.length > 0) {
      alert.show(alerted[1], {
        type: alerted[0]
      })
    }
    return () => alerted
  }, [alerted])
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

  useEffect(() => {
    gun.get('projects').get(projectId).on((projectValue, projectKey) => {
      console.log(projectValue)
      setProject([projectKey, projectValue])
    }
      , { change: true })
    return () => gun.get('projects').off()
  }, [timer])

  useEffect(() => {
    console.log('Getting: ', projectId, timerId)
    gun.get('timers').get(projectId, ack => {
      if (ack.err || !ack.put) setAlert(['Error', 'No Project Exists'])
    }).get(timerId, ack => {
      if (ack.err || !ack.put) setAlert(['Error', 'No Timer Exists'])
    }).on((timerValue, timerGunId) => {
      if (!timerValue) {
        setAlert(['Error', 'No Timer Exists'])
        history.push((projectlink(projectId)))
      }
      let foundTimer = [timerId, trimSoul(timerValue)]
      setTimer(foundTimer)

    }, { change: true })
    return () => gun.get('timers').off()
  }, [online]);


  useEffect(() => {
    gun.get('history').get('timers').get(projectId).get(timerId).map().on((timerValue, timerGunId) => {
      setEdits(timers => [...timers, [timerId, trimSoul(timerValue), timerGunId]])
    }, { change: true })
    return () => gun.get('timers').off()
  }, [online]);

  const displayStatusTitle = timer => {
    if (timer[1].edited || timer[1].edited.length > 0) return 'Edit'
    if (timer[1].status === 'running') return 'Start'
    if (timer[1].status === 'done') return 'End'

  }
  const displayStatusDate = edit => {
    if (edit[1].edited || edit[1].edited.length > 0) return fullDate(new Date(edit[1].edited))
    if (edit[1].status === 'running') return fullDate(new Date(edit[1].created))
    if (edit[1].status === 'done') return fullDate(new Date(edit[1].ended))

  }
  const displayStatus = edit => {
    console.log(edit[1].edited.length)
    if (edit[1].status === 'running') return 'Start Entry'
    else if (JSON.stringify(edit[1]) === JSON.stringify(timer[1])) return 'Current Entry'
    else if (edit[1].status === 'done' && edit[1].edited.length === 0) return 'End Entry'
    else if (edit[1].status === 'done' && edit[1].edited.length > 0) return 'Edit Entry'
    else return false
  }

  const restoreEdit = edit => {
    if(JSON.stringify(edit[1]) === JSON.stringify(timer[1])) return false
    else if (edit[1].status === 'done') return true
    else return false
  }
  return (
    <Grid className={classes.Content} container direction='column' justify='center' alignItems='center'>
      {project && project[1] ?
        <SubHeader
          color={project[1].color}
          title={nameValid(project[1].name) ? project[1].name : ''}
        />
        : <Stateless />}

      <Typography className={classes.spaceBelow} variant='h4'> {timer[1] && nameValid(timer[1].name) && isTimer(timer) ? timer[1].name : ' Timer History '}</Typography>


      {edits.map((edit) => {
        let started = new Date(edit[1].started)
        let ended = new Date(edit[1].ended)
        return (
          <Card key={edit[0]} className={classes.card}>
            <CardContent>
              <Grid container direction='row' justify='center' alignItems='flex-start'>
                <Grid item xs={12}><Typography variant='h6'>{displayStatusDate(edit)}</Typography></Grid>
              </Grid>
              <Grid container direction='row' justify='center' alignItems='flex-start'>
                <Grid item xs={12}>
                  <Typography variant='subtitle1'>{displayStatus(edit)}</Typography>
                </Grid>
              </Grid>
              <Grid className={classes.space3} container direction='row' justify='space-evenly' alignItems='flex-start'>
                <Grid item xs={3}><TimePeriod start={started} end={ended} /></Grid>
                <Grid item xs={1}><EnergyDisplay energy={edit[1].energy} /></Grid>
                <Grid item xs={1}><MoodDisplay mood={edit[1].mood} /></Grid>
                <Grid item xs={2}>{secondsToString(totalTime(started, ended))}</Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Grid container direction='row' justify='center' alignItems='flex-start'>

                {restoreEdit(edit) === true ? <Button variant='contained' color='primary' size="small" onClick={() => {

                }}> Restore </Button> : ''}

              </Grid>

            </CardActions>
          </Card>
        )
      })}

    </Grid >
  )
}
