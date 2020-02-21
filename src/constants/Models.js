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

export const newTimer = ({project, value}) => {
    const hashids = new Hashids()
    let key = hashids.encode(Date.now().toString())
    let new_value = value ? value : newTimerValue(project)
    return [key, new_value]
}

export const updateTimer = (timer) => {
        timer[1].ended = new Date().toString()
        timer[1].status ='done'
    return timer
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

export const updateProject = (key, created, name, color, time) => {
    const value = {
        created: created,
        type: 'project',
        name: name,
        color: color,
        time: typeof time === 'string' && time.length > 0 ? parseInt(time) : time
    }
    return [key, value]
}

export const navigation = (project, running, lastscreen) => ({
    project: project,
    running: running,
    lastscreen: lastscreen
})