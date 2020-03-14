import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { MainMenu } from '../components/Menus'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
} from "react-router-dom"

// NOTE: order matters for parameter routing

// import { routes } from './routes'

import ProjectScreen from '../screens/ProjectScreen'
import TimerScreen from '../screens/TimerScreen'
import TimelineScreen from '../screens/TimelineScreen'
import TimerHistoryScreen from '../screens/TimerHistoryScreen'
import TimerEditScreen from '../screens/TimerEditScreen'
import TimerRunningScreen from '../screens/TimerRunningScreen'
import TestScreen from '../screens/TestScreen'
import ProjectCreateScreen from '../screens/ProjectCreateScreen'
import ProjectEditScreen from '../screens/ProjectEditScreen'
import ProjectRecordScreen from '../screens/ProjectRecordScreen';


export default function AppRoutes() {
  return (
    <Router>
      <MainMenu
        showBreadcrumbs={false}
        links={[
          { text: 'Timeline', route: "/" },
          { text: 'Projects', route: "/projects" },
          { text: 'Timer', route: "/timer" },
        ]}
        content={
          <Switch>
            <Route exact path="/">
              <TimelineScreen />
            </Route>
            <Route path="/projects/:projectId/edit" children={<ProjectEditScreen />} />
            <Route path="/projects/:projectId/:timerId" children={<TimerEditScreen />} />
            <Route path="/projects/:projectId/:timerId/history" children={<TimerHistoryScreen />} />
            <Route path="/projects/create" children={<ProjectCreateScreen />} />
            <Route path="/projects/:projectId" children={<ProjectRecordScreen />} />
            <Route path="/projects" children={<ProjectScreen />} />
            
            <Route path="/timers/:projectId/:timerId" children={<TimerEditScreen />} />
            <Route path="/timers/:projectId/:timerId/history" children={<TimerHistoryScreen />} />  
            <Route path="/timers" children={<TimerScreen />} />

            <Route path="/timer" children={<TimerRunningScreen />} />
            
            <Route path="/test">
              <TestScreen />
            </Route>
          </Switch>
        }
      />
    </Router >
  );
}
