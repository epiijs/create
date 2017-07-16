'use strict'

const path = require('path')
const epiiRender = require('epii-render')

var config = require('./config/server.js')

epiiRender.build({
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
