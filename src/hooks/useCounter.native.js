import React, { useEffect, useState } from 'react'
import { NativeEventEmitter } from 'react-native'
import Heartbeat from './HeartbeatModule'
import { createTimer, finishTimer } from '../constants/Data'


const debug = true
const deviceEmitter = new NativeEventEmitter

export default function useCounter(countdown) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (deviceEmitter) {
      debug && console.log('listening...')
      deviceEmitter.addListener("Heartbeat", event => {
        debug && console.log('device Event: ', event)
        if (event) setCount(event)
      })
      deviceEmitter.addListener("STATUS", event => {
        debug && console.log('STATUS Event: ', event)
      })
    }
    return () => { setCount(0); console.log('stop listening') }
  }, [])


  const start = timer => {
    createTimer(timer)
    Heartbeat.startService()
  }
  const stop = timer => {
    finishTimer(timer)
    Heartbeat.stopService()
  }
  const reset = (timer) => { stop(timer); setCount(0) }

  return { count, setCount, start, stop, reset };
}