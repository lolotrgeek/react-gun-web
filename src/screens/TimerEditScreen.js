import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { gun, createTimer } from '../constants/Data'
import SpacingGrid from '../components/Grid'

export default function TimerEditScreen() {
  const { projectId, timerId } = useParams()
  const [online, setOnline] = useState(false)
  // const [timer, setTimer] = useState([])
  const [key, setKey] = useState('')
  const [created, setCreated] = useState('')
  const [ended, setEnded] = useState('')
  const [start, setStart] = useState('');
  const [stop, setStop] = useState('');
  const [mood, setMood] = useState('')
  const [energy, setEnergy] = useState(0)

  useEffect(() => {
    gun.get('timers').get(projectId).get(timerId).on((timerValue, timerGunId) => {
      let timer = [timerId, trimSoul(timerValue), timerGunId]
      setCreated(timer[1].created)
      setEnded(timer[1].ended)
      setStart(timer[1].created)
      setStop(timer[1].ended)
      setMood(timer[1].mood)
      setEnergy(timer[1].energy)
    }, { change: true })
    return () => gun.get('timers').off()
  }, [online]);

  return (
    <div>
      <h2>Timer Edit {projectId}/{timerId} </h2>
      <div>
        <Link to={`/timer/${timerId}`}>
          <SpacingGrid values={[created, ended, mood, energy]}></SpacingGrid>
        </Link>
      </div>
    </div >
  )
}
