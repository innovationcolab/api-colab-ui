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
    this.onClick = this.onClick.bind(this);
    this.validateClientId = this.validateClientId.bind(this);
    this.validatePrivacyURL = this.validatePrivacyURL.bind(this);

    this.updatePermissions = this.updatePermissions.bind(this);
    this.permissions = [];
  }

  componentDidMount() {
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
          AppActions.handleError({ type: 'permission_error', body: res });
        });
    }
  }

  onRedirectURIsChange(idx) {
    if (idx) {
      if (idx === 0) {
        throw new Error('Do not change the mandatory URI!');
      }
      const { activeUserApp } = AppStore.getState();
      activeUserApp.redirectURIs[idx] = this.refs[`redirectURIs${idx}`].value;
      AppActions.syncActiveUserApp(activeUserApp);
    }
  }

  onChange(e) {
    switch (e.target) {
      case this.refs.displayName:
        AppActions.refreshNewAppName(e.target.value);
        AppActions.syncClientId(e.target.value);
        break;
      case this.refs.clientId:
        AppActions.syncActiveUserApp({
          clientId: this.refs.clientId.value,
        });
        break;
      case this.refs.description:
        AppActions.syncActiveUserApp({
          description: this.refs.description.value,
        });
        break;
      case this.refs.ownerDescription:
        AppActions.syncActiveUserApp({
          ownerDescription: this.refs.ownerDescription.value,
        });
        break;
      case this.refs.privacyURL:
        AppActions.syncActiveUserApp({
          privacyURL: this.refs.privacyURL.values,
        });
        break;
      default:
        break;
    }
  }

  onRedirectURIsBlur(idx) {
    this.validateRedirectURI(idx, this.refs[`redirectURIs${idx}`].value);
  }

  onBlur(e) {
    e.preventDefault();
    const { activeUserApp } = AppStore.getState();
    switch (e.target) {
      case this.refs.clientId:
        this.validateClientId(activeUserApp.clientId);
        break;
      case this.refs.privacyURL:
        this.validatePrivacyURL(activeUserApp.privacyURL);
        break;
      default:
        break;
    }
  }

  onClick(e) {
    e.preventDefault();

    const { activeUserApp } = AppStore.getState();

    const plusPos = e.target.className.indexOf('glyphicon-plus');
    const minusPos = e.target.className.indexOf('glyphicon-minus');
    if (plusPos !== -1 && minusPos !== -1) {
      throw new Error('UI error. Conflicting "+" and "-" detected.');
    } else if (plusPos !== -1) {
      activeUserApp.redirectURIs.push('');
      AppActions.syncActiveUserApp(activeUserApp);
    } else {
      const uriPos = activeUserApp.redirectURIs.indexOf(e.target.value);
      activeUserApp.redirectURIs.splice(uriPos, 1);
      AppActions.syncActiveUserApp(activeUserApp);
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const { activeUserApp } = AppStore.getState();
    const permissions = this.permissions;

    this.validateClientId(activeUserApp.clientId);
    activeUserApp.redirectURIs.forEach((item, idx) => {
      this.validateRedirectURI(idx, item);
    });
    this.validatePrivacyURL(activeUserApp.privacyURL);

    if (Object.keys(this.state.validationErrors).length === 0) {
      const activeUserAppReq = {
        clientId: activeUserApp.clientId,
        redirectURIs: activeUserApp.redirectURIs,
        displayName: activeUserApp.displayName,
        description: activeUserApp.description,
        ownerDescription: activeUserApp.ownerDescription,
        privacyURL: activeUserApp.privacyURL,
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

  validateRedirectURI(index, uri) {
    const { validationErrors } = this.state;
    delete validationErrors[`redirectURIs${index}`];
    if (!(Config.getURLRegex().test(uri) || Config.getLocalhostRegex().test(uri))) {
      validationErrors[`redirectURIs${index}`] = {
        title: 'Invalid URI',
        body: uri,
      };
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
    const { activeUserApp } = AppStore.getState();
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
              <input className="col-sm-12" type="text" required ref="displayName" value={activeUserApp.displayName} onChange={this.onChange} aria-describedby="displayNameHelp" />
              <span id="displayNameHelp" className="help-block">The name of your application</span>
            </div>
          </div>

          <div className={this.state.validationErrors.clientId ? 'form-group has-error has-feedback' : 'form-group'}>
            <label htmlFor="clientId" className="col-sm-3 control-label">Client ID</label>
            <div className="col-sm-8">
              <input className="col-sm-12" type="text" required ref="clientId" value={activeUserApp.clientId} onChange={this.onChange} onBlur={this.onBlur} aria-describedby="ClientIDHelp" />
              <span className={this.state.validationErrors.clientId ? 'glyphicon glyphicon-remove form-control-feedback' : 'hidden'} aria-hidden="true" />
              <span id="ClientIDHelp" className="help-block">This is a simplified version of your app name, without spaces or odd characters.</span>
            </div>
          </div>

          {activeUserApp.redirectURIs.map((item, idx) => {
            if (item !== 'http://apidocs.colab.duke.edu/o2c.html') {
              const boundChange = this.onRedirectURIsChange.bind(this, idx);
              const boundBlur = this.onRedirectURIsBlur.bind(this, idx);
              return (
                <div key={idx} className={this.state.validationErrors[`redirectURIs${idx}`] ? 'form-group has-error has-feedback' : 'form-group'}>
                  <label htmlFor="redirectURIs" className="col-sm-3 control-label">Redirect URI</label>
                  <div className="col-sm-8">
                    <input name="redirectURIs" className="col-sm-12" type="text" onBlur={boundBlur} ref={`redirectURIs${idx}`} value={item} onChange={boundChange} aria-describedby="RedirectURIsHelp" required />
                    <span className={this.state.validationErrors.redirectURIs ? 'glyphicon glyphicon-remove form-control-feedback' : 'hidden'} aria-hidden="true" />
                    <span id="RedirectURIsHelp" className="help-block">This is where the OAuth system redirects a user after authentication.  Please use http(s):// in your URI above.</span>
                  </div>
                  <div className="col-sm-1 plus-button">
                    <span className="glyphicon glyphicon-minus" onClick={this.onClick} />
                  </div>
                </div>
              );
            }
            return (
            <div key={idx} className="form-group">
              <label htmlFor="redirectURIs" className="col-sm-3 control-label">API Docs <br /> Redirect URI</label>
              <div className="col-sm-8">
                <input name="redirectURIs" className="col-sm-12 form-control" type="text" ref={`redirectURIs${idx}`} value={item} aria-describedby="RedirectURIsHelp" disabled />
                <span id="RedirectURIsHelp" className="help-block">This is the mandatory redirect URI for any application to explore the Co-Lab API documentations.</span>
              </div>
              <div className="col-sm-1 minus-button">
                <span className="glyphicon glyphicon-plus" onClick={this.onClick} />
              </div>
            </div>
            );
          })}

          <div className="form-group">
            <label htmlFor="description" className="col-sm-3 control-label">App Description</label>
            <div className="col-sm-8">
              <textarea className="col-sm-12" rows="2" required ref="description" value={activeUserApp.description} onChange={this.onChange} aria-describedby="descriptionHelp" />
              <span id="descriptionHelp" className="help-block">Tell us a bit about your app and which data sources you're planning to use.</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="ownerDescription" className="col-sm-3 control-label">Owner Description</label>
            <div className="col-sm-8">
              <textarea className="col-sm-12" rows="2" required ref="ownerDescription" value={activeUserApp.ownerDescription} onChange={this.onChange} aria-describedby="ownerDescriptionHelp" />
              <span id="ownerDescriptionHelp" className="help-block">Who you are / what group this project is for.</span>
            </div>
          </div>

          <div className={this.state.validationErrors.privacyURL ? 'form-group has-error has-feedback' : 'form-group'}>
            <label htmlFor="privacyURL" className="col-sm-3 control-label">Privacy URL</label>
            <div className="col-sm-8">
              <input className="col-sm-12" type="text" required ref="privacyURL" value={activeUserApp.privacyURL} onChange={this.onChange} onBlur={this.onBlur} aria-describedby="privacyURLHelp" />
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
