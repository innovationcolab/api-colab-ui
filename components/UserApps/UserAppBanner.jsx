import React, { Component } from 'react'
import AuthActions from '../../actions/AuthActions.jsx'

class UserAppBanner extends Component {
  constructor(props) {
    super(props)

    this.onClick = this.onClick.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  onClick(e) {
    e.preventDefault()

    AuthActions.logout()
  }

  render() {
    const {user} = this.props
    const name = user.nickname === undefined ? user.firstName + user.lastName : user.nickname + user.lastName
    return (
      <div>
        {name}
        <a href="" onClick={this.onClick}>Log out</a>
      </div>
    )
  }
}

UserAppBanner.propTypes = {
  user: React.PropTypes.object.isRequired
}

export default UserAppBanner
