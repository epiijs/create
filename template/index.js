'use strict'

const path = require('path')
const epiiServer = require('epii-server')

var config = require('./config/server.js')
var env = process.env.NODE_ENV

if (env === 'development') {
  const epiiRender = require('epii-render')
  var p_client = path.join(config.path.root, config.path.client)
  var p_static = path.join(config.path.root, config.path.static, 'client')
  epiiRender.watch({
    client: p_client,
    static: p_static,
    filter: 'component',
    extern: 'react',
    simple: true,
    logger: true
  })
}

epiiServer([require('./config')])
