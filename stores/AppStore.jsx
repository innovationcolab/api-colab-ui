import alt from '../alt'
import axios from 'axios'
import querystring from 'querystring'
import AppActions from '../actions/AppActions.jsx'
import Config from '../components/Config.jsx'

class AppStore {
  constructor() {
    this.bindActions(AppActions)

    this.userApps = Config.getUserApps()
    this.activeUserApp = {}
    this.addingNewApp = false
    this.error = {}
  }

  onRefreshUser(user) {
    this.setState({
      user
    })
  }
}

export default alt.createStore(AppStore, 'AppStore')
