import Gun from 'gun/gun'
import { newTimer, updateProject, updateTimer } from '../constants/Models'


const port = '8765'
const address = 'localhost'
const peers = [`http://${address}:${port}/gun`]

export const gun = new Gun({
  peers: peers,
})


export const stopTimer = (timer) => {
  let doneTimer = timer
  doneTimer[1].status = 'done'
  updateTimer(doneTimer)
  gun.get('history').get('timers').get(doneTimer[1].project).get(doneTimer[0]).set(doneTimer[1])
  gun.get('timers').get(doneTimer[1].project).get(doneTimer[0]).put(doneTimer[1])
  gun.get('running').get('timer').put(null)

}

export const createTimer = (projectId) => {
  const timer = newTimer({ project: projectId })
  gun.get('running').get('timer').put(JSON.stringify(timer))
  gun.get('history').get('timers').get(projectId).get(timer[0]).set(timer[1])
  gun.get('timers').get(projectId).get(timer[0]).put(timer[1])
}



export const createProject = (project, projectId) => {
  const projectNew = updateProject(project)
  gun.get('history').get('projects').get(projectId).set(projectNew[1])
  gun.get('projects').get(projectId).set(projectNew[1])
}