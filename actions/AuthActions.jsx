import alt from '../alt';

class AuthActions {
  constructor() {
    this.generateActions(
      'login',
      'localLogin',
      'reInit',
      'logout'
    );
  }
}

export default alt.createActions(AuthActions);
