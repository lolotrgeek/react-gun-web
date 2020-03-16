import React, { useState, useEffect } from 'react'
import { trimSoul } from '../constants/Store'
import { elapsedTime } from '../constants/Functions'
import { isRunning } from '../constants/Validators'
import { gun, finishTimer } from '../constants/Data'
import useCounter from '../hooks/useCounter'
import SpacingGrid from '../components/Grid'
import { Grid } from '@material-ui/core/'
import { timerlink } from '../routes/routes'
import { RunningTimer } from '../components/RunningTimer'
import { Title } from '../components/Title'
import { Link } from '../components/Link'
import { Button } from '../components/Button'
import { useStyles } from '../themes/DefaultTheme'
import Stateless from '../components/Stateless'
import { useHistory } from 'react-router-dom'
import {SubHeader} from '../components/Header'

export default function TimerScreen() {
  const [online, setOnline] = useState(false)
  const [timers, setTimers] = useState([])
  const classes = useStyles()
  const history = useHistory()


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
    <Grid className={classes.listRoot}>
      {timers && timers.length > 0 ?
        <SubHeader className={classes.space} title='All Timers'/> :
        <Stateless />
      }
      <Grid>
        {timers.map(timer => {
          console.log(timer[0])
          return (
            <Link to={timerlink(timer[1].project, timer[0])}>
              <SpacingGrid values={Object.values(timer[1])}></SpacingGrid>
            </Link>
          )
        })}
      </Grid>
    </Grid >
  )
}