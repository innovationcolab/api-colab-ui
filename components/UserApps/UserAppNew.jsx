import React, { Component } from 'react'

class UserAppNew extends Component {
  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
    this.updatePermissions = this.updatePermissions.bind(this)
    this.permissions = []
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  updatePermissions(e) {
    if (e.target.checked) {
      this.permissions.push({
        service: e.target.value,
        access: 'full'
      })
    } else {
      this.permissions = this.permissions.filter( elem => {
        return elem['service'] !== e.target.value
      })
    }
  }

  onSubmit(e) {
    e.preventDefault()

    // TODO: run validity check

    const {clientId, redirectURIs, displayName, description, ownerDescription, privacyURL} = this.refs
    const permissions = this.permissions
    const {submitUserApp} = this.props
    activeUserAppReq = {
      clientId,
      redirectURIs,
      displayName,
      description,
      ownerDescription,
      privacyURL,
      permissions
    }

    submitUserApp(activeUserAppReq)
  }

  render() {
    const permissionObj = {
      'permission:name': 'Permission_Description',
      'permission:another': 'Permission_Description_Another'
    }
    return (
      <form onSubmit={this.onSubmit}>
        <input type="text" placeholder="Client ID" required ref="clientId" />
        <input type="text" placeholder="Redirect URIs (Comma Separated)" required ref="redirectURIs" />
        <input type="text" placeholder="Display Name" required ref="displayName" />
        <input type="text" placeholder="Description" ref="description" />
        <input type="text" placeholder="Owner Description" ref="ownerDescription" />
        <input type="text" placeholder="privacy URL" ref="privacyURL" />
        {Object.keys(permissionObj).map( (perm) => {
          return (
            <div key={perm}>
              <input type="checkbox" value={perm} onClick={this.updatePermissions} /> {permissionObj[perm]}
            </div>
          )
        })}
        <input type="submit"/>
      </form>
    )
  }
}

UserAppNew.propTypes = {
  activeUserApp: React.PropTypes.object.isRequired,
  submitUserApp: React.PropTypes.func.isRequired
}

export default UserAppNew
