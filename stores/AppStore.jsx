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
      if (/^[a-z0-9-]+$/i.test(c)) {
        convertedClientId += c;
      } else {
        convertedClientId += '-';
      }
    }
    const { activeUserApp, userApps } = this
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
      .delete('https://api.colab.duke.edu/meta/v1/apps', staleApp, {
        headers: {
          'x-api-key': Config.getClientId(),
          Authorization: `Bearer ${AuthStore.getState().accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(res => {
        let { userApps, activeUserApp } = this;
        userApps = userApps.filter((item) => {
          return item !== staleApp;
        });
        activeUserApp = {};
      })
      .catch(res => {
        console.error(res);
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
      .post('https://api.colab.duke.edu/meta/v1/apps', newAppReq, {
        headers: {
          'x-api-key': Config.getClientId(),
          Authorization: `Bearer ${AuthStore.getState().accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(res => {
        console.info(res);

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
        console.error(res);

        let { error } = this;
        error = res.data;
        this.setState({
          error,
        });
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
        console.error(res);
        if (res.status === 401 && res.data.error === 'Thrown out by the AuthManager: Couldn\'t determine scopes for this token.') {
          AuthActions.reInit();
        }
      });
  }
}

export default alt.createStore(AppStore, 'AppStore');
