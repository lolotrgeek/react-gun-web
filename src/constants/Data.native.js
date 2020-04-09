import { newTimer, newProject, doneTimer, generateNewTimer } from './Models'
import { isRunning, multiDay, newEntryPerDay } from './Functions'
import Gun from 'gun/gun'
import  AsyncStorage  from '@react-native-community/async-storage';
console.log('using native Data...')
class Adapter {
  constructor(db) {
    this.db = db;
    // Preserve the `this` context for read/write calls.
    this.read = this.read.bind(this);
    this.write = this.write.bind(this);
  }
  read(context) {
    const { get, gun } = context;
    const { "#": key } = get;
    const done = (err, data) => {
      this.db.on("in", {
        "@": context["#"],
        put: Gun.graph.node(data),
        //not needed. this solves an issue in gun https://github.com/amark/gun/issues/877
        _: function () { },
        err
      });
    };
    AsyncStorage.getItem(key, (err, result) => {
      if (err) {
        // console.error(err)
        done(err);
      }
      else if (result === null) {
        // Nothing found
        done(null);
      }
      else {
        // console.log('async get:')
        // console.log(JSON.parse(result))
        done(null, JSON.parse(result));
      }
    });
  }
  write(context) {
    const { put: graph, gun } = context;
    const keys = Object.keys(graph);
    const instructions = keys.map((key) => [
      key,
      JSON.stringify(graph[key])
    ]);
    
    console.log('instructions:' , typeof instructions, instructions )
    // https://github.com/react-native-community/async-storage/blob/LEGACY/docs/API.md#multimerge
    AsyncStorage.multiMerge(instructions, (err) => {
      this.db.on("in", {
        "@": context["#"],
        ok: !err || err.length === 0,
        err
      });
    });
  }
}
Gun.on("create", (db) => {
  const adapter = new Adapter(db);
  // Allows other plugins to respond concurrently.
  const pluginInterop = (middleware) => function (ctx) {
    this.to.next(ctx);
    return middleware(ctx);
  };
  // Register the adapter
  db.on("get", pluginInterop(adapter.read));
  db.on("put", pluginInterop(adapter.write));
});


const port = '8765'
const address = 'localhost'
const peers = [`http://${address}:${port}`]

export const gun = new Gun({
  localStorage: false,
  peers: peers,
})


// TODO IMPORT FUNCTIONS FROM ./Data.js

export const createProject = (name, color) => {
  const project = newProject(name, color)
  console.log('Creating', project)
  gun.get('history').get('projects').get(project[0]).set(project[1])
  gun.get('projects').get(project[0]).put(project[1])
}

export const updateProject = (project, updates) => {
  let projectEdit = project
  Object.assign(projectEdit[1], updates)
  if (projectEdit[1].deleted) { projectEdit[1].deleted = null }
  projectEdit[1].edited = new Date().toString()
  console.log('Updating', projectEdit)
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
//   console.log('Updating', projectEdit)
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
  console.log('Restoring', restoredProject)
  gun.get('projects').get(restoredProject[0]).put(restoredProject[1])
}


export const deleteProject = (project) => {
  console.log('Deleting', project)
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
  console.log('Updating', editedTimer)
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
  console.log('Restoring', restoredTimer)
  gun.get('timers').get(restoredTimer[1].project).get(restoredTimer[0]).put(restoredTimer[1])
}

export const endTimer = (timer) => {
  console.log('Ending', timer)
  gun.get('history').get('timers').get(timer[1].project).get(timer[0]).set(timer[1])
  gun.get('timers').get(timer[1].project).get(timer[0]).put(timer[1])
}

export const deleteTimer = (timer) => {
  console.log('Deleting', timer)
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
  console.log('Storing', timer)
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
        console.log('Split', i, splitTimer)
        if (i === 0) { endTimer(splitTimer) } // use initial timer id for first day
        else { addTimer(splitTimer[1].project, splitTimer[1]) }
        return splitTimer
      })
    } else {
      endTimer(done)
    }
  } else { return timer }
}

/**
 *  Delete entire async Storage
 * @param {function} state
 */
export const removeAll = async () => {
  try {
    console.info('ASYNC STORAGE - REMOVING ALL')
    await AsyncStorage.clear()
  } catch (error) {
    console.error(error)
  }
}