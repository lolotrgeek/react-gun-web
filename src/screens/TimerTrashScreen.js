import React, { useState, useEffect, useContext } from 'react'
import { trimSoul } from '../constants/Functions'
import { gun, restoreTimer } from '../constants/Data'
import { useStyles } from '../themes/DefaultTheme'
import { PopupContext } from '../contexts/PopupContext'
import { useAlert } from '../hooks/useAlert'
import { projectlink } from '../routes/routes'
import TrashList from '../components/templates/TrashList'

export default function TimerTrashScreen({useParams, useHistory}) {
  const { projectId } = useParams()
  const [online, setOnline] = useState(false)
  const [alerted, setAlert] = useState([])
  const [timers, setTimers] = useState([])
  const [project, setProject] = useState([])
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
    gun.get('projects').get(projectId).on((projectValue, projectKey) => {
      console.log(projectValue)
      setProject([projectKey, trimSoul(projectValue)])
    }
      , { change: true })
    return () => gun.get('projects').off()
  }, [online])

  useEffect(() => {
    let currentTimers = []
    gun.get('timers').get(projectId).map().on((timerValue, timerKey) => {
      if (timerValue) {
        const foundTimer = [timerKey, trimSoul(timerValue)]
        if (foundTimer[1].status === 'deleted') {
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

  const openPopup = () => dispatch({ type: "open" });
  const closePopup = () => dispatch({ type: "close" });

  function restoreTimerAction(timer) { 
    restoreTimer([timer[0], timer[1]])
    closePopup()
    history.push(projectlink(timer[1].project)) 
  }

  return (
    <TrashList
      classes={classes}
      history={history}
      timers={timers}
      project={project}
      restoreButton={openPopup}
      popupAccept={restoreTimerAction}
      popupReject={closePopup}
    />
  )
}
