export const isRunning = timer => timer && Array.isArray(timer) && timer.length === 2 && timer[1].status === 'running' ? true : false