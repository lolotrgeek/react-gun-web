import React, { useState, useEffect } from 'react'
import { trimSoul } from '../constants/Store'
import { gun } from '../constants/Data'
import { timerlink } from '../routes/routes'
import { useStyles } from '../themes/DefaultTheme'
import { useHistory } from 'react-router-dom'
import TimerList from '../components/templates/TimerList'

export default function TimerScreen() {
  const [online, setOnline] = useState(false)
  const [timers, setTimers] = useState([])
  const classes = useStyles()

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
    <TimerList
      classes={classes}
      timers={timers}
      timerlink={timerlink}
    />
  )
}