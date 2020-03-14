import React from 'react'

export const timerRunninglink = () => `/timer/`
export const timerlink = (projectId, timerId) => `/timers/${projectId}/${timerId}`
export const timerListlink = () => `/timers`
export const timerHistorylink = (projectId, timerId) => `/projects/${projectId}/${timerId}/history`
export const projectlink = (projectId) => `/projects/${projectId}`
export const projectEditlink = (projectId) => `/projects/${projectId}/edit`
export const projectHistorylink = (projectId) => `/projects/${projectId}/history`
export const projectCreatelink = () => `/projects/create/`
export const projectsListLink = () => `/projects/`