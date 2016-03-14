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
          <div className="col-xs-3">
            <UserAppList {...this.props} />
          </div>
          <div className="col-xs-9">
            <UserAppNew {...this.props} />
          </div>
        </div>
      )
    }
    const {activeUserApp} = this.props
    if (Object.keys(activeUserApp).length === 0 && JSON.stringify(activeUserApp) === JSON.stringify({})) {
      return (
        <div className="row">
          <div className="col-xs-3">
            <UserAppList {...this.props} />
          </div>
          <div className="col-xs-9">
            Select an App to begin.
          </div>
        </div>
      )
    }
    return (
      <div className="row">
        <div className="col-xs-3">
          <UserAppList {...this.props} />
        </div>
        <div className="col-xs-9">
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
