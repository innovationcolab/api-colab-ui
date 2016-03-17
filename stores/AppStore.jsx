import alt from '../alt';
import axios from 'axios';
import AppActions from '../actions/AppActions.jsx';
import AuthActions from '../actions/AuthActions.jsx';
import AuthStore from '../stores/AuthStore.jsx';
import Config from '../components/Config.jsx';

class AppStore {
  constructor() {
    this.bindActions(AppActions);

    this.userApps = Config.getUserApps();
    this.activeUserApp = {};
    this.addingNewApp = false;
    this.error = {};
    this.showRefreshModal = false;
    this.showNoRefreshModal = false;
    this.user = undefined;
  }

  onRefreshUser(user) {
    this.setState({
      user,
    });
  }

  onRefreshNewAppName(name) {
    const { activeUserApp, userApps } = this;
    activeUserApp.displayName = userApps[userApps.length - 1].displayName = name;
    this.setState({
      activeUserApp,
      userApps,
    });
  }

  onSyncClientId(name) {
    if (name.length === 0) {
      const { activeUserApp } = this;
      activeUserApp.clientId = Config.getNewAppId();
      return;
    }
    let convertedClientId = '';
    for (const c of name) {
      if (/^[A-Z]+$/.test(c)) {
        convertedClientId += c.toLowerCase();
      } else if (/^[a-z0-9-]+$/i.test(c)) {
        convertedClientId += c;
      } else {
        convertedClientId += '-';
      }
    }
    const { activeUserApp, userApps } = this;
    activeUserApp.clientId = userApps[userApps.length - 1].clientId = convertedClientId;
    this.setState({
      activeUserApp,
      userApps,
    });
  }

  onAddUserApp() {
    const { userApps } = this;
    let { activeUserApp, addingNewApp } = this;
    activeUserApp = {
      newApp: true,
      clientId: Config.getNewAppId(),
      displayName: '',
      privacyURL: Config.getDefaultPrivacyURL(),
    };
    userApps.push(activeUserApp);
    addingNewApp = true;
    this.setState({ userApps, activeUserApp, addingNewApp });
  }

  onDeleteUserApp(staleApp) {
    axios
      .delete('https://api.colab.duke.edu/meta/v1/apps', {
        headers: {
          'x-api-key': Config.getClientId(),
          Authorization: `Bearer ${AuthStore.getState().accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: staleApp,
      })
      .then(() => {
        let { userApps, activeUserApp } = this;
        userApps = userApps.filter((item) => {
          return item !== staleApp;
        });
        activeUserApp = {};
        this.setState({
          activeUserApp,
          userApps,
        });
      })
      .catch(res => {
        AppActions.handleError({ type: 'delete_error', body: res });
      });
  }

  onCancelAddUserApp() {
    const { userApps } = this;
    let { activeUserApp, addingNewApp } = this;
    activeUserApp = {};
    userApps.pop();
    addingNewApp = false;
    this.setState({ userApps, activeUserApp, addingNewApp });
  }

  onSetActiveUserApp(newActiveUserApp) {
    let { activeUserApp } = this;
    activeUserApp = newActiveUserApp;
    this.setState({ activeUserApp });
  }

  onSubmitUserApp(newAppReq) {
    // console.info(newAppReq)
    // console.log(JSON.stringify(newAppReq))
    axios
      .post('https://api.colab.duke.edu/meta/v1/apps', JSON.stringify(newAppReq), {
        headers: {
          'x-api-key': Config.getClientId(),
          Authorization: `Bearer ${AuthStore.getState().accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(res => {
        const { userApps } = this;
        let { activeUserApp, addingNewApp } = this;
        userApps.pop();
        userApps.push(res.data);
        activeUserApp = res.data;
        addingNewApp = false;
        this.setState({
          userApps,
          activeUserApp,
          addingNewApp,
        });
      })
      .catch(res => {
        AppActions.handleError({ type: 'submit_error', body: res });
      });
  }

  onGetUserApps() {
    axios
      .get('https://api.colab.duke.edu/meta/v1/apps', {
        headers: {
          'x-api-key': Config.getClientId(),
          Authorization: `Bearer ${AuthStore.getState().accessToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        const userApps = res.data;
        this.setState({
          user: AuthStore.getState().user,
          userApps,
        });
      })
      .catch(res => {
        if (res.status === 401 && res.data.error === 'Thrown out by the AuthManager: Couldn\'t determine scopes for this token.') {
          AuthActions.reInit();
        } else {
          AppActions.handleError({ type: 'list_error', body: res });
        }
      });
  }

  onHandleError(err) {
    switch (err.type) {
      case 'list_error':
        this.setState({
          error: {
            type: 'refresh',
            msg: 'An error occurred while retrieving your application list. Click the button below to retry.',
          },
        });
        break;
      case 'identity_error':
        this.setState({
          error: {
            type: 'no_refresh',
            msg: 'An error occurred while retrieving your identity. Please refresh the page at some other time to retry.',
          },
        });
        break;
      case 'submit_error':
        this.setState({
          error: {
            type: 'no_refresh',
            msg: 'An error occurred during submitting your request. Please retry at some other time.',
          },
        });
        break;
      case 'delete_error':
        this.setState({
          error: {
            type: 'no_refresh',
            msg: 'An error occurred during deleting your app. Please retry at some other some.',
          },
        });
        break;
      case 'state_mismatch':
        this.setState({
          error: {
            type: 'refresh',
            msg: 'An error while retrieving available permissions for the new app. Click the button below to retry.',
          },
        });
        break;
      default:
        this.setState({
          error: {
            type: 'no_refresh',
            msg: 'An unknown error has occured',
          },
        });
    }
  }
}

export default alt.createStore(AppStore, 'AppStore');
