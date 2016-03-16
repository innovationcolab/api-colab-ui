import React, { Component } from 'react';
import axios from 'axios';
import Config from '../Config.jsx';
import AppActions from '../../actions/AppActions.jsx';
import AppStore from '../../stores/AppStore.jsx';

class UserAppNew extends Component {
  constructor(props) {
    super(props);

    this.state = {
      permissionObj: Config.getPermissionObj(),
      validationErrors: {},
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.validateClientId = this.validateClientId.bind(this);
    this.validateRedirectURIs = this.validateRedirectURIs.bind(this);
    this.validatePrivacyURL = this.validatePrivacyURL.bind(this);

    this.updatePermissions = this.updatePermissions.bind(this);
    this.permissions = [];
  }

  componentDidMount() {
    this.refs.privacyURL.value = AppStore.getState().activeUserApp.privacyURL;
    if (Object.keys(this.state.permissionObj).length === 0 && JSON.stringify(this.state.permissionObj) === JSON.stringify({})) {
      axios
        .get('https://api.colab.duke.edu/meta/v1/docs', {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': Config.getClientId(),
          },
        })
        .then((res) => {
          const identityScopes = res.data.identity.v1.securityDefinitions.duke_auth.scopes;
          for (const key of Object.keys(identityScopes)) {
            this.state.permissionObj[key] = identityScopes[key];
          }
          this.setState({
            permissionObj: this.state.permissionObj,
          });
          Config.setPermissionObj(this.state.permissionObj);
        })
        .catch((res) => {
          console.error(res);
        });
    }
  }

  onChange(e) {
    switch (e.target) {
      case this.refs.displayName:
        AppActions.refreshNewAppName(e.target.value);
        AppActions.syncClientId(e.target.value);
        break;
      default:
        break;
    }
    const { activeUserApp } = AppStore.getState();
    this.refs.clientId.value = activeUserApp.clientId === Config.getNewAppId() ? '' : activeUserApp.clientId;
  }

  onBlur(e) {
    e.preventDefault();
    switch (e.target) {
      case this.refs.clientId:
        this.validateClientId(this.refs.clientId.value);
        break;
      case this.refs.redirectURIs:
        this.validateRedirectURIs(this.refs.redirectURIs.value.split(/[ ,]+/));
        break;
      case this.refs.privacyURL:
        this.validatePrivacyURL(this.refs.privacyURL.value);
        break;
      default:
        break;
    }
  }

  onSubmit(e) {
    e.preventDefault();

    let { clientId, redirectURIs, displayName, description, ownerDescription, privacyURL } = this.refs;

    clientId = clientId.value;
    redirectURIs = redirectURIs.value;
    displayName = displayName.value;
    description = description.value;
    ownerDescription = ownerDescription.value;
    privacyURL = privacyURL.value;

    const permissions = this.permissions;
    redirectURIs = redirectURIs.split(/[ ,]+/);

    this.validateClientId(clientId);
    this.validateRedirectURIs(redirectURIs);
    this.validatePrivacyURL(privacyURL);

    if (Object.keys(this.state.validationErrors).length === 0) {
      const activeUserAppReq = {
        clientId,
        redirectURIs,
        displayName,
        description,
        ownerDescription,
        privacyURL,
        permissions,
      };

      AppActions.submitUserApp(activeUserAppReq);
    }
  }

  validateClientId(clientId) {
    const { validationErrors } = this.state;
    delete validationErrors.clientId;
    // clientId check
    if (!/^[a-z0-9-]+$/i.test(clientId)) {
      validationErrors.clientId = {
        title: 'Invalid client ID',
        body: clientId,
      };
    }

    this.setState({
      validationErrors,
    });
  }

  validateRedirectURIs(redirectURIs) {
    const { validationErrors } = this.state;
    delete validationErrors.redirectURIs;
    for (const uri of redirectURIs) {
      if (!(Config.getURLRegex().test(uri) || Config.getLocalhostRegex().test(uri))) {
        if (validationErrors.redirectURIs) {
          validationErrors.redirectURIs.body += `, ${uri}`;
        } else {
          validationErrors.redirectURIs = {
            title: 'Invalid URI(s)',
            body: uri,
          };
        }
      }
    }

    this.setState({
      validationErrors,
    });
  }

  validatePrivacyURL(privacyURL) {
    const { validationErrors } = this.state;
    delete validationErrors.privacyURL;
    if (!(Config.getURLRegex().test(privacyURL) || Config.getLocalhostRegex().test(privacyURL))) {
      validationErrors.privacyURL = {
        title: 'Invalid Privacy URL',
        body: privacyURL,
      };
    }

    this.setState({
      validationErrors,
    });
  }

  updatePermissions(e) {
    if (e.target.checked) {
      this.permissions.push({
        service: e.target.value,
        access: 'full',
      });
    } else {
      this.permissions = this.permissions.filter(elem => {
        const res = elem.service !== e.target.value;
        return res;
      });
    }
  }

  render() {
    const { permissionObj, validationErrors } = this.state;
    return (
      <div className="newAppForm">
        {Object.keys(validationErrors).map(errKey => {
          return (
            <div className="panel panel-danger" key={errKey}>
              <div className="panel-heading">
                <h3 className="panel-title">{validationErrors[errKey].title}</h3>
              </div>
              <div className="panel-body">
                <p>{validationErrors[errKey].body}</p>
              </div>
            </div>
          );
        })}
        <form onSubmit={this.onSubmit} className="form-horizontal">
          <div className="form-group">
            <label htmlFor="displayName" className="col-sm-3 control-label">App Name</label>
            <div className="col-sm-8">
              <input className="col-sm-12" type="text" required ref="displayName" onChange={this.onChange} aria-describedby="displayNameHelp" />
              <span id="displayNameHelp" className="help-block">The name of your application</span>
            </div>
          </div>

          <div className={this.state.validationErrors.clientId ? 'form-group has-error has-feedback' : 'form-group'}>
            <label htmlFor="clientId" className="col-sm-3 control-label">Client ID</label>
            <div className="col-sm-8">
              <input className="col-sm-12" type="text" required onBlur={this.onBlur} ref="clientId" aria-describedby="ClientIDHelp" />
              <span className={this.state.validationErrors.clientId ? 'glyphicon glyphicon-remove form-control-feedback' : 'hidden'} aria-hidden="true" />
              <span id="ClientIDHelp" className="help-block">This is a simplified version of your app name, without spaces or odd characters.</span>
            </div>
          </div>

          <div className={this.state.validationErrors.redirectURIs ? 'form-group has-error has-feedback' : 'form-group'}>
            <label htmlFor="redirectURIs" className="col-sm-3 control-label">Redirect URIs <br />(Comma Separated)</label>
            <div className="col-sm-8">
              <input className="col-sm-12" type="text" onBlur={this.onBlur} ref="redirectURIs" aria-describedby="ClientIDHelp" required />
              <span className={this.state.validationErrors.redirectURIs ? 'glyphicon glyphicon-remove form-control-feedback' : 'hidden'} aria-hidden="true" />
              <span id="RedirectURIsHelp" className="help-block">This is where the OAuth system redirects a user after authentication.  Please use http(s):// in your URI above.</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="col-sm-3 control-label">App Description</label>
            <div className="col-sm-8">
              <textarea className="col-sm-12" rows="2" required ref="description" aria-describedby="descriptionHelp" />
              <span id="descriptionHelp" className="help-block">Tell us a bit about your app and which data sources you're planning to use.</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="ownerDescription" className="col-sm-3 control-label">Owner Description</label>
            <div className="col-sm-8">
              <textarea className="col-sm-12" rows="2" required ref="ownerDescription" aria-describedby="ownerDescriptionHelp" />
              <span id="ownerDescriptionHelp" className="help-block">Who you are / what group this project is for.</span>
            </div>
          </div>

          <div className={this.state.validationErrors.privacyURL ? 'form-group has-error has-feedback' : 'form-group'}>
            <label htmlFor="privacyURL" className="col-sm-3 control-label">Privacy URL</label>
            <div className="col-sm-8">
              <input className="col-sm-12" type="text" required onBlur={this.onBlur} ref="privacyURL" aria-describedby="privacyURLHelp" />
              <span className={this.state.validationErrors.privacyURL ? 'glyphicon glyphicon-remove form-control-feedback' : 'hidden'} aria-hidden="true" />
              <span id="privacyURLHelp" className="help-block">Info about Privacy URL stuffs</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="permissions" className="col-sm-3 control-label">Permissions</label>
            <div className="col-sm-8">
            {Object.keys(permissionObj).map((perm) => {
              return (
                <div key={perm}>
                  <input type="checkbox" value={perm} onClick={this.updatePermissions} /> {permissionObj[perm]}
                </div>
              );
            })}
            </div>
          </div>

          <button type="submit" className="btn btn-primary col-sm-offset-3">Submit</button>
        </form>
      </div>
    );
  }
}

export default UserAppNew;
