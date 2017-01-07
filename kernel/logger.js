'use strict'

const chalk = require('chalk')

const LOGO = ' EPII '
const TYPE = {
  info: 'blue',
  warn: 'yellow',
  halt: 'red',
  done: 'green'
}
const TYPE_NAMES = Object.keys(TYPE)

module.exports = {
  line: function () { console.log() }
}

Object.keys(TYPE).forEach(name => {
  module.exports[name] = function () {
    var head = chalk.bgBlack[TYPE[name]](LOGO)
    var args = Array.prototype.slice.call(arguments, 0)
    console.log.apply(null, [head].concat(args))
  }
})
