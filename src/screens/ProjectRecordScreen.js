import React, { useState, useEffect, useContext } from 'react'
import { useParams, useHistory } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { dayHeaders, elapsedTime, simpleDate, timeString, sayDay, totalTime, secondsToString } from '../constants/Functions'
import useCounter from '../hooks/useCounter'
import { gun, createProject, finishTimer, createTimer, deleteProject } from '../constants/Data'
import { isRunning, isTimer } from '../constants/Validators'
import { UnEvenGrid } from '../components/Grid'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import { MoodDisplay, EnergyDisplay, TimePeriod } from '../components/TimerDisplay'
import { RunningTimer } from '../components/RunningTimer'
import { projectsListLink, projectEditlink, timerlink } from '../routes/routes'
import { Title, SubTitle } from '../components/Title'
import { Link } from '../components/Link'
import { Button } from '../components/Button'
import { SubHeader } from '../components/Header'
import { useAlert } from 'react-alert'
import SideMenu from '../components/SideMenu'
import Popup from '../components/Popup'
import { PopupContext } from '../contexts/PopupContext'

const useStyles = makeStyles(theme => ({
  listClass: {
    flexGrow: 1,
    maxWidth: 500,
    minWidth: 350,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}));

export default function ProjectRecordScreen() {
  const { projectId, } = useParams()
  const [online, setOnline] = useState(false)
  const [project, setProject] = useState([])
  const [timers, setTimers] = useState([])
  const [deleted, setDeleted] = useState(false)
  const [alerted, setAlert] = useState([])
  const [runningTimer, setRunningTimer] = useState('')
  const { count, setCount, start, stop } = useCounter(1000, false)
  const classes = useStyles();
  const alert = useAlert()
  let history = useHistory()
  let { state, dispatch } = useContext(PopupContext)


  useEffect(() => {
    if (alerted && alerted.length > 0) {
      alert.show(alerted[1], {
        type: alerted[0]
      })
    }
    return () => alerted
  }, [alerted])

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
    let currentTimers = []
    gun.get('timers').get(projectId).map().on((timerValue, timerKey) => {
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
    }, { change: true })

    return () => gun.get('timers').off()
  }, [online]);

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
  }, [online]);

  const removeProject = () => {
    deleteProject(project)
    setAlert(['Success', 'Timer Deleted!'])
    closePopup()
    history.push((projectsListLink()))
  }

  const openPopup = () => dispatch({ type: "open" });
  const closePopup = () => dispatch({ type: "close" });
  return (
    <Grid>
      <Popup content='Confirm Delete?' onAccept={() => removeProject()} onReject={() => closePopup()} />
      {project && project[1] ?
        <SubHeader
          color={project[1].color}
          title={project[1].name}
          buttonText='Start Timer'
          buttonClick={() => {
            if (isRunning(runningTimer)) { stop(); finishTimer(runningTimer) }
            createTimer(projectId)
          }}
        /> : ''}
      <SideMenu
        options={[{ name: 'delete', action: () => openPopup() }, { name: 'edit', action: () => history.push(projectEditlink(projectId)) }, { name: 'history' }, { name: 'archive' }]}
      />
      {isRunning(runningTimer) ? <RunningTimer project={runningTimer[1].project} count={count} stop={() => { finishTimer(runningTimer); stop() }} /> : ''}
      {/* <SpacingGrid headers={['Started', 'Ended', 'Energy', 'Mood']} /> */}
      {dayHeaders(timers.sort((a, b) => new Date(b[1].created) - new Date(a[1].created))).map(day => {
        return (
          <Grid className={classes.listClass} >
            <SubTitle>{sayDay(day.title)}</SubTitle>
            {/* {console.log(day.data)} */}
            {day.data.map(timer => {
              console.log(timer)
              if (!isTimer(timer)) return (null)
              if (timer[1].status === 'running') return (null)
              let ended = new Date(timer[1].ended)
              let created = new Date(timer[1].created)
              return (
                <Link to={timerlink(projectId, timer[0])}>
                  <UnEvenGrid
                    values={[
                      // simpleDate(creation),
                      // timeString(new Date(timer[1].created)) ,'-', timeString(new Date(timer[1].ended)),
                      <TimePeriod start={created} end={ended} />,
                      <EnergyDisplay energy={timer[1].energy} />,
                      <MoodDisplay mood={timer[1].mood} />,
                      secondsToString(totalTime(created, ended)),
                    ]} />
                </Link>
              )


            })}
          </Grid>
        )
      })}
    </Grid >
  )
}