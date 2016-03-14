import React, { Component } from 'react'
import axios from 'axios'
import Credentials from '../Credentials.jsx'
import Config from '../Config.jsx'

class UserAppNew extends Component {
  constructor(props) {
    super(props)

    this.state = {
      permissionObj: Config.getPermissionObj()
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
          Config.setPermissionObj(this.state.permissionObj)
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


      <div className="newAppForm">
	      <form onSubmit={this.onSubmit} className="form-horizontal">
	      	<div className="form-group">
		        <label htmlFor="clientId" className="col-sm-3 control-label">Client ID</label>
		        <div className="col-sm-8">
		        	<input className="col-sm-12" type="text" required ref="clientId" aria-describedby="ClientIDHelp"/>
							<span id="ClientIDHelp" className="help-block">Here's where we describe what a Client ID is.</span>
		        </div>
	        </div>

		      <div className="form-group">
		        <label htmlFor="redirectURIs" className="col-sm-3 control-label">Redirect URIs <br />(Comma Separated)</label>
		        <div className="col-sm-8">
		        	<input className="col-sm-12" type="text" ref="redirectURIs" aria-describedby="ClientIDHelp" required />
							<span id="RedirectURIsHelp" className="help-block">Here's where we describe what a Redirect URI is.</span>
			      </div>
		      </div>

		      <div className="form-group">
						<label htmlFor="displayName" className="col-sm-3 control-label">Display Name</label>
						<div className="col-sm-8">
			        <input className="col-sm-12" type="text" required ref="displayName" aria-describedby="displayNameHelp"/>
			        <span id="displayNameHelp" className="help-block">What is a display name is that like my name or the name of the app or something else?</span>
						</div>
		      </div>

		      <div className="form-group">
						<label htmlFor="description" className="col-sm-3 control-label">Description</label>
						<div className="col-sm-8">
			        <textarea className="col-sm-12" rows="2" required ref="description" aria-describedby="descriptionHelp"/>
			        <span id="descriptionHelp" className="help-block">What are you doing with the app?  Who will use it? What data are you accessing?</span>
						</div>
		      </div>

	        <div className="form-group">
						<label htmlFor="ownerDescription" className="col-sm-3 control-label">Owner Description</label>
						<div className="col-sm-8">
			        <textarea className="col-sm-12" rows="2" required ref="ownerDescription" aria-describedby="ownerDescriptionHelp"/>
			        <span id="ownerDescriptionHelp" className="help-block">I dont even know what this means?</span>
						</div>
		      </div>

		      <div className="form-group">
						<label htmlFor="privacyURL" className="col-sm-3 control-label">Privacy URL</label>
						<div className="col-sm-8">
			        <input className="col-sm-12" type="text" required ref="privacyURL" aria-describedby="privacyURLHelp"/>
			        <span id="privacyURLHelp" className="help-block">Info about Privacy URL stuffs</span>
						</div>
		      </div>

		      <div className="form-group">
			      <label htmlFor="permissions" className="col-sm-3 control-label">Permissions</label>
			      <div className="col-sm-8">
		        {Object.keys(permissionObj).map( (perm) => {
		          return (
		            <div key={perm}>
		              <input type="checkbox" value={perm} onClick={this.updatePermissions} /> {permissionObj[perm]}
		            </div>
		          )
		        })}
			      </div>
		      </div>

	        <button type="submit" className="btn btn-primary col-sm-offset-3">Submit</button>
	      </form>
      </div>
    )
  }
}

UserAppNew.propTypes = {
  activeUserApp: React.PropTypes.object.isRequired,
  submitUserApp: React.PropTypes.func.isRequired
}

export default UserAppNew
