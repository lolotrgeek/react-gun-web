import Heartbeat from './HeartbeatModule';
import { NativeEventEmitter } from 'react-native';
import { finishTimer, createTimer, createProject } from '../constants/Data'
import { gun } from '../constants/Store.native'
import { isTimer, projectValid, isRunning } from '../constants/Validators'
import { setHeartBeat, setProject, setTimer, store, setStatus } from './store'

const deviceEmitter = new NativeEventEmitter(Heartbeat)
const debug = true

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

const setTitle = (runningProject) => {
  Heartbeat.configService(
    projectValid(runningProject) && runningProject[1].status !== 'deleted' ?
      runningProject[1].name : 'Running Timer'
  )
}

/**
 * Task for heartbeat service to sync timers
 */
const DataTask = async (name, log) => {
  let state = store.getState()
  let runningTimer = state.App.timer
  let runningProject = state.App.project

  // Local
  // FIX triggers remote 'on' listener and triggers actionRemote
  // inefficient and introduces circular logic
  deviceEmitter.addListener("ACTION", event => {
    console.log('Action: ', event)
    Heartbeat.getCountStatus(status => {
      if (status === 'RUNNING' && isTimer(runningTimer)) start(runningTimer)
      else stop(runningTimer)
    })
  })

  // Remote
  gun.get('running').on((runningTimer, runningTimerKey) => {
    if (runningTimer && isRunning(runningTimer)) {
      gun.get('projects').get(runningTimer[1].project).on((projectValue, projectKey) => {
        debug && console.log('SERVICE: Running Project Found', projectValue)
        setTitle(runningProject)
        store.dispatch(setProject([projectKey, projectValue]))
      })
      console.log(' SERVICE: Starting from remote...')
      store.dispatch(setTimer([runningTimer.id, runningTimer]))
      Heartbeat.startActionRemote()
    } else {
      console.log('SERVICE: Stopping from remote...')
      Heartbeat.stopActionRemote()
    }
  })

  // Cleanup
  deviceEmitter.addListener("STATUS", event => {
    if (event === 'STOPPED') {
      debug && console.log('SERVICE: Removing Listeners')
      gun.get('running').off()
      gun.get('projects').off()
      deviceEmitter.removeAllListeners('ACTION')
      deviceEmitter.removeAllListeners('STATUS')
    }
  })

};
export default DataTask
