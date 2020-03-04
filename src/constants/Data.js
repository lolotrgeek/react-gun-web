import Gun from 'gun/gun'
import { newTimer, newProject, editedProject, doneTimer } from '../constants/Models'
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

export const updateProject = (project, projectId) => {
  const projectNew = editedProject(project)
  gun.get('history').get('projects').get(projectId).set(projectNew[1])
  gun.get('projects').get(projectId).set(projectNew[1])
}
/**
 * Gemerates a new timer using the standard timer model
 * @param {*} projectId 
 */
export const createTimer = (projectId) => {
  const timer = newTimer({ project: projectId })
  gun.get('running').get('timer').put(JSON.stringify(timer))
  gun.get('history').get('timers').get(projectId).get(timer[0]).set(timer[1])
  gun.get('timers').get(projectId).get(timer[0]).put(timer[1])
}

export const runTimer = (timer) => {
  gun.get('running').get('timer').put(JSON.stringify(timer))
}

export const updateTimer = (timer) => {
  let editedTimer = timer
  console.log('Updating', editedTimer)
  gun.get('history').get('timers').get(editedTimer[1].project).get(editedTimer[0]).set(editedTimer[1])
  gun.get('timers').get(editedTimer[1].project).get(editedTimer[0]).put(editedTimer[1])
}

/**
 * Generates a new timer using the given timer model
 * @param {String} model.project 
 * @param {Object} model.value a timer object
 */
export const addTimer = ({ project, value } = {}) => {
  const timer = newTimer({ project: project, value: value })
  console.log('Adding', timer)
  gun.get('history').get('timers').get(project).get(timer[0]).set(timer[1])
  gun.get('timers').get(project).get(timer[0]).put(timer[1])
}

export const finishTimer = (timer) => {
  if (isRunning(timer)) {
    let done = doneTimer(timer)
    gun.get('running').get('timer').put(null)
    console.log('testing Done', done)
    if (multiDay(done[1].created, done[1].ended)) {
      console.log('multiDay')
      const dayEntries = newEntryPerDay(done[1].created, done[1].ended)
      dayEntries.map((dayEntry, i) => {
        // console.log(dayEntry)
        const splitTimer = done
        splitTimer[1].created = dayEntry.start
        splitTimer[1].ended = dayEntry.end
        console.log('Split', i, splitTimer[1])
        if(i === 0) {updateTimer(splitTimer)} // use initial timer id for first day
        else {addTimer({ project: splitTimer.project, value: splitTimer[1]})}
        return splitTimer
      })
    } else {
      updateTimer(done)
    }
  } else { return timer }
}

