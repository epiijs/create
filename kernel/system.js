'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')

const ini = require('ini')
const assist = require('./assist.js')

module.exports = function getSystemInfo() {
  var homeDir = os.homedir()
  var workDir = process.cwd()

  var osUserName = process.platform === 'win32' ?
    process.env.USERNAME || path.basename(homeDir).toLowerCase() :
    homeDir && homeDir.split('/').pop() || 'root'

  var gitConfigPath = path.join(homeDir, '.gitconfig')
  var userInfo = {}
  if (assist.existsPath(gitConfigPath)) {
    userInfo = ini.parse(fs.readFileSync(gitConfigPath, 'utf8')) || {}
  }

  return {
    workDir,
    homeDir,
    userName: osUserName,
    authorName: userInfo.name || '',
    authorEmail: userInfo.email || ''
  }
}
