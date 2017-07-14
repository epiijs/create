'use strict'

const path = require('path')
const epiiRender = require('epii-render')

var config = require('./config/server.js')

var clientDir = path.join(config.path.root, config.path.client)
var staticDir = path.join(config.path.root, config.path.static, 'client')
var vendorDir = path.join(config.path.root, config.path.vendor)

epiiRender.build({
  client: clientDir,
  static: staticDir,
  vendor: vendorDir,
  filter: 'component',
  extern: 'react',
  simple: true,
  logger: true
})
