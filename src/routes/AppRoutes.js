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
import * as routes from './routes'

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
import ProjectHistoryScreen from '../screens/ProjectHistoryScreen';


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
            <Route path={routes.projectEditlink(':projectId')} children={<ProjectEditScreen />} />
            <Route path={routes.projectCreatelink()} children={<ProjectCreateScreen />} />
            <Route path={routes.projectlink(':projectId')} children={<ProjectRecordScreen />} />
            <Route path={routes.projectHistorylink(':projectId')} children={<ProjectHistoryScreen />} />
            <Route path={routes.projectsListLink()} children={<ProjectScreen />} />
            
            <Route path={routes.timerlink(':projectId', ':timerId')} children={<TimerEditScreen />} />
            <Route path={routes.timerHistorylink(':projectId', ':timerId')} children={<TimerHistoryScreen />} /> 
            <Route path={routes.timerListlink()} children={<TimerScreen />} />
            <Route path={routes.timerRunninglink()} children={<TimerRunningScreen />} />
            
            <Route path="/test">
              <TestScreen />
            </Route>
          </Switch>
        }
      />
    </Router >
  );
}
