import React from 'react';

import {
  Route
} from "react-router-dom";

import StocksOverview from '../../components/stocks-overview/stocks-overview.component';
import Stock from '../../components/stock-overview/stock-overview.component';

const StocksPage = ({ match }) => (
  <div>
    <Route 
      exact
      path={`${match.path}`}
      component={StocksOverview}
    />
    <Route 
      path={`${match.path}/:stock`}
      component={Stock}
    />
  </div>
);

export default StocksPage;
