import React, {Component} from 'react'

class UserApp extends Component {
  constructor(props) {
    super(props)

    this.onClick = this.onClick.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false
  }

  onClick(e) {
    e.preventDefault()

    const {setActiveUserApp, userApp} = this.props
    setActiveUserApp(userApp)
  }

  render() {
    const {userApp, activeUserApp} = this.props
    const isActive = userApp === activeUserApp ? 'active' : ''
    return (
      <li className={isActive}>
        <a onClick={this.onClick}>
          {this.props.userApp.displayName}
        </a>
      </li>
    )
  }
}

UserApp.propTypes = {
  userApp: React.PropTypes.object.isRequired,
  activeUserApp: React.PropTypes.object.isRequired,
  setActiveUserApp: React.PropTypes.func.isRequired
}

export default UserApp
