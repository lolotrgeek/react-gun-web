import React, { useState, useEffect } from 'react'
import { trimSoul } from '../constants/Functions'
import { getTimers } from '../Data/Data'
import { timerlink } from '../routes/routes'
import { useStyles } from '../themes/DefaultTheme'
import TimerList from '../components/templates/TimerList'
import { timersHandler } from '../Data/Handlers'
import * as chain from '../Data/Chains'
import messenger from '../constants/Messenger'

const debug = false

export default function TimerScreen({ useParams, useHistory }) {
  const [online, setOnline] = useState(false)
  const [timers, setTimers] = useState([])
  const classes = useStyles()

  useEffect(() => {
    messenger.addListener(chain.timers(), event => timersHandler({ timers, setTimers }))
    getTimers()
  }, [online]);

  return (
    <TimerList
      classes={classes}
      timers={timers}
      timerlink={timerlink}
    />
  )
}