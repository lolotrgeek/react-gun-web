import { newTimer, newProject, doneTimer, generateNewTimer } from './Models'
import { isRunning, multiDay, newEntryPerDay } from './Functions'
import Gun from 'gun/gun'
import GunSQLite from '@lolotrgeek/gun-react-native-sqlite';
import SQLite from 'react-native-sqlite-storage'

const debug = true

debug && console.log('using Native Storage...')

const port = '8765'
const address = '192.168.1.109'
const peers = [`http://${address}:${port}/gun`]

const adapter = GunSQLite.bootstrap(Gun);

export const gun = new Gun({
  // Defaults
  peers: peers,
  sqlite: {
    database_name: "GunDB.db",
    database_location: "default", // for concerns about location on iOS, see [here](https://github.com/andpor/react-native-sqlite-storage#opening-a-database)
    onOpen: () => { },
    onErr: err => { },
    onReady: err => debug && console.log('Ready') // don't attempt to read/write from Gun until this has been called unless you like to live dangerously
  }
})

// Clean Out DB
export const cleanDB = () => {
  adapter.clean(Date.now() - (1000 * 60 * 60 * 24), err => {
    if (!err) {
      debug && console.log("All cleaned up!");
    }
  });
}
// Look at DB directly
export const dumpDB = () => {
  let db = SQLite.openDatabase({ name: "GunDB.db", location: "default" })
  db.transaction(tx => {
    debug && console.log('SELECTING ENTIRE TABLE')
    tx.executeSql("SELECT * FROM GunTable", [],
      (tx, results) => debug && console.table(results.rows.raw()),
      (tx, err) => debug && console.warn(err))
  });
}

// Kill DB
export const deleteGunTable = () => {
  let db = SQLite.openDatabase({ name: "GunDB.db", location: "default" })
  db.transaction(tx => {
    debug && console.log('DROPPING DB')
    tx.executeSql('DROP TABLE GunTable', [],
      (tx, results) => debug && console.warn('DROPPED: ', results),
      (tx, err) => debug && console.warn(err))
  })
}
// deleteGunTable()

// TODO IMPORT FUNCTIONS FROM ./Data.js

export const createProject = (name, color) => {
  const project = newProject(name, color)
  if(!project) return false
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
  if(typeof projectId !== 'string' || projectId.length < 9) return false
  debug && console.log('Creating', projectId)
  const timer = generateNewTimer(projectId)
  gun.get('running').get('timer').put(JSON.stringify(timer))
  gun.get('history').get('timers').get(projectId).get(timer[0]).set(timer[1])
  gun.get('timers').get(projectId).get(timer[0]).put(timer[1])
  return true
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
    debug && console.log('Finishing', timer)
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
