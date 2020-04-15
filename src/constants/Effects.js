import { createTimer, finishTimer, gun } from '../constants/Data'
import { elapsedTime, trimSoul, totalTime } from '../constants/Functions'
import { isRunning, isTimer } from '../constants/Validators'

const debug = true

/**
 * 
 * @param {*} props 
 * @param {function} props.setCount 
 * @param {function} props.start 
 * @param {function} props.stop 
 * @param {function} props.setRunningTimer 
 */
export const getRunningTimer = (props) => {
    gun.get('running').get('timer').on((runningTimerGun, runningTimerKeyGun) => {
        const runningTimerFound = trimSoul(JSON.parse(runningTimerGun))
        if (isRunning(runningTimerFound)) {
            props.setRunningTimer(runningTimerFound)
            debug && console.log('runningTimerFound', runningTimerFound)
            props.setCount(elapsedTime(runningTimerFound[1].started))
            props.start()
        }
        else if (!runningTimerGun) {
            debug && console.log('running Timer not Found')
            props.stop()
            props.setRunningTimer({})
        }
    }, { change: true })

    return () => gun.get('running').off()
}

/**
 * TimerRunningScreen Specific
 * @param {*} props 
 * @param {function} props.setMood 
 * @param {function} props.setEnergy 
 * @param {function} props.setCount 
 * @param {function} props.start 
 * @param {function} props.stop 
 * @param {function} props.setRunningTimer 
 * @param {function} props.runningProject 
 * @param {function} props.setAlert 
 */
export const getTimerRunning = (props) => {
    gun.get('running').get('timer').on((runningTimerGun, runningTimerKeyGun) => {
        if (!runningTimerGun) {
            props.stop()
            if (props.runningProject.length === 0) props.setAlert(['Error', 'No Timer Exists'])
            else props.setAlert(['Success', 'Timer Complete!'])
        }
        else {
            const runningTimerFound = trimSoul(JSON.parse(runningTimerGun))
            props.setMood(runningTimerFound[1].mood)
            props.setEnergy(runningTimerFound[1].energy)
            props.setRunningTimer(runningTimerFound)
            props.setCount(elapsedTime(runningTimerFound[1].started))
            props.start()
        }
    }, { change: true })
    return () => gun.get('running').off()
}

/**
 * 
 * @param {*} props 
 * @param {*} props.projectId 
 * @param {*} props.setProject 
 */
export const getProject = (props) => {
    if (props.projectId) {
        gun.get('projects').get(props.projectId).on((projectValue, projectGunKey) => {
            debug && console.log(projectValue)
            props.setProject([props.projectId, trimSoul(projectValue)])
        }, { change: true })
    }
    return () => gun.get('projects').off()
}

/**
 * 
 * @param {*} props
 * @param {function} props.setProjects
 */
export const getProjects = (props) => {
    gun.get('projects').map().on((projectValue, projectKey) => {
        const projectFound = trimSoul(projectValue)
        debug && console.log('Project Found', projectFound)
        if (projectFound && projectFound.status !== 'deleted') {
            props.setProjects(projects => [...projects, [projectKey, projectFound]])
        }
    }, { change: true })
    return () => gun.get('projects').off()
}

/**
 * 
 * @param {*} props 
 * @param {Array} props.runningTimer 
 * @param {Function} props.setRunningProject
 */
export const getRunningProject = (props) => {
    if (props.runningTimer[1] && isTimer(props.runningTimer)) {
        gun.get('projects').get(props.runningTimer[1].project).on((projectValue, projectKey) => {
            const projectFound = trimSoul(projectValue)
            debug && console.log('Project Found', projectFound)
            if (projectFound && projectFound.status !== 'deleted') {
                props.setRunningProject([projectKey, projectFound])
            }
        }, { change: true })
        return () => gun.get('projects').off()
    }
}

/**
 * 
 * @param {*} props 
 * @param {*} props.setCurrent
 * @param {*} props.current
 * @param {*} props.setTimers
 */
export const getTimers = (props) => {
    // let currentTimers = []
    gun.get('timers').map().on((timerGunId, projectKey) => {
        gun.get('timers').get(projectKey).map().on((timerValue, timerKey) => {
            if (timerValue) {
                const foundTimer = [timerKey, trimSoul(timerValue)]
                if (foundTimer[1].status === 'done') {
                    // let check = currentTimers.some(id => id === foundTimer[0])
                    let check = props.current.some(id => id === foundTimer[0])
                    if (!check) {
                        debug && console.log('Adding Timer', foundTimer)
                        props.setTimers(timers => [...timers, foundTimer])
                    }
                    props.setCurrent(current => [...current, foundTimer[0]])
                    // currentTimers.push(foundTimer[0])
                }
                else if (foundTimer[1].status === 'running') {
                    gun.get('running').get('timer').put(JSON.stringify(foundTimer))
                }
            }
        })
    }, { change: true })

    return () => gun.get('timers').off()
}

/**
 * 
 * @param {*} props 
 * @param {*} props.projectId 
 * @param {*} props.setCurrent
 * @param {*} props.current
 * @param {*} props.setTimers
 */
export const getTimersProject = (props) => {
    // let currentTimers = []
    gun.get('timers').get(props.projectId).map().on((timerValue, timerKey) => {
        if (timerValue) {
            const foundTimer = [timerKey, trimSoul(timerValue)]
            if (foundTimer[1].status === 'done') {
                // let check = currentTimers.some(id => id === foundTimer[0])
                let check = props.current.some(id => id === foundTimer[0])
                if (!check) {
                    debug && console.log('Adding Timer', foundTimer)
                    props.setTimers(timers => [...timers, foundTimer])
                }
                props.setCurrent(current => [...current, foundTimer[0]])
                // currentTimers.push(foundTimer[0])
            }
            else if (foundTimer[1].status === 'running') {
                gun.get('running').get('timer').put(JSON.stringify(foundTimer))
            }
        }
    }, { change: true })

    return () => gun.get('timers').off()
}


/**
 * 
 * @param {*} props 
 * @param {*} props.setEdits 
 * @param {*} props.projectId 
 */
export const getProjectHistory = (props) => {
    gun.get('history').get('projects').get(props.projectId).map().on((projectValue, projectGunKey) => {
        debug && console.log('History ', projectGunKey, projectValue)
        props.setEdits(edits => [...edits, [props.projectId, trimSoul(projectValue), projectGunKey]])
    }, { change: true })
    return () => gun.get('history').off()
}

/**
 * 
 * @param {*} props
 * @param {*} props.setProjects
 */
export const getDeletedProjects = (props) => {
    gun.get('projects').map().on((projectValue, projectKey) => {
        if (projectValue.status === 'deleted') {
            debug && console.log(projectValue)
            props.setProjects(projects => [...projects, [projectKey, projectValue]])
        }
    }, { change: true })
    return () => gun.get('projects').off()
}

/**
 * 
 * @param {*} props 
 * @param {*} props.setAlert 
 * @param {*} props.projectId 
 * @param {*} props.timerId 
 * @param {*} props.history 
 * @param {*} props.setStarted 
 * @param {*} props.setEnded 
 * @param {*} props.setMood 
 * @param {*} props.setEnergy 
 * @param {*} props.setTotal 
 * @param {*} props.setTimer 
 * @param {*} props.started 
 * @param {*} props.ended 
 * @param {*} props.projectlink 
 */
export const getTimerForEdit = (props) => {
    debug && console.log('Getting: ', props.projectId, props.timerId)
    gun.get('timers').get(props.projectId, ack => {
        if (ack.err || !ack.put) props.setAlert(['Error', 'No Project Exists'])
    }).get(props.timerId, ack => {
        if (ack.err || !ack.put) props.setAlert(['Error', 'No Timer Exists'])
    }).on((timerValue, timerGunId) => {
        if (!timerValue) {
            props.setAlert(['Error', 'No Timer Exists'])
            props.history.push((props.projectlink(props.projectId)))
        }
        else {
            let foundTimer = [props.timerId, trimSoul(timerValue)]
            props.setStarted(new Date(foundTimer[1].started))
            props.setEnded(new Date(foundTimer[1].ended))
            props.setMood(foundTimer[1].mood)
            props.setEnergy(foundTimer[1].energy)
            props.setTotal(foundTimer[1].total === 0 ? totalTime(props.started, props.ended) : foundTimer[1].total)
            props.setTimer(foundTimer)
        }

    }, { change: true })
    return () => gun.get('timers').off()
}

/**
 * 
 * @param {*} props 
 * @param {*} props.timerId 
 * @param {*} props.projectId 
 * @param {*} props.setAlert 
 * @param {*} props.projectlink 
 * @param {*} props.history 
 * @param {*} props.setTimer 
 */
export const getProjectHistoryTimers = (props) => {
    debug && console.log('Getting: ', props.projectId, props.timerId)
    gun.get('timers').get(props.projectId, ack => {
        if (ack.err || !ack.put) props.setAlert(['Error', 'No Project Exists'])
    }).get(props.timerId, ack => {
        if (ack.err || !ack.put) props.setAlert(['Error', 'No Timer Exists'])
    }).on((timerValue, timerGunId) => {
        if (!timerValue) {
            props.setAlert(['Error', 'No Timer Exists'])
            props.history.push((props.projectlink(props.projectId)))
        }
        let foundTimer = [props.timerId, trimSoul(timerValue)]
        props.setTimer(foundTimer)

    }, { change: true })
    return () => gun.get('timers').off()

}