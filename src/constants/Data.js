import Gun from 'gun/gun'
import { newTimer, newProject, editedProject, doneTimer, generateNewTimer } from '../constants/Models'
import { isRunning, multiDay, newEntryPerDay } from '../constants/Functions'


const port = '8765'
const address = 'localhost'
const peers = [`http://${address}:${port}/gun`]

export const gun = new Gun({
  peers: peers,
})


export const createProject = (name, color) => {
  const project = newProject(name, color)
  gun.get('history').get('projects').get(project[0]).set(project[1])
  gun.get('projects').get(project[0]).put(project[1])
}

export const updateProject = (project, updates) => {
  const projectEdit = editedProject(project, updates)
  gun.get('history').get('projects').get(projectEdit[0]).set(projectEdit[1])
  gun.get('projects').get(projectEdit[0]).put(projectEdit[1])
}

export const deleteProject = (project) => {
  const projectDelete = project
  projectDelete[1].edited = new Date().toString()
  projectDelete[1].status = 'deleted'
  gun.get('projects').get(project[0]).put(projectDelete[1])
}
/**
 * Gemerates a new timer using the standard timer model
 * @param {*} projectId 
 */
export const createTimer = (projectId) => {
  const timer = generateNewTimer(projectId)
  gun.get('running').get('timer').put(JSON.stringify(timer))
  gun.get('history').get('timers').get(projectId).get(timer[0]).set(timer[1])
  gun.get('timers').get(projectId).get(timer[0]).put(timer[1])
}

export const runTimer = (timer) => {
  gun.get('running').get('timer').put(JSON.stringify(timer))
}

export const updateTimer = (timer) => {
  let editedTimer = timer
  editedTimer[1].edited = new Date().toString()
  console.log('Updating', editedTimer)
  gun.get('history').get('timers').get(editedTimer[1].project).get(editedTimer[0]).set(editedTimer[1])
  gun.get('timers').get(editedTimer[1].project).get(editedTimer[0]).put(editedTimer[1])
}

export const deleteTimer = (timer) => {
  console.log('Deleting', timer)
  const timerDelete = timer
  timerDelete[1].edited = new Date().toString()
  timerDelete[1].status = 'deleted'
  gun.get('timers').get(timer[1].project).get(timer[0]).put(timerDelete[1])
}

/**
 * Generates a new timer using the given timer model
 * @param {String} projectId project hashid
 * @param {Object} value a timer object
 */
export const addTimer = (projectId, value) => {
  const timer = newTimer(value)
  console.log('Storing', timer)
  gun.get('history').get('timers').get(projectId).get(timer[0]).set(timer[1])
  gun.get('timers').get(projectId).get(timer[0]).put(timer[1])
}

export const finishTimer = (timer) => {
  if (isRunning(timer)) {
    let done = doneTimer(timer)
    gun.get('running').get('timer').put(null)
    if (multiDay(done[1].created, done[1].ended)) {
      const dayEntries = newEntryPerDay(done[1].created, done[1].ended)
      dayEntries.map((dayEntry, i) => {
        let splitTimer = done
        splitTimer[1].created = dayEntry.start
        splitTimer[1].ended = dayEntry.end
        console.log('Split', i, splitTimer)
        if(i === 0) {updateTimer(splitTimer)} // use initial timer id for first day
        else {addTimer(splitTimer[1].project, splitTimer[1])}
        return splitTimer
      })
    } else {
      updateTimer(done)
    }
  } else { return timer }
}

