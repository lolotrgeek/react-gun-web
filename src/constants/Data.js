import Gun from 'gun/gun'
import { newTimer, newProject, editedProject, doneTimer } from '../constants/Models'
import { isRunning } from '../constants/Functions'


const port = '8765'
const address = 'localhost'
const peers = [`http://${address}:${port}/gun`]

export const gun = new Gun({
  peers: peers,
})


export const updateTimer = (timer) => {
  let editedTimer = timer
  gun.get('history').get('timers').get(editedTimer[1].project).get(editedTimer[0]).set(editedTimer[1])
  gun.get('timers').get(editedTimer[1].project).get(editedTimer[0]).put(editedTimer[1])
}

export const finishTimer = (timer) => {
  if (isRunning(timer)) {
    let finishedTimer = doneTimer(timer)
    gun.get('running').get('timer').put(null)
    updateTimer(finishedTimer)
  } else { return timer }
}

export const createTimer = (projectId) => {
  const timer = newTimer({ project: projectId })
  gun.get('running').get('timer').put(JSON.stringify(timer))
  gun.get('history').get('timers').get(projectId).get(timer[0]).set(timer[1])
  gun.get('timers').get(projectId).get(timer[0]).put(timer[1])
}

export const createProject = (name, color) => {
  const project = newProject(name, color)
  gun.get('history').get('projects').get(project[0]).set(project[1])
  gun.get('projects').get(project[0]).put(project[1])
}

export const updateProject = (project, projectId) => {
  const projectNew = editedProject(project)
  gun.get('history').get('projects').get(projectId).set(projectNew[1])
  gun.get('projects').get(projectId).set(projectNew[1])
}