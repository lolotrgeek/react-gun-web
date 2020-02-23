import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom"
import HomeScreen from '../screens/HomeScreen'
import ProjectScreen from '../screens/ProjectScreen'
import TimerScreen from '../screens/TimerScreen'
import TimerChildScreen from '../screens/TimerChildScreen'
import ProjectChildScreen from '../screens/ProjectChildScreen'

export default function AppRoutes() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/Projects">Projects</Link>
          </li>
          <li>
            <Link to="/Timers">Timers</Link>
          </li>
        </ul>

        <hr />
        <Switch>
          <Route exact path="/">
            <HomeScreen />
          </Route>
          <Route path="/projects">
            <ProjectScreen />
          </Route>
          <Route path="/timers">
            <TimerScreen />
          </Route>
          <Route path="/timer/:projectId/:timerId/:runningId?" children={<TimerChildScreen />} />
          <Route path="/project/:projectId/:runningId?" children={<ProjectChildScreen />} />
        </Switch>
      </div>
    </Router >
  );
}
