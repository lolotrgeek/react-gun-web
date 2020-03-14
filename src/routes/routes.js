import React from 'react'

export const timerRunninglink = () => `/timer/`
export const timerlink = (projectId, timerId) => `/projects/${projectId}/${timerId}`
export const timerHistorylink = (projectId, timerId) => `/projects/${projectId}/${timerId}/history`
export const projectlink = (projectId) => `/projects/${projectId}`
export const projectEditlink = (projectId) => `/projects/${projectId}/edit`
export const projectCreatelink = () => `/projects/create/`
export const projectsListLink = () => `/projects/`
// export const routes = [
//     {
//       path: "/",
//       component: TimelineScreen
//     },
//     {
//       path: "/projects",
//       component: ProjectScreen,
//       routes: [
//         {
//           path: "/projects/:projectId",
//           children: ProjectRecordScreen
//         },
//         {
//           path: "/projects/:projectId/edit",
//           component: ProjectCreateScreen
//         },        
//         {
//             path: "/projects/create",
//             component: ProjectCreateScreen
//           }
//       ]
//     },
//     {
//         path:"/timers",
//         component: TimerScreen,
//         routes: [
//             {
//                 path: "/timers/:projectId/:timerId",
//                 component : TimerEditScreen
//             },
//             {
//                 path: "/timers/:projectId/:timerId/history",
//                 component : TimerHistoryScreen
//             }
//         ]
//     }
//   ];


