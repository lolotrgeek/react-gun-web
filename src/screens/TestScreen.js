import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { trimSoul } from '../constants/Store'
import { elapsedTime, dayHeaders, sumProjectTimers, secondsToString, sayDay } from '../constants/Functions'
import { isRunning } from '../constants/Validators'
import { gun, finishTimer, createTimer, addTimer, createProject } from '../constants/Data'
import useCounter from '../hooks/useCounter'
import SpacingGrid from '../components/Grid'
import sub from 'date-fns/sub'


export default function TestScreen() {
  const [online, setOnline] = useState(false)
  const [projects, setProjects] = useState([])
  const [timers, setTimers] = useState([])
  const [daysWithTimer, setDaysWithTimer] = useState([]); // disply the timers within each day
  const [runningTimer, setRunningTimer] = useState('')
  const { count, setCount, start, stop } = useCounter(1000, false)

  useEffect(() => {
    gun.get('projects').map().on((projectValue, projectKey) => {
      console.log(projectValue)
      setProjects(projects => [...projects, [projectKey, projectValue]])
    }, { change: true })
    return () => gun.get('projects').off()
  }, [online])

  useEffect(() => {
    gun.get('running').get('timer').on((runningTimerGun, runningTimerKeyGun) => {
      const runningTimerFound = trimSoul(JSON.parse(runningTimerGun))
      if (isRunning(runningTimerFound)) {
        setRunningTimer(runningTimerFound)
        console.log('runningTimerFound', runningTimerFound)
        setCount(elapsedTime(runningTimerFound[1].created))
        start()
      }
      else if (!runningTimerGun) {
        console.log('running Timer not Found')
        stop()
        setRunningTimer({})
      }
    }, { change: true })

    return () => gun.get('running').off()
  }, [online]);


  useEffect(() => {
    let currentTimers = []
    gun.get('timers').map().on((timerGunId, projectKey) => {
      gun.get('timers').get(projectKey).map().on((timerValue, timerKey) => {
        const foundTimer = [timerKey, trimSoul(timerValue)]
        if (foundTimer[1].status === 'done') {
          let check = currentTimers.some(id => id === foundTimer[0])
          if (!check) {
            console.log('Adding Timer', foundTimer)
            setTimers(timers => [...timers, foundTimer])
          }
          currentTimers.push(foundTimer[0])
        }
        else if (foundTimer[1].status === 'running') {
          gun.get('running').get('timer').put(JSON.stringify(foundTimer))
        }
      })
    }, { change: true })
    return () => gun.get('timers').off()
  }, [online]);

  const generateDummys = () => {
    var names = ["Marquis", "Samir", "Adrien", "Joyce", "Pierce", "Juliette", "Kelton", "Jacob", "Isiah", "Lindsay", "Kian", "Jordyn", "Jaquan", "Anya", "Wayne", "Khalil"];
    var colors = ['#000', '#fff'];
    var name = Math.floor(Math.random()*names.length); 
    var color = Math.floor(Math.random()*colors.length); 
    createProject(name, color)
  }
  
  const loadDummys = () => {
    let randomProject = projects[Math.floor(Math.random() * projects.length)]
    let threeDaysAgo = sub(new Date(), {days: 3})

    let multiDayTimer = {
      created: threeDaysAgo.toString(),
      ended: "",
      type: 'timer',
      project: randomProject[0],
      status: 'running',
      total: 0,
      mood: 'good',
      energy: 50,
  }
    addTimer(multiDayTimer.project, multiDayTimer)
  }

  return (
    <div>
      <h2>Test</h2>
      <h4>
        {isRunning(runningTimer) ? `Running Timer ${runningTimer[1].project}/${runningTimer[0]}/ Count: ${count}` : ''}
      </h4>
      <button  onClick={() => { if (isRunning(runningTimer)) finishTimer(runningTimer); stop() }}>Stop Timer</button>
      <button  onClick={() => { if (isRunning(runningTimer)) { finishTimer(runningTimer); stop() }; generateDummys() }}>Generate Dummys</button>
      <button  onClick={() => { if (isRunning(runningTimer)) { finishTimer(runningTimer); stop() }; loadDummys() }}>Load Dummys</button>
      <div>
        {sumProjectTimers(dayHeaders(timers.sort((a, b) => new Date(b[1].created) - new Date(a[1].created)))).map(day => {
          return (
            <div>
              <h2>{`${sayDay(day.title)}`}</h2>
              {day.data.map(item => projects.map(project => {
                if (item.status === 'running') return (null)
                if (project[0] === item.project) {
                  return (
                    <div>
                      <SpacingGrid values={[
                        <Link to={`/project/${item.project}`}>{project[1].name}</Link>,
                        secondsToString(item.total),
                        <button  onClick={() => { if (isRunning(runningTimer)) { finishTimer(runningTimer); stop() }; createTimer(item.project) }}>New Timer</button>
                      ]}></SpacingGrid>
                    </div>
                  )
                }
                else return (null)
              })
              )}
            </div>
          )
        })}
      </div>
    </div >
  )
}