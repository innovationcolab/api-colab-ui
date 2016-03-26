import alt from '../alt';

class AppActions {
  constructor() {
    this.generateActions(
      'refreshUser',
      'refreshNewAppName',
      'syncClientId',
      'syncActiveUserApp',
      'addUserApp',
      'deleteUserApp',
      'setActiveUserApp',
      'submitUserApp',
      'cancelAddUserApp',
      'inputChange',
      'getUserApps',
      'handleError',
      'closeModal'
    );
  }
}

export default alt.createActions(AppActions);
