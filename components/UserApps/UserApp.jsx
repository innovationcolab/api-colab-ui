import React, { Component } from 'react';
import AppActions from '../../actions/AppActions.jsx';
import AppStore from '../../stores/AppStore.jsx';

class UserApp extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();

    AppActions.setActiveUserApp(this.props.userApp);
  }

  render() {
    const { userApp } = this.props;
    const { activeUserApp } = AppStore.getState();
    const isActive = userApp === activeUserApp ? 'active' : '';
    return (
      <li className={isActive}>
        <a onClick={this.onClick}>
          {this.props.userApp.displayName}
        </a>
      </li>
    );
  }
}

UserApp.propTypes = {
  userApp: React.PropTypes.object.isRequired,
};

export default UserApp;
