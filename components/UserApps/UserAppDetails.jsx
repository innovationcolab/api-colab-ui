import React, { Component } from 'react';
import { Button, Modal, Input } from 'react-bootstrap';
import AppActions from '../../actions/AppActions.jsx';
import AppStore from '../../stores/AppStore.jsx';

class UserAppDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: true,
      showModal: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.triggerDelete = this.triggerDelete.bind(this);
  }

  onChange() {
    const { confirm } = this.refs;
    if (confirm.getValue() === AppStore.getState().activeUserApp.clientId) {
      this.setState({
        disabled: false,
      });
    } else {
      this.setState({
        disabled: true,
      });
    }
  }

  onClick(e) {
    e.preventDefault();
    this.setState({
      showModal: true,
    });
  }

  closeModal() {
    this.setState({
      showModal: false,
    });
  }

  triggerDelete(e) {
    e.preventDefault();
    if (!this.state.disabled) {
      const deleteReq = AppStore.getState().activeUserApp;
      delete deleteReq.expiration;
      delete deleteReq.appOwners;
      delete deleteReq.clientSecret;
      AppActions.deleteUserApp(deleteReq);
    }
  }

  render() {
    const { activeUserApp } = AppStore.getState();
    const redirectURL = `http://apidocs.colab.duke.edu?clientId=${activeUserApp.clientId}`;
    return (
      <div className="appDetails">
        <h3>App Details</h3>
        <a className="btn btn-success" href={redirectURL}>Explore Co-Lab APIs for this app</a>
        <div className="row">
          <div className="col-sm-3 title">
            <p>App Name</p>
          </div>
          <div className="col-sm-9 description">
            <p>{activeUserApp.displayName}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-3 title">
            <p>Client ID</p>
          </div>
          <div className="col-sm-9 description">
            <p>{activeUserApp.clientId}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-3 title">
            <p>Description</p>
          </div>
          <div className="col-sm-9 description">
            <p>{activeUserApp.description}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-3 title">
            <p>Owner Description</p>
          </div>
          <div className="col-sm-9 description">
            <p>{activeUserApp.ownerDescription}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-3 title">
            <p>Privacy URL</p>
          </div>
          <div className="col-sm-9 description">
            <p>{activeUserApp.privacyURL}</p>
          </div>
        </div>
        <div className="row">

          <div className="col-sm-3 title">
            <p>Permissions</p>
          </div>
          <div className="col-sm-9 description">
            {activeUserApp.permissions.map((perm) => {
              return (
                <p key={perm.service}>service: {perm.service}</p>
              );
            })}
          </div>
        </div>
        <Button bsStyle="primary" onClick={this.onClick}>Edit App Details</Button>
        <Button bsStyle="danger" onClick={this.onClick}>Delete App</Button>
        <Modal show={this.state.showModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Deleting app <strong>{activeUserApp.displayName}</strong>...</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>You are deleting the app {activeUserApp.displayName}. Please type the app's client ID <code>{activeUserApp.clientId}</code> below to confirm.</p>
            <Input type="text" ref="confirm" onChange={this.onChange} />
            <Button bsStyle="danger" block disabled={this.state.disabled} onClick={this.triggerDelete}>Yes, delete this app.</Button>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default UserAppDetails;
