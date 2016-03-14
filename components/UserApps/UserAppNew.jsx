import React, { Component } from 'react'
import axios from 'axios'
import Credentials from '../Credentials.jsx'

class UserAppNew extends Component {
  constructor(props) {
    super(props)

    this.state = {
      permissionObj: JSON.parse(sessionStorage.getItem('permissionObj')) || {}
    }

    this.onSubmit = this.onSubmit.bind(this)

    this.updatePermissions = this.updatePermissions.bind(this)
    this.permissions = []
  }

  componentDidMount() {
    if (Object.keys(this.state.permissionObj).length === 0 && JSON.stringify(this.state.permissionObj) === JSON.stringify({})) {
      axios
        .get('https://api.colab.duke.edu/meta/v1/docs', {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': Credentials.getClientId()
          }
        })
        .then( (res) => {
          const metaScopes = res.data.meta.v1.securityDefinitions.duke_auth.scopes
          for (let key of Object.keys(metaScopes)) {
            if (key !== 'meta:api:write') {
              this.state.permissionObj[key] = metaScopes[key]
            }
          }
          this.setState({
            permissionObj: this.state.permissionObj
          })
          sessionStorage.setItem('permissionObj', JSON.stringify(this.state.permissionObj))
        })
        .catch( (res) => {
          console.error(res)
        })
    }
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

    // TODO: run validity check (no security flaw)

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
    const permissionObj = this.state.permissionObj
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
