import React, {Component} from 'react'
import AppActions from '../../actions/AppActions.jsx'
import AppStore from '../../stores/AppStore.jsx'
import UserAppList from './UserAppList.jsx'
import UserAppDetails from './UserAppDetails.jsx'
import UserAppNew from './UserAppNew.jsx'
import UserAppBanner from './UserAppBanner.jsx'

class UserAppContainer extends Component {
  constructor(props) {
    super(props)

    this.onClick = this.onClick.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  onClick(e) {
    e.preventDefault()

    AppActions.addUserApp()
  }

  render() {
    if (AppStore.getState().addingNewApp) {
      return (
        <div className="row">
          <div className="col-sm-4">
            <UserAppList />
          </div>
          <div className="col-sm-8 appdetails">
            <UserAppBanner />
	          <h3>Register a New App</h3>
            <UserAppNew />
          </div>
        </div>
      )
    }
    const {activeUserApp, userApps} = AppStore.getState()
    if (userApps.length === 0) {
      return (
        <div className="row">
          <div className="col-sm-4">
            <UserAppList />
          </div>
          <div className="col-sm-8 appdetails">
            <UserAppBanner />
            <h3>App Registration for API Keys</h3>
            <p>Many of the Co-Lab&rsquo;s data services require an API key to use.  To receive an API key, you can register an application here.  That key will allow you to explore the data and use it in your applications.</p>
            <button className="btn btn-primary" onClick={this.onClick} role="button">Register an App</button>
          </div>
        </div>
      )
    }
    if (Object.keys(activeUserApp).length === 0 && JSON.stringify(activeUserApp) === JSON.stringify({})) {
      return (
        <div className="row">
          <div className="col-sm-4">
            <UserAppList />
          </div>
          <div className="col-sm-8 appdetails">
            <UserAppBanner />
            <h3>Select an App to Begin</h3>
          </div>
        </div>
      )
    }
    return (
      <div className="row">
        <div className="col-sm-4">
          <UserAppList />
        </div>
        <div className="col-sm-8 appdetails">
          <UserAppBanner />
          <UserAppDetails />
        </div>
      </div>
    )
  }
}

export default UserAppContainer
