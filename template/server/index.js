'use strict'

const path = require('path')
const epiiServer = require('epii-server')

var config = require('./config/server.js')
var env = process.env.NODE_ENV

if (env === 'development') {
  const epiiRender = require('epii-render')
  var clientDir = path.join(config.path.root, config.path.client)
  var staticDir = path.join(config.path.root, config.path.static, 'client')
  epiiRender.watch({
    client: clientDir,
    static: staticDir,
    filter: 'component',
    extern: 'react',
    simple: true,
    logger: true
  })
}

epiiServer(config)
