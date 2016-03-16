import alt from '../alt'
import axios from 'axios'
import querystring from 'querystring'
import AuthActions from '../actions/AuthActions.jsx'
import AppActions from '../actions/AppActions.jsx'
import Config from '../components/Config.jsx'

class AuthStore {
  constructor() {
    this.bindActions(AuthActions)

    this.accessToken = null
    this.error = null
    this.user = null
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
    this.saveTokens(paramObj)
    this.loginSuccess()
  }

  /**
   * Process login success
   * @param user
   */
  loginSuccess() {
    axios
      .get('https://api.colab.duke.edu/identity/v1/', {
        headers: {
          'x-api-key': Config.getClientId(),
          'Authorization': 'Bearer ' + this.accessToken,
          'Accept': 'application/json'
        }
      })
      .then( res => {
        let user = res.data
        user = {
          lastName: user.lastName,
          firstName: user.firstName,
          nickname: user.nickname
        }
        this.setState({ user })
        localStorage.setItem('user', JSON.stringify(user))
        AppActions.refreshUser(user)
        location.assign('/')
      })
      .catch( res => {
        console.error(res)
      })
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
    let user = JSON.parse(localStorage.getItem('user'))

    if (accessToken && user) {
      this.saveTokens({access_token: accessToken, user})
    }
  }

  /**
   * Try to re authenticate user
   */
  onReInit() {
    localStorage.removeItem('access_token')
    location.assign('https://oauth.oit.duke.edu/oauth/authorize.php' + '?' + Config.getQueryString())
  }

  /**
   * Save tokens in local storage and automatically add token within request
   * @param params
   */
  saveTokens(params) {
    const {access_token, user} = params
    localStorage.setItem('access_token', access_token)
    this.setState({ accessToken: access_token, error: null, user})
  }

  onLogout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')

    location.assign('/')
  }
}

export default alt.createStore(AuthStore, 'AuthStore')
