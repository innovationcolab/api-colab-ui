import React, {Component} from 'react'
import { Link } from 'react-router'
import UserApp from './UserApp.jsx'

class UserAppList extends Component {
  constructor(props) {
    super(props)

    this.add = this.add.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  add(e) {
    e.preventDefault()

    const {addUserApp} = this.props
    addUserApp()
  }

  cancel(e) {
    e.preventDefault()

    const {cancelAddUserApp} = this.props;
    cancelAddUserApp()
  }

  render() {
    const {addingNewApp} = this.props
    const addActive = addingNewApp ? 'hidden' : ''
    const cancelActive = addingNewApp ? '' : 'hidden'
    return (
      <div>
        <ul>
          {this.props.userApps.map( (app) => {
            return (
              <UserApp
                userApp={app}
                key={app.clientId}
                {...this.props}
              />
            )
          })}
        </ul>
        <a className={addActive} onClick={this.add}>Add an app</a>
        <a className={cancelActive} onClick={this.cancel}>Cancel</a>
      </div>
    )
  }
}

UserAppList.propTypes = {
  userApps: React.PropTypes.array.isRequired,
  activeUserApp: React.PropTypes.object.isRequired,
  setActiveUserApp: React.PropTypes.func.isRequired,
  addUserApp: React.PropTypes.func.isRequired,
  cancelAddUserApp: React.PropTypes.func.isRequired
}

export default UserAppList
