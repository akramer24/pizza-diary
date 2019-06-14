import React from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import { Home, Map } from './index';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/map" component={Map} />
  </Switch>
)

export default withRouter(Routes);