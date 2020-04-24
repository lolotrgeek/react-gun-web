import Heartbeat from './HeartbeatModule'
import { setHeartBeat, setProject, setTimer, store } from './store'
import { doneTimer, cloneTimer } from '../constants/Models'
import { isRunning, multiDay, newEntryPerDay } from '../constants/Functions'
import { gun } from '../constants/Store'
// import { createTimer } from '../constants/Data'
import { NativeEventEmitter } from 'react-native'

const deviceEmitter = new NativeEventEmitter
const debug = true

export const addTimer = (projectId, value) => {
  const timer = cloneTimer(value)
  debug && console.log('Storing Timer', timer)
  gun.get('history').get('timers').get(projectId).get(timer[0]).set(timer[1])
  gun.get('timers').get(projectId).get(timer[0]).put(timer[1])
}

const endTimer = (timer) => {
  debug && console.log('Ending', timer)
  gun.get('history').get('timers').get(timer[1].project).get(timer[0]).set(timer[1])
  gun.get('timers').get(timer[1].project).get(timer[0]).put(timer[1])
}

const finishTimer = (timer) => {
  if (isRunning(timer)) {
    debug && console.log('Finishing', timer)
    let done = doneTimer(timer)
    gun.get('running').put({ id: 'none' })
    // Danger zone until endTimer is called
    if (multiDay(done[1].started, done[1].ended)) {
      const dayEntries = newEntryPerDay(done[1].started, done[1].ended)
      dayEntries.map((dayEntry, i) => {
        let splitTimer = done
        splitTimer[1].started = dayEntry.start
        splitTimer[1].ended = dayEntry.end
        debug && console.log('Split', i, splitTimer)
        if (i === 0) { endTimer(splitTimer) } // use initial timer id for first day
        else { addTimer(splitTimer[1].project, splitTimer[1]) }
        return splitTimer
      })
    } else {
      endTimer(done)
    }
  } else { return timer }
}


const HeartbeatTask = async () => {
  let state = store.getState()
  let runningTimer =  state.App.timer
  let runningProject = state.App.project

  if (deviceEmitter) {
    deviceEmitter.addListener("ACTION", event => {
      console.log('ACTION Event: ', event)
      if (event === 'stop' && runningTimer.length === 2) {
        finishTimer(runningTimer)
        Heartbeat.stopService()
      }
    })
  }
  // Heartbeat.getStatus(status => {
  //   debug && console.log(status)
  //   if (status === 'STOPPED') {
  //     finishTimer(runningTimer)
  //   }
  //   else if (status === 'STARTED' && !runningTimer) {
  //     debug && console.log('Creating...')
  //     createTimer(state.App.projectId)
  //   }
  // })

  gun.get('running').once((runningTimer, runningTimerKey) => {
    if (!runningTimer || runningTimer.id === 'none') {
      debug && console.log('running Timer not Found')
      Heartbeat.stopService()
      return false
    }
    store.dispatch(setTimer([runningTimer.id, runningTimer]))
  })

  if (isRunning(runningTimer)) {
    debug && console.log('Running Timer Found: ', runningTimer)
    gun.get('projects').get(runningTimer[1].project).once((projectValue, projectKey) => {
      debug && console.log('Running Project Found', projectValue)
      store.dispatch(setProject(projectValue))
    })
  }

  Heartbeat.configService(
    runningProject && typeof runningProject === 'object' && runningProject.status !== 'deleted' ?
    runningProject.name : 'Running Timer'
  )

  store.dispatch(setHeartBeat(state.App.heartBeat + 1))
  let tick = state.App.heartBeat
  debug && console.log('STATE: ', state.App, typeof state.App)

  Heartbeat.notificationUpdate(tick.toString())

  // return () => gun.off()
};

export default HeartbeatTask