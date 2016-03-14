import React, {Component} from 'react'
import UserAppList from './UserAppList.jsx'
import UserAppDetails from './UserAppDetails.jsx'
import UserAppNew from './UserAppNew.jsx'

class UserAppContainer extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  render() {
    const {addingNewApp} = this.props
    if (addingNewApp) {
      return (
        <div className="row">
          <div className="col-sm-4">
            <UserAppList {...this.props} />
          </div>
          <div className="col-sm-8 appdetails">
            <UserAppNew {...this.props} />
          </div>
        </div>
      )
    }
    const {activeUserApp} = this.props
    if (Object.keys(activeUserApp).length === 0 && JSON.stringify(activeUserApp) === JSON.stringify({})) {
      return (
        <div className="row">
          <div className="col-sm-4">
            <UserAppList {...this.props} />
          </div>
          <div className="col-sm-8 appdetails">
            <h3>Welcome to the App Registration page</h3>
            <p>Many of the Co-Lab&rsquo;s data services require an API key to use.  To receive an API key, you can register an application here.  That key will allow you to explore the data and use it in your applications.</p>
            <button className="btn btn-primary" href="#" role="button">Register an App</button>
          </div>
        </div>
      )
    }
    return (
      <div className="row">
        <div className="col-sm-4">
          <UserAppList {...this.props} />
        </div>
        <div className="col-sm-8 appdetails">
          <UserAppDetails {...this.props} />
        </div>
      </div>
    )
  }
}

UserAppContainer.propTypes = {
  userApps: React.PropTypes.array.isRequired,
  activeUserApp: React.PropTypes.object.isRequired,
  setActiveUserApp: React.PropTypes.func.isRequired,
  addUserApp: React.PropTypes.func.isRequired,
  addingNewApp: React.PropTypes.bool.isRequired,
  cancelAddUserApp: React.PropTypes.func.isRequired
}

export default UserAppContainer
