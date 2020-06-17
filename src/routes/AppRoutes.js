import React from 'react'
import MainMenu from '../components/organisms/MainMenu'
import { BrowserRouter as Router, Switch, Route, useParams, useHistory } from "react-router-dom"

import * as routes from './routes'

// NOTE: order matters for parameter routing
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
import ProjectRecordScreen from '../screens/ProjectRecordScreen'
import ProjectHistoryScreen from '../screens/ProjectHistoryScreen'


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
              <TimelineScreen useParams={useParams} useHistory={useHistory} />
            </Route>
            <Route path={routes.projectEditlink(':projectId')} children={<ProjectEditScreen useParams={useParams} useHistory={useHistory} />} />
            <Route path={routes.projectCreatelink()} children={<ProjectCreateScreen useParams={useParams} useHistory={useHistory} />} />
            <Route path={routes.projectlink(':projectId')} children={<ProjectRecordScreen useParams={useParams} useHistory={useHistory} />} />
            <Route path={routes.projectTrashlink(':projectId')} children={<ProjectTrashScreen useParams={useParams} useHistory={useHistory} />} />
            <Route path={routes.projectHistorylink(':projectId')} children={<ProjectHistoryScreen useParams={useParams} useHistory={useHistory} />} />
            <Route path={routes.projectsListLink()} children={<ProjectListScreen useParams={useParams} useHistory={useHistory} />} />

            <Route path={routes.timerlink(':projectId', ':timerId')} children={<TimerEditScreen useParams={useParams} useHistory={useHistory} />} />
            <Route path={routes.timerHistorylink(':projectId', ':timerId')} children={<TimerHistoryScreen useParams={useParams} useHistory={useHistory} />} />
            <Route path={routes.timerListlink()} children={<TimerScreen useParams={useParams} useHistory={useHistory} />} />
            <Route path={routes.timerRunninglink()} children={<TimerRunningScreen useParams={useParams} useHistory={useHistory} />} />
            <Route path={routes.timerTrashlink(':projectId')} children={<TimerTrashScreen useParams={useParams} useHistory={useHistory} />} />
          </Switch>
        }
      />
    </Router >
  );
}
