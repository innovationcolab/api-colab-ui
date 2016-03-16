import React, { Component } from 'react';
import AppActions from '../../actions/AppActions.jsx';
import AppStore from '../../stores/AppStore.jsx';
import UserApp from './UserApp.jsx';

class UserAppList extends Component {
  constructor(props) {
    super(props);

    this.add = this.add.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  add(e) {
    e.preventDefault();

    AppActions.addUserApp();
  }

  cancel(e) {
    e.preventDefault();

    AppActions.cancelAddUserApp();
  }

  render() {
    const { addingNewApp, userApps } = AppStore.getState();
    const addActive = addingNewApp ? 'hidden' : '';
    const cancelActive = addingNewApp ? '' : 'hidden';
    return (
      <div>
				<div className="logobox">
					<img src="images/appreglogo.png" alt="app registration logo" />
				</div>
        <div className="AppList">
          <p>Click to view details of your registered apps:</p>
          <ul id="applist">
            {userApps.map((app) => {
              const key = app.clientId;
              return (
                <UserApp
                  userApp={app}
                  key={key}
                />
              );
            })}
          </ul>
        </div>
        <a className={addActive} onClick={this.add}>Add an app</a>
        <a className={cancelActive} onClick={this.cancel}>Cancel</a>
      </div>
    );
  }
}

export default UserAppList;
