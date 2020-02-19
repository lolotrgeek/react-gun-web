import React, { useState } from 'react'
import { useAsyncRetry } from 'react-use';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"
import { storeItem, multiGet } from '../constants/Store'

export default function HomeScreen() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/list">List</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>

        <hr />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/list">
            <List />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <button onClick={() => storeItem([Date.now(), { hello: 'world' }])}> </button>
    </div>
  );
}

function List() {
  // const [items, setItems] = useState([])
  const state = useAsyncRetry(async () => {
    const result = await multiGet()
    return result
  }, [])
  return (
    <div>
      <h2>List</h2>
      <div>
        {state.loading
          ? <div>Loading...</div>
          : state.error
            ? <div>Error: {state.error.message}</div>
            : <div>Value: {JSON.stringify(state.value)}</div>
        }
      </div>
    </div>
  )
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}