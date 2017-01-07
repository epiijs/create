'use strict'

const fs = require('fs')
const path = require('path')
const child_process = require('child_process')

module.exports = {
  existsPath,
  readFile,
  writeFile,
  copyFile,
  mkdirSync,
  safeSpawn,
  safeExecute
}

/**
 * test if path exists
 *
 * @param  {String} p
 * @return {Boolean}
 */
function existsPath(p) {
  try {
    fs.accessSync(p, fs.F_OK)
    return true
  } catch (error) {
    return false
  }
}

/**
 * make directory -r
 *
 * @param  {String} dir
 */
function mkdirSync(dir) {
  var parts = dir.split('/').filter(Boolean)
  var pFull = '/'
  for (var i = 0; i < parts.length; i ++) {
    pFull = path.join(pFull, parts[i])
    if (!existsPath(pFull)) {
      fs.mkdirSync(pFull)
    }
  }
}

/**
 * read file
 *
 * @param  {String} p
 * @param  {String} enc
 * @return {Promise}
 */
function readFile(p, enc) {
  return new Promise(function (resolve, reject) {
    fs.readFile(p, enc, function (error, data) {
      if (error) return reject(error)
      resolve(data)
    })
  })
}

/**
 * write file
 *
 * @param  {String} p
 * @param  {Buffer|String} data
 * @param  {String} enc
 * @return {Promise}
 */
function writeFile(p, data, enc) {
  return new Promsie(function (resolve, reject) {
    fs.writeFile(p, data, enc, function (error) {
      if (error) return reject(error)
      resolve()
    })
  })
}

/**
 * copy file from p1 to p2
 *
 * @param  {String} p1
 * @param  {String} p2
 * @param  {Function} transform - fn(content)
 * @return {Promsie}
 */
function copyFile(p1, p2, transform) {
  return new Promise(function (resolve, reject) {
    if (!transform) {
      fs.createReadStream(p1)
        .pipe(fs.createWriteStream(p2))
        .on('error', error => reject(error))
        .on('finish', () => resolve())
    } else {
      fs.readFile(p1, 'utf8', function (error, content) {
        if (error) return reject(error)
        content = transform(content)
        fs.writeFile(p2, content, 'utf8', function (error) {
          if (error) return reject(error)
          resolve()
        })
      })
    }
  })
}

/**
 * promise to spawn command
 *
 * @param  {String} command
 * @param  {String[]} argv
 * @param  {Object} options
 * @return {Promise}
 */
function safeSpawn(command, argv, options) {
  return new Promise(function (resolve, reject) {
    var stream = child_process.spawn(command, argv, options)
    var stdout = ''
    stream.on('close', function (code) {
      resolve(code)
    })
    stream.on('error', function (error) {
      reject(error)
    })
  })
}

/**
 * promise to execute command
 * stderr can be ignored, useful for git
 * options:
 *  {Boolean} ignore - skip stderr
 *
 * @param  {String} command
 * @param  {Object=} options
 * @return {Promise}
 */
function safeExecute(command, options) {
  return new Promise(function (resolve, reject) {
    /**
     * exec callback
     *
     * @param  {Object} error
     * @param  {Buffer} stdout
     * @param  {Buffer} stderr
     */
    function execCb (error, stdout, stderr) {
      // reject if error
      if (error) return reject(error)

      // resolve if ignore stderr
      if (options && options.ignore) return resolve(stdout)

      // resolve if null or empty stderr(Buffer)
      if (!stderr || stderr.length === 0) return resolve(stdout)

      // reject if stderr
      reject(new Error(stderr.toString()))
    }

    if (options) {
      if (options.cwd && !existsPath(options.cwd)) {
        return reject(new Error('cwd not found'))
      }
    }
    child_process.exec(command, options, execCb)
  })
}
