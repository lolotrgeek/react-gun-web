import Hashids from 'hashids'

export const newTimerValue = (projectId) => ({
    created: new Date().toString(),
    ended: "",
    type: 'timer',
    project: projectId,
    status: 'running',
    total: 0,
    mood: 'good',
    energy: 50,
})

export const newTimer = value => {
    const hashids = new Hashids()
    let key = hashids.encode(Date.now().toString())
    return [key, value]
}

export const generateNewTimer = projectId => {
    const hashids = new Hashids()
    let key = hashids.encode(Date.now().toString())
    let new_value = newTimerValue(projectId)
    return [key, new_value]
}

export const doneTimer = (timer) => {
    const done = timer
    done[1].ended = new Date().toString()
    done[1].status = 'done'
    return done
}

export const newProject = (name, color) => {
    const hashids = new Hashids()
    const key = hashids.encode(Date.now().toString())
    const value = {
        created: new Date().toString(),
        type: 'project',
        name: name,
        color: color,
        // time: typeof time === 'string' && time.length > 0 ? parseInt(time) : time
    }
    return [key, value]
}

export const editedProject = (project, updates) => {
    let update = project
    update[1] = Object.assign(project[1], updates)
    update[1].edited = new Date().toString()
    return update
}