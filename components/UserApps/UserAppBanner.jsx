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
    const name = user.nickname === undefined ? user.firstName + user.lastName : user.nickname + user.lastName;
    return (
      <div>
        {name}
        <a href="" onClick={this.onClick}>Log out</a>
      </div>
    );
  }
}

export default UserAppBanner;
