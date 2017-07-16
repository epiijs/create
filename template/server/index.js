'use strict'

const path = require('path')
const epiiServer = require('epii-server')

var config = require('./config/server.js')
var env = process.env.NODE_ENV

if (env === 'development') {
  const epiiRender = require('epii-render')
  epiiRender.watch({
    path: {
      root: config.path.root,
      client: config.path.client,
      vendor: config.path.vendor,
      static: config.path.static
    },
    filter: 'component',
    extern: 'react',
    simple: true,
    logger: true
  })
}

config.online = env !== 'development'
epiiServer(config)
