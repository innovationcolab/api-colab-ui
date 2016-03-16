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
      <div className="appDetails">
        <h3>App Details</h3>
        <div className="row">
            <div className="col-sm-3 title">
                <p>App Name</p>
            </div>
            <div className="col-sm-9 description">
                <p>{activeUserApp.displayName}</p>
            </div>
        </div>
        <div className="row">
            <div className="col-sm-3 title">
                <p>Client ID</p>
            </div>
            <div className="col-sm-9 description">
                <p>{activeUserApp.clientId}</p>
            </div>
        </div>        
        <div className="row">
            <div className="col-sm-3 title">
                <p>Description</p>
            </div>
            <div className="col-sm-9 description">
                <p>{activeUserApp.description}</p>
            </div>
        </div>
        <div className="row">
            <div className="col-sm-3 title">
                <p>Owner Description</p>
            </div>
            <div className="col-sm-9 description">
                <p>{activeUserApp.ownerDescription}</p>
            </div>
        </div>
        <div className="row">
            <div className="col-sm-3 title">
                <p>Privacy URL</p>
            </div>
            <div className="col-sm-9 description">
                <p>{activeUserApp.privacyURL}</p>
            </div>
        </div>
        <div className="row">
            <div className="col-sm-3 title">
                <p>Permissions</p>
            </div>
            <div className="col-sm-9 description">
                    {activeUserApp.permissions.map( (perm) => {
                        return(
                                <p>service: {perm.service}</p> 
                        )
                    })}
            </div>
        </div>       
      </div>
    )
  }
}

UserAppDetails.propTypes = {
  activeUserApp: React.PropTypes.object.isRequired
}

export default UserAppDetails
