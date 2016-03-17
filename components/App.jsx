import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import UserAppContainer from './UserApps/UserAppContainer.jsx';
import AppActions from '../actions/AppActions.jsx';
import AppStore from '../stores/AppStore.jsx';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = AppStore.getState();

    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    AppStore.listen(this.onChange);
    AppActions.getUserApps();
  }

  componentWillUnmount() {
    AppStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  onClick(e) {
    e.preventDefault();
    location.assign('/');
  }

  closeModal() {
    this.setState({
      showNoRefreshModal: false,
    });
  }

  render() {
    if (this.state.error) {
      const { error } = this.state;
      if (error.type === 'no_refresh') {
        this.setState({
          showRefreshModal: false,
          showNoRefreshModal: true,
        });
      } else {
        this.setState({
          showRefreshModal: true,
          showNoRefreshModal: false,
        });
      }
    }
    if (this.state.user !== undefined) {
      return (
        <div className="container">
          <UserAppContainer
            {...this.state}
          />
          <Modal show={this.state.showRefreshModal}>
            <Modal.Header>
              <Modal.Title>Error, refreshing required.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>{this.state.error.msg}</p>
              <Button bsStyle="danger" block onClick={this.onClick}>Refresh</Button>
            </Modal.Body>
          </Modal>
          <Modal show={this.state.showNoRefreshModal} onHide={this.closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>{this.state.error.msg}</p>
              <Button bsStyle="danger" block onClick={this.closeModal}>OK</Button>
            </Modal.Body>
          </Modal>
        </div>
      );
    }
    return (
      <div className="container">
        <img src="images/loading.gif" alt="loading..." className="img-responsive center-block" />
        <p className="text-center">Rendering...</p>
      </div>
    );
  }
}

export default App;
