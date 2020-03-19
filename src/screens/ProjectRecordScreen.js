import React, { useState, useEffect, useContext } from 'react'
import { useParams, useHistory } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { dayHeaders, elapsedTime, simpleDate, timeString, sayDay, totalTime, secondsToString } from '../constants/Functions'
import useCounter from '../hooks/useCounter'
import { gun, createProject, finishTimer, createTimer, deleteProject } from '../constants/Data'
import { isRunning, isTimer } from '../constants/Validators'
import { UnEvenGrid } from '../components/Grid'
import Grid from '@material-ui/core/Grid'
import { MoodDisplay, EnergyDisplay, TimePeriod } from '../components/TimerDisplay'
import { RunningTimer } from '../components/RunningTimer'
import { projectsListLink, projectEditlink, projectHistorylink, timerlink, timerRunninglink, timerTrashlink } from '../routes/routes'
import { Title, SubTitle } from '../components/Title'
import { Link } from '../components/Link'
// import { Button } from '../components/Button'
import { SubHeader } from '../components/Header'
import { useAlert } from 'react-alert'
import SideMenu from '../components/SideMenu'
import Popup from '../components/Popup'
import { PopupContext } from '../contexts/PopupContext'
import { useStyles } from '../themes/DefaultTheme'
import Stateless from '../components/Stateless'


export default function ProjectRecordScreen() {
  const { projectId, } = useParams()
  const [online, setOnline] = useState(false)
  const [project, setProject] = useState([])
  const [timers, setTimers] = useState([])
  const [deleted, setDeleted] = useState(false)
  const [alerted, setAlert] = useState([])
  const [runningTimer, setRunningTimer] = useState('')
  const [runningProject, setRunningProject] = useState('')
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
            history.push(timerRunninglink())
          }}
        /> : <Stateless />
      }
      <SideMenu
        options={[
          { name: 'delete', action: () => openPopup() },
          { name: 'edit', action: () => history.push(projectEditlink(projectId)) },
          { name: 'history', action: () => history.push(projectHistorylink(projectId)) },
          { name: 'trash', action: () => history.push(timerTrashlink(projectId)) }]}
      />
      {isRunning(runningTimer) ?
        <RunningTimer
          className={classes.space}
          name={runningProject[1] ? runningProject[1].name : ''}
          color={runningProject[1] ? runningProject[1].color : ''}
          count={count}
          stop={() => { finishTimer(runningTimer); stop() }}
        />
        : ''}
      {/* <SpacingGrid headers={['Started', 'Ended', 'Energy', 'Mood']} /> */}
      {dayHeaders(timers.sort((a, b) => new Date(b[1].started) - new Date(a[1].started))).map((day, index) => {
        return (
          <Grid key={index} className={classes.listClass} >
            <SubTitle>{sayDay(day.title)}</SubTitle>
            {/* {console.log(day.data)} */}
            {day.data.map(timer => {
              if (!isTimer(timer)) return (null)
              if (timer[1].status === 'running') return (null)
              let ended = new Date(timer[1].ended)
              let started = new Date(timer[1].started)
              return (
                <Link key={timer[0]} to={timerlink(projectId, timer[0])}>
                  <UnEvenGrid
                    values={[
                      // simpleDate(creation),
                      // timeString(new Date(timer[1].started)) ,'-', timeString(new Date(timer[1].ended)),
                      <TimePeriod start={started} end={ended} />,
                      <EnergyDisplay energy={timer[1].energy} />,
                      <MoodDisplay mood={timer[1].mood} />,
                      secondsToString(totalTime(started, ended)),
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