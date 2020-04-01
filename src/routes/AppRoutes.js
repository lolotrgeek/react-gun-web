import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { MainMenu } from '../components/organisms/Menus'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
} from "react-router-dom"
import * as routes from './routes'

// NOTE: order matters for parameter routing

// import { routes } from './routes'

import ProjectListScreen from '../screens/ProjectListScreen'
import TimerScreen from '../screens/TimerScreen'
import TimelineScreen from '../screens/TimelineScreen'
import TimerHistoryScreen from '../screens/TimerHistoryScreen'
import TimerTrashScreen from '../screens/TimerTrashScreen'
import TimerEditScreen from '../screens/TimerEditScreen'
import TimerRunningScreen from '../screens/TimerRunningScreen'
import ProjectCreateScreen from '../screens/ProjectCreateScreen'
import ProjectEditScreen from '../screens/ProjectEditScreen'
import ProjectTrashScreen from '../screens/ProjectTrashScreen'
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
          { text: 'Trash', route: "/trash" },
          
        ]}
        content={
          <Switch>
            <Route exact path="/">
              <TimelineScreen />
            </Route>
            <Route path={routes.projectEditlink(':projectId')} children={<ProjectEditScreen />} />
            <Route path={routes.projectCreatelink()} children={<ProjectCreateScreen />} />
            <Route path={routes.projectlink(':projectId')} children={<ProjectRecordScreen />} />
            <Route path={routes.projectTrashlink(':projectId')} children={<ProjectTrashScreen />} />
            <Route path={routes.projectHistorylink(':projectId')} children={<ProjectHistoryScreen />} />
            <Route path={routes.projectsListLink()} children={<ProjectListScreen />} />
            
            <Route path={routes.timerlink(':projectId', ':timerId')} children={<TimerEditScreen />} />
            <Route path={routes.timerHistorylink(':projectId', ':timerId')} children={<TimerHistoryScreen />} /> 
            <Route path={routes.timerListlink()} children={<TimerScreen />} />
            <Route path={routes.timerRunninglink()} children={<TimerRunningScreen />} />
            <Route path={routes.timerTrashlink(':projectId')} children={<TimerTrashScreen />} />
            
          </Switch>
        }
      />
    </Router >
  );
}
