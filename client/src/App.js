import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import StocksPage from './pages/stocks/stocks.component';

const App = () => (
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
);

export default App;
