import React, { Component } from 'react';
import AuthActions from '../../actions/AuthActions.jsx';
import AppStore from '../../stores/AppStore.jsx';

class UserAppBanner extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();

    AuthActions.logout();
  }

  render() {
    const { user } = AppStore.getState();
    const name = user.nickname === undefined ? user.firstName + ' ' + user.lastName : user.nickname + ' ' + user.lastName;
    return (
      <div className="user-control">
        <p>Hi, {name}</p>
        <p><a href="" onClick={this.onClick}> Log out</a></p>
      </div>
    );
  }
}

export default UserAppBanner;
