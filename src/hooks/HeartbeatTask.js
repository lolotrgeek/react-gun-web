import Heartbeat from './HeartbeatModule'
import { setHeartBeat, store } from './store'
import { gun } from '../constants/Store.native'
import { isRunning } from '../constants/Validators'
import { finishTimer } from '../constants/Data'

const debug = true

const HeartbeatTask = async (timer) => {

  let state = store.getState()

  gun.get('running').once((runningTimer, runningTimerKey) => {
    if (!runningTimer || runningTimer.id === 'none') {
      debug && console.log('running Timer not Found')
      Heartbeat.stopService()
      return false
    }
    if (isRunning([runningTimer.id, runningTimer])) {
      debug && console.log('Running Timer Found: ', [runningTimer.id, runningTimer])
      gun.get('projects').get(runningTimer.project).once((projectValue, projectKey) => {
        debug && console.log('Running Project Found', projectValue)
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

export default HeartbeatTask