import React, { useState, useEffect } from 'react'
import { trimSoul } from '../constants/Functions'
import { gun } from '../constants/Data'
import { timerlink } from '../routes/routes'
import { useStyles } from '../themes/DefaultTheme'
import TimerList from '../components/templates/TimerList'
import { getTimers } from '../constants/Effects'

const debug = false

export default function TimerScreen({useParams, useHistory}) {
  const [online, setOnline] = useState(false)
  const [timers, setTimers] = useState([])
  const [current, setCurrent] = useState([])
  const classes = useStyles()

  useEffect(() => getTimers({setCurrent, current, setTimers }), [online]);

  return (
    <TimerList
      classes={classes}
      timers={timers}
      timerlink={timerlink}
    />
  )
}