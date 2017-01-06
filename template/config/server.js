'use strict'

const path = require('path')

module.exports = {
  name: '${project}',
  port: 8080,
  path: {
    root: path.join(__dirname, '../'),
    server: {
      controller: 'server/controller',
      middleware: 'server/middleware'
    },
    client: 'client',
    layout: 'layout',
    vendor: 'vendor',
    static: 'static',
    upload: 'upload'
  },
  prefix: {
    static: '__static'
  }
}
