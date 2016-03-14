import alt from '../alt'
import axios from 'axios'
import querystring from 'querystring'
import AuthActions from '../actions/AuthActions.jsx'
import Config from '../components/Config.jsx'

class AuthStore {
  constructor() {
    this.bindActions(AuthActions)

    this.accessToken = null
    this.error = null
  }

  /**
   * Login handler
   * @param hash
   */
  onLogin(hash) {
    const paramObj = querystring.parse(hash.slice(1, hash.length))

    if (paramObj.state !== Config.getState()) {
      console.error('state mismatch')
      this.setState({ accessToken: null, error: 'state mismatch'})
      return
    }
    console.info(paramObj)
    this.saveTokens(paramObj)
    this.loginSuccess()
  }

  /**
   * Process login success
   * @param user
   */
  loginSuccess() {
    location.assign('/')
  }

  /**
   * Handle login error
   * @param response
   */
  loginError(response) {
    this.setState({ accessToken: null, error: response.data.error_description})
  }

  /**
   * Try to connect user from local storage
   */
  onLocalLogin() {
    let accessToken = localStorage.getItem('access_token')

    if (accessToken) {
      this.saveTokens({access_token: accessToken})
    }
  }

  /**
   * Save tokens in local storage and automatically add token within request
   * @param params
   */
  saveTokens(params) {
    const {access_token} = params
    localStorage.setItem('access_token', access_token)
    this.setState({ accessToken: access_token, error: null})
  }
}

export default alt.createStore(AuthStore, 'AuthStore')
