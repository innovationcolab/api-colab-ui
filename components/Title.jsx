import React, { Component } from 'react'
import Config from './Config.jsx'

class Title extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    const url = 'https://oauth.oit.duke.edu/oauth/authorize.php' + '?' + Config.getQueryString()
    return (
      <div>
        <h1>title page</h1>
        <a href={url}>Login with Duke OAuth</a>
      </div>
    )
  }
}

export default Title
