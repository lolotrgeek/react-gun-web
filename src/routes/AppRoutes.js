import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { MainMenu } from '../components/Menus'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom"
import HomeScreen from '../screens/HomeScreen'
import ProjectScreen from '../screens/ProjectScreen'
import TimerScreen from '../screens/TimerScreen'
import TimelineScreen from '../screens/TimelineScreen'
import TimerChildScreen from '../screens/TimerChildScreen'
import TimerEditScreen from '../screens/TimerEditScreen'
import TestScreen from '../screens/TestScreen'
import ProjectCreateScreen from '../screens/ProjectCreateScreen'
import ProjectChildScreen from '../screens/ProjectChildScreen'

export default function AppRoutes() {
  return (
    <Router>
      <MainMenu
        title='Timers'
        links={[
          {text: 'Home', route: "/"},
          {text: 'Projects', route: "/projects"},
          {text: 'Timers', route: "/timers"},
          {text: 'Tests', route: "/test"}
        ]}
        content={
          <Switch>
            <Route exact path="/">
              <TimelineScreen />
            </Route>
            <Route path="/projects">
              <ProjectScreen />
            </Route>
            <Route path="/timers">
              <TimerScreen />
            </Route>
            <Route path="/test">
              <TestScreen />
            </Route>
            <Route path="/timer/:projectId/:projectName/:timerId" children={<TimerEditScreen />} />
            <Route path="/history/timer/:projectId/:projectName/:timerId" children={<TimerChildScreen />} />
            <Route path="/project/:projectId/:projectName" children={<ProjectChildScreen />} />
            <Route path="/project/create" children={<ProjectCreateScreen />} />
            <Route path="/edit/:projectId/" children={<ProjectCreateScreen />} />
          </Switch>
        }
      />
    </Router >
  );
}
