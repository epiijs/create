'use strict'

const path = require('path')
const epiiRender = require('epii-render')

var config = require('./config/server.js')

var p_client = path.join(config.path.root, config.path.client)
var p_vendor = path.join(config.path.root, config.path.vendor)
var p_static = path.join(config.path.root, config.path.static, 'client')

epiiRender.build({
  client: p_client,
  static: p_static,
  vendor: p_vendor,
  filter: 'component',
  extern: 'react',
  simple: true,
  logger: true
})
