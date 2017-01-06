const config = require('../config/server.js')

module.exports = {
  head: {
    title: '${project}',
    metas: {
      name: 'viewport',
      content: 'width=device-width,initial-scale=1,maximum-scale=1'
    }
  },
  body: {
    scripts: config.online ? [
      'client/common.js',
      '//cdn.bootcss.com/react/15.4.1/react.js',
      '//cdn.bootcss.com/react/15.4.1/react-dom.js',
    ] : [
      '//cdn.bootcss.com/react/15.4.1/react.js',
      '//cdn.bootcss.com/react/15.4.1/react-dom.js',
    ],
    launch: 'client/launch.js'
  }
}
