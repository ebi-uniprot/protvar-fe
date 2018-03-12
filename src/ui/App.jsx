
import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import SamplePage from './pages/SamplePage';

const App = () => (
  <Router>
    <Fragment>
      <Route path="/" exact component={HomePage} />
      <Route path="/sample-page" component={SamplePage} />
    </Fragment>
  </Router>
);

export default App;
