import React, {Component} from 'react'
import UserAppContainer from './UserApps/UserAppContainer.jsx'
import Config from './Config.jsx'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userApps: [{
        "clientId": "vw-test",
        "clientSecret": "HmEfz2W%CXsEIt2PI9=NGq6EDAC4iF9q4z6y29w@@6LJCstsTE",
        "redirectURIs": [
          "https://dev.colab.duke.edu/"
        ],
        "displayName": "vw-app",
        "description": "vw test app",
        "ownerDescription": "Victor Wang",
        "privacyURL": "https://dev.colab.duke.edu/#privacy",
        "permissions": [
          {
            "service": "basic",
            "access": "full"
          },
          {
            "service": "meta:api:write",
            "access": "full"
          }
        ],
        "appOwners": [
          "xw72@duke.edu"
        ],
        "expiration": 1473319282277
      }],
      activeUserApp: {},
      addingNewApp: false
    }

    this.addUserApp = this.addUserApp.bind(this)
    this.setActiveUserApp = this.setActiveUserApp.bind(this)
    this.submitUserApp = this.submitUserApp.bind(this)
    this.cancelAddUserApp = this.cancelAddUserApp.bind(this)
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
