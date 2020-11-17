///
// src/index.tsx
///
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createGlobalStyle } from 'styled-components/macro'

// Import main Board component
import { Board } from './components/board'
import { Locations } from './containers/locations'
import {PageNav} from './components/page-nav'

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'

// Use createGlobalStyle to change the background of 'body' element
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #4bcffa;
  }
`

// Create component for the page
const Page = () => (<>
  <Router>
    <div>
      <PageNav></PageNav>
      <Switch>
        <Route path="/dashboard">
          <Board />
        </Route>
        <Route path="/locations">
          <Locations/>
        </Route>
        <Route path="/">
            <h1>Home</h1>
        </Route>
      </Switch>
    </div>
  </Router>
  <GlobalStyle />
</>)

// Render the page into DOM
ReactDOM.render(<Page />, document.getElementById('root'))
