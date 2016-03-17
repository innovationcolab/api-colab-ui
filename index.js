import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import AuthActions from './actions/AuthActions.jsx';
import AuthStore from './stores/AuthStore.jsx';

function requireAuth(nextState, replace) {
  if (nextState.location.hash !== '' && AuthStore.getState().accessToken === null) {
    AuthActions.login(nextState.location.hash);
    location.hash = '';
    replace('/');
  }
}

AuthActions.localLogin();

ReactDOM.render(
  (
    <Router history={browserHistory}>
      <Route path="/">
        <IndexRoute component={App} onEnter={requireAuth} />
      </Route>
    </Router>
  ),
  document.getElementById('root')
);
