import Gun from 'gun/gun'
import { newTimer, newProject, doneTimer, generateNewTimer } from './Models'
import { isRunning, multiDay, newEntryPerDay } from './Functions'

const port = '8765'
const address = '192.168.1.109'
const peers = [`http://${address}:${port}/gun`]

export const gun = new Gun({
  peers: peers,
})

const debug = false


/**
 * removes soul from given data
 * @param {*} data 
 */
export const trimSoul = data => {
  if (!data || !data['_'] || typeof data['_'] !== 'object') return data
  delete data['_']
  return data
}


export const createProject = (name, color) => {
  const project = newProject(name, color)
  debug && console.log('Creating', project)
  gun.get('history').get('projects').get(project[0]).set(project[1])
  gun.get('projects').get(project[0]).put(project[1])
}

export const updateProject = (project, updates) => {
  let projectEdit = project
  Object.assign(projectEdit[1], updates)
  if (projectEdit[1].deleted) { projectEdit[1].deleted = null }
  projectEdit[1].edited = new Date().toString()
  debug && console.log('Updating', projectEdit)
  gun.get('history').get('projects').get(project[0]).set(projectEdit[1])
  gun.get('projects').get(projectEdit[0]).put(projectEdit[1])
}

// explict updating for debuggin
// export const updateProject = (project, updates) => {
//   let projectEdit = project
//   projectEdit[1].name = updates.name
//   projectEdit[1].color = updates.color
//   if (projectEdit[1].deleted) { projectEdit[1].deleted = null }
//   projectEdit[1].edited = new Date().toString()
//   debug && console.log('Updating', projectEdit)
//   gun.get('history').get('projects').get(project[0]).set(projectEdit[1])
//   gun.get('projects').get(projectEdit[0]).put(projectEdit[1])
// }

export const restoreProject = (project) => {
  let restoredProject = project
  // restoredProject[1].restored = new Date().toString()
  if (restoredProject[1].status === 'deleted') {
    restoredProject[1].status = 'active'
    // gun.get('history').get('projects').get(restoredProject[0]).set(restoredProject[1])
  }
  debug && console.log('Restoring', restoredProject)
  gun.get('projects').get(restoredProject[0]).put(restoredProject[1])
}


export const deleteProject = (project) => {
  debug && console.log('Deleting', project)
  let projectDelete = project
  projectDelete[1].deleted = new Date().toString()
  gun.get('history').get('projects').get(projectDelete[0]).set(projectDelete[1])
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
  if (editedTimer[1].deleted) { editedTimer[1].deleted = null }
  editedTimer[1].edited = new Date().toString()
  debug && console.log('Updating', editedTimer)
  gun.get('history').get('timers').get(editedTimer[1].project).get(editedTimer[0]).set(editedTimer[1])
  gun.get('timers').get(editedTimer[1].project).get(editedTimer[0]).put(editedTimer[1])
}

export const restoreTimer = (timer) => {
  let restoredTimer = timer
  // restoredTimer[1].restored = new Date().toString()
  if (restoredTimer[1].status === 'deleted') {
    restoredTimer[1].status = 'done'
    gun.get('history').get('timers').get(restoredTimer[1].project).get(restoredTimer[0]).set(restoredTimer[1])
  }
  debug && console.log('Restoring', restoredTimer)
  gun.get('timers').get(restoredTimer[1].project).get(restoredTimer[0]).put(restoredTimer[1])
}

export const endTimer = (timer) => {
  debug && console.log('Ending', timer)
  gun.get('history').get('timers').get(timer[1].project).get(timer[0]).set(timer[1])
  gun.get('timers').get(timer[1].project).get(timer[0]).put(timer[1])
}

export const deleteTimer = (timer) => {
  debug && console.log('Deleting', timer)
  const timerDelete = timer
  timerDelete[1].deleted = new Date().toString()
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
  debug && console.log('Storing', timer)
  gun.get('history').get('timers').get(projectId).get(timer[0]).set(timer[1])
  gun.get('timers').get(projectId).get(timer[0]).put(timer[1])
}

export const finishTimer = (timer) => {
  if (isRunning(timer)) {
    let done = doneTimer(timer)
    gun.get('running').get('timer').put(null)
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