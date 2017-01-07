'use strict'

const child_process = require('child_process')
const fs = require('fs')
const path = require('path')
const glob = require('glob')

const assist = require('../kernel/assist.js')
const logger = require('../kernel/logger.js')
const system = require('../kernel/system.js')

module.exports = function* (query) {
  // output empty line
  logger.line()

  // verify project
  if (!query.project || !/^[a-zA-Z0-9\-_]+$/.test(query.project)) {
    logger.halt('please enter your project name')
    logger.warn('project name can contain a-z, A-Z, 0-9, -, _')
    return logger.line()
  }

  // get system info
  var systemInfo = system()
  logger.info('project name =>', query.project)
  logger.info('author name =>', systemInfo.authorName || '(not defined)')
  logger.info('author email =>', systemInfo.authorEmail || '(not defined)')

  // create cwd + name
  var sourceDir = path.join(__dirname, '../template')
  var targetDir = path.join(systemInfo.workDir, query.project)
  logger.warn('target directory =>', targetDir)
  if (assist.existsPath(targetDir)) {
    logger.halt('target directory already exists')
    var existedFiles = fs.readdirSync(targetDir)
    if (existedFiles.length > 0) {
      return logger.line()
    }
    logger.warn('target directory is empty')
  } else {
    assist.mkdirSync(targetDir)
  }

  // list template files
  logger.line()
  logger.info('prepare template')
  var entries = glob
    .sync(sourceDir + '/**')
    .filter(entry => entry !== sourceDir)
    .map(entry => {
      return {
        source: entry,
        target: path.join(targetDir, path.relative(sourceDir, entry))
      }
    })
  logger.done(entries.length, 'entries to transform')
  // console.log(entries)

  // build target dir tree
  entries
    .filter(entry => fs.statSync(entry.source).isDirectory())
    .forEach(entry => assist.mkdirSync(entry.target))
  logger.done('target dir tree built')

  // copy files & rename dot
  yield Promise.all(entries
    .filter(entry => fs.statSync(entry.source).isFile())
    .map(entry => {
      if (/_d_/.test(entry.source)) {
        return assist.copyFile(entry.source, entry.target.replace('_d_', '.'))
      } else {
        return assist.copyFile(
          entry.source, entry.target.replace('_t_', ''),
          content => content
            .replace(/\$\{project\}/g, query.project)
            .replace(/\$\{author\}/g, systemInfo.authorName)
        )
      }
    })
  )
  logger.done('template copy finished')

  // init git repository
  logger.line()
  logger.info('init git repository');
  yield assist.safeExecute(
    'git init && git add .',
    { cwd: targetDir, stdio: 'inherit' }
  )

  // install dependencies
  logger.info('install dependencies');
  yield assist.safeSpawn(
    'npm', ['i', '--registry=http://registry.npm.taobao.org'],
    { cwd: targetDir, stdio: 'inherit' }
  )

  // output launch hints
  logger.line()
  logger.done('project ready')
  logger.done(`launch app by [cd ${query.project} && npm run devp]`)
  logger.line()
}
