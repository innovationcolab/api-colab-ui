import querystring from 'querystring'

class Config {
  static getNewAppId() {
    return 'fSXfFUCAJgJFN6Mn5Flp'
  }

  static getUserApps() {
    return JSON.parse(sessionStorage.getItem('userApps')) || []
  }

  static getPermissionObj() {
    return JSON.parse(sessionStorage.getItem('permissionObj')) || {}
  }

  static setPermissionObj(obj) {
    sessionStorage.setItem('permissionObj', JSON.stringify(obj))
  }

  static getState() {
    return '842867'
  }

  static getQueryString() {
    return querystring.stringify({
      response_type: 'token',
      redirect_uri: 'http://localhost:3001',
      client_id: 'vw-test',
      scope: 'meta:apps:write meta:apps:read oauth_registrations',
      state: '842867'
    })
  }
}

export default Config
