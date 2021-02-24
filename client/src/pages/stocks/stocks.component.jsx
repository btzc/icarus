import React, {
  lazy,
  Suspense
} from 'react';

import {
  Route
} from "react-router-dom";

const StocksOverview = lazy(() => import('../../components/stocks-overview/stocks-overview.component'));
const StockOverview = lazy(() => import('../../components/stock-overview/stock-overview.component'));

const StocksPage = ({ match }) => (
  <div>
    <Route 
      exact
      path={`${match.path}`}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <StocksOverview />
      </Suspense>
    </Route>
    <Route 
      path={`${match.path}/:stock`}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <StockOverview />
      </Suspense>
    </Route>
  </div>
);

export default StocksPage;
