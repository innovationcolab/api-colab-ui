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
}

export default Config
