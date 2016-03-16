import alt from '../alt'

class AppActions {
  constructor() {
    this.generateActions(
      'refreshUser',
      'refreshNewAppName',
      'syncClientId',
      'addUserApp',
      'deleteUserApp',
      'setActiveUserApp',
      'submitUserApp',
      'cancelAddUserApp',
      'inputChange',
      'getUserApps'
    )
  }
}

export default alt.createActions(AppActions)
