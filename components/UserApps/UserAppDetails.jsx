import React, {Component} from 'react'
import AppStore from '../../stores/AppStore.jsx'

class UserAppDetails extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  render() {
    const {activeUserApp} = AppStore.getState()
    return (
      <div>
        <h1>{activeUserApp.displayName}</h1>
        <p>{activeUserApp.clientId}</p>
        {/* TODO: */}
      </div>
    )
  }
}

export default UserAppDetails
