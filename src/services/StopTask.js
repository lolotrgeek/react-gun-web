import Heartbeat from './HeartbeatModule'
import { setHeartBeat, store } from './store'
import { gun } from '../constants/Store.native'
import { isRunning } from '../constants/Validators'
import { finishTimer, createTimer } from '../constants/Data'

const debug = true

const StopTask = async () => {
  let state = store.getState()
  let projectId
  let runningTimer

  Heartbeat.getStatus(status => {
    console.log(status)
    if(status === 'STOPPED') {
      finishTimer(runningTimer)
    } 
    else if (status === 'STARTED' && !runningTimer) {
      debug && console.log('Creating...')
      createTimer(projectId)
    }
  })

  gun.get('running').once((runningTimer, runningTimerKey) => {
    if (!runningTimer || runningTimer.id === 'none') {
      debug && console.log('running Timer not Found')
      Heartbeat.stopService()
      return false
    }
    if (isRunning([runningTimer.id, runningTimer])) {
      runningTimer = [runningTimer.id, runningTimer]
      debug && console.log('Running Timer Found: ', runningTimer)
      gun.get('projects').get(runningTimer.project).once((projectValue, projectKey) => {
        debug && console.log('Running Project Found', projectValue)
        projectId = projectKey
        Heartbeat.configService(
          projectValue && typeof projectValue === 'object' && projectValue.status !== 'deleted' ?
            projectValue.name : 'Running Timer'
        )
      })

    }
  })

  store.dispatch(setHeartBeat(state.App.heartBeat + 1))
  let tick = state.App.heartBeat
  debug && console.log('STATE: ', state.App, typeof state.App)
  
  Heartbeat.notificationUpdate(tick.toString())

  // return () => gun.off()
};

export default StopTask