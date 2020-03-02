export const isValidEntry = entry =>  entry && Array.isArray(entry) && entry.length === 2 ? true : false
export const isTimer = entry => isValidEntry(entry) && entry[1].type === 'timer' ? true : false
export const isRunning = timer => isTimer(timer) && timer[1].status === 'running' ? true : false
export const colorValid = validate => typeof validate[1].color === 'string' && validate[1].color.charAt(0) === '#' ? true : false
