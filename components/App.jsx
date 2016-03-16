import React, {Component} from 'react'
import axios from 'axios'
import UserAppContainer from './UserApps/UserAppContainer.jsx'
import Config from './Config.jsx'
import AppActions from '../actions/AppActions.jsx'
import AppStore from '../stores/AppStore.jsx'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = AppStore.getState()

    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    AppStore.listen(this.onChange)
    AppActions.getUserApps()
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
    this.setState(state)
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
