import React, {Component} from 'react'
import axios from 'axios'
import UserAppContainer from './UserApps/UserAppContainer.jsx'
import Config from './Config.jsx'
import AuthActions from '../actions/AuthActions.jsx'
import AuthStore from '../stores/AuthStore.jsx'
import AppActions from '../actions/AppActions.jsx'
import AppStore from '../stores/AppStore.jsx'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = AppStore.getState()

    this.addUserApp = this.addUserApp.bind(this)
    this.setActiveUserApp = this.setActiveUserApp.bind(this)
    this.submitUserApp = this.submitUserApp.bind(this)
    this.cancelAddUserApp = this.cancelAddUserApp.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    AppStore.listen(this.onChange)
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
          user: AuthStore.getState().user,
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

  componentWillUnmount() {
    AppStore.unlisten(this.onChange)
  }

  ////////////////////////////////////////////////////////////
  // Custom Function Implementation
  ////////////////////////////////////////////////////////////

  onChange(state) {
    this.setState({
      user: state.user
    })
  }

  addUserApp() {
    let {userApps, activeUserApp, addingNewApp} = this.state
    activeUserApp = {
      clientId: Config.getNewAppId(),
      displayName: ''
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
    // console.info(newAppReq)
    // console.log(JSON.stringify(newAppReq))
    axios
      .post('https://api.colab.duke.edu/meta/v1/apps', newAppReq, {
        headers: {
          'x-api-key': Config.getClientId(),
          'Authorization': 'Bearer ' + AuthStore.getState().accessToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then( res => {
        console.info(res)

        let {userApps, activeUserApp, addingNewApp} = this.state
        userApps.pop()
        userApps.push(res.data)
        activeUserApp = res.data
        addingNewApp = false
        this.setState({
          userApps,
          activeUserApp,
          addingNewApp
        })
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
    if (this.state.user !== undefined) {
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
    return (
      <p>rendering</p>
      // TODO: prettier rendering page
    )
  }
}

export default App
