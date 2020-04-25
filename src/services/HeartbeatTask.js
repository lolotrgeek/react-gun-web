import Heartbeat from './HeartbeatModule'
import { setHeartBeat, setProject, setTimer, store, setStatus } from './store'
import { doneTimer, cloneTimer, newTimer } from '../constants/Models'
import { isRunning, multiDay, newEntryPerDay } from '../constants/Functions'
import { gun } from '../constants/Store'
import { NativeEventEmitter } from 'react-native'

const deviceEmitter = new NativeEventEmitter
const debug = true

const createTimer = (projectId) => {
  if (!projectId || typeof projectId !== 'string' || projectId.length < 9) return false
  debug && console.log('Creating Timer', projectId)
  const timer = newTimer(projectId)
  debug && console.log('Created Timer', timer)
  gun.get('running').put(timer[1])
  gun.get('history').get('timers').get(projectId).get(timer[0]).set(timer[1])
  // gun.get('timers').get(projectId).get(timer[0]).put(timer[1])
  return true
}
const addTimer = (projectId, value) => {
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

const stop = (function () {
  var executed = false;
  return function (runningTimer) {
    if (!executed) {
      executed = true;
      finishTimer(runningTimer)
    }
  };
})();

const start = (function () {
  var executed = false;
  return function (runningTimer) {
    if (!executed) {
      executed = true;
      createTimer(runningTimer[1].project)
    }
  };
})();

/**
 * Task for android service to sync and count timers 
 */
const HeartbeatTask = async () => {
  let state = store.getState()
  let runningTimer = state.App.timer
  let runningProject = state.App.project
  
  Heartbeat.configService(
    runningProject && typeof runningProject === 'object' && runningProject.status !== 'deleted' ?
      runningProject.name : 'Running Timer'
  )
  Heartbeat.notificationUpdate('Ready')

  if (deviceEmitter) {
    deviceEmitter.addListener("ACTION", event => {
      console.log('ACTION Event: ', event)
      if (event === 'stop' && runningTimer.length === 2) {
        stop(runningTimer)
        store.dispatch(setStatus('STOPPED'))
        // Heartbeat.stopService()
      }
      else if (event === 'start' && runningTimer.length === 2) {
        start(runningTimer)
        store.dispatch(setStatus('STARTED'))
        // Heartbeat.startService()
      }
    })
  }

  gun.get('running').on((runningTimer, runningTimerKey) => {
    if (!runningTimer || runningTimer.id === 'none') {
      debug && console.log('SERVICE: running Timer not Found')
      // Heartbeat.stopService()
      return false
    }
    store.dispatch(setTimer([runningTimer.id, runningTimer]))
  })

  if (isRunning(runningTimer)) {
    debug && console.log('Running Timer Found: ', runningTimer)
    gun.get('projects').get(runningTimer[1].project).on((projectValue, projectKey) => {
      debug && console.log('SERVICE: Running Project Found', projectValue)
      store.dispatch(setProject(projectValue))
    })
  }


  debug && console.log('STATE: ', state.App, typeof state.App)
  
  if(runningTimer.length === 2 && state.App.status === 'STARTED') {
    setInterval(() => {
      store.dispatch(setHeartBeat(state.App.heartBeat + 1))
      let tick = state.App.heartBeat
      debug && console.log('STATE: ', state.App, typeof state.App)
      Heartbeat.notificationUpdate(tick.toString())
    }, 1000)
  }

  
  // return () => gun.off()
};

export default HeartbeatTask