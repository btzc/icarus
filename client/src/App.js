import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import StocksPage from './pages/stocks/stocks.component';

import './App.css';

const App = () => (
  <div className="app">
    <Router>
      <Switch>
        <Redirect
          from="/"
          to="/stocks"
          exact
        />
        <Route
          path="/stocks"
          component={StocksPage}
        />
      </Switch>
    </Router>
  </div>
);

export default App;
