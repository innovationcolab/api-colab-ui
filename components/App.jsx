import React, {Component} from 'react'
import axios from 'axios'
import UserAppContainer from './UserApps/UserAppContainer.jsx'
import Config from './Config.jsx'
import AuthStore from '../stores/AuthStore.jsx'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userApps: Config.getUserApps(),
      activeUserApp: {},
      addingNewApp: false
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
    // TODO: make HTTPS request
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
