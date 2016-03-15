import React, {Component} from 'react'
import axios from 'axios'
import UserAppContainer from './UserApps/UserAppContainer.jsx'
import Config from './Config.jsx'
import AuthActions from '../actions/AuthActions.jsx'
import AuthStore from '../stores/AuthStore.jsx'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userApps: Config.getUserApps(),
      activeUserApp: {},
      addingNewApp: false,
      error: null
    }

    this.addUserApp = this.addUserApp.bind(this)
    this.setActiveUserApp = this.setActiveUserApp.bind(this)
    this.submitUserApp = this.submitUserApp.bind(this)
    this.cancelAddUserApp = this.cancelAddUserApp.bind(this)
  }

  componentDidMount() {
    axios
      .get('https://api.colab.duke.edu/meta/v1/apps', {
        headers: {
          'x-api-key': Config.getClientId(),
          'Authorization': 'Bearer ' + AuthStore.getState().accessToken,
          'Accept': 'application/json'
        }
      })
      .then( res => {
        const userApps = res.data
        this.setState({
          userApps
        })
      })
      .catch( res => {
        console.error(res)
        if (res.status === 401 && res.data.error === 'Thrown out by the AuthManager: Couldn\'t determine scopes for this token.') {
          AuthActions.reInit()
        }
      })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  ////////////////////////////////////////////////////////////
  // Custom Function Implementation
  ////////////////////////////////////////////////////////////

  addUserApp() {
    let {userApps, activeUserApp, addingNewApp} = this.state
    activeUserApp = {
      clientId: Config.getNewAppId(),
      displayName: 'A New App'
    }
    userApps.push(activeUserApp)
    addingNewApp = true
    this.setState({userApps, activeUserApp, addingNewApp})
  }

  cancelAddUserApp() {
    let {userApps, activeUserApp, addingNewApp} = this.state
    activeUserApp = {}
    userApps.pop()
    addingNewApp = false
    this.setState({userApps, activeUserApp, addingNewApp})
  }

  setActiveUserApp(newActiveUserApp) {
    let {activeUserApp} = this.state
    activeUserApp = newActiveUserApp
    this.setState({activeUserApp})
  }

  submitUserApp(newAppReq) {
    axios
      .post('https://api.colab.duke.edu/meta/v1/apps', {
        headers: {
          'x-api-key': Config.getClientId(),
          'Authorization': 'Bearer ' + AuthStore.getState().accessToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then( res => {
        console.info(res)

        // let {userApps, activeUserApp} = this.state
        // userApps.push(res.data)
        // activeUserApp = res.data
        // this.setState({
        //   userApps,
        //   activeUserApp
        // })
      })
      .catch( res => {
        console.error(res)

        let {error} = this.state
        error = res.data
        this.setState({
          error
        })
      })
  }

  ////////////////////////////////////////////////////////////
  // Render
  ////////////////////////////////////////////////////////////
  render() {
    return (
      <div className="container">

        <UserAppContainer
          {...this.state}
          setActiveUserApp={this.setActiveUserApp}
          addUserApp={this.addUserApp}
          submitUserApp={this.submitUserApp}
          cancelAddUserApp={this.cancelAddUserApp}
        />
      </div>
    )
  }
}

export default App
