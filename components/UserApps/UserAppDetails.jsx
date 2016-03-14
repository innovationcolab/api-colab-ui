import React, {Component} from 'react'

class UserAppDetails extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  render() {
    const {activeUserApp} = this.props
    return (
      <div>
        <h1>{activeUserApp.displayName}</h1>
        {/* TODO: */}
      </div>
    )
  }
}

UserAppDetails.propTypes = {
  activeUserApp: React.PropTypes.object.isRequired
}

export default UserAppDetails
