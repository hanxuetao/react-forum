const axios = require('axios')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const proxy = require('http-proxy-middleware')
const path = require('path')
const serverConfig = require('../../build/webpack.config.server')
const serverRender = require('./server-render')

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

// const Module = module.constructor
//  NativeModule相当于module.exports
const NativeModule = require('module')
const vm = require('vm')

// '{function(exports, require, module,  __filename, __dirname){...bundle code}}'
const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} }
  const wrapper = NativeModule.wrap(bundle)
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
  })
  const result = script.runInThisContext()
  result.call(m.exports, m.exports, require, m)
  return m
}

const mfs = new MemoryFs // eslint-disable-line
const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs
let serverBundle
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.error(err))
  stats.warnings.forEach(warn => console.warn(warn))

  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  const m = getModuleFromString(bundle, 'server-entry.js')
  // const m = new Module()
  // m._compile(bundle, 'server-entry.js') //  制定module的名字‘server-entry.js’
  serverBundle = m.exports
  // createStoreMap = m.exports.createStoreMap
})

module.exports = function (app) {
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  })

  )

  //  服务端渲染部分
  app.get('*', function (req, res, next) {
    getTemplate().then(template => {
      if (!serverBundle) {
        return res.send('waiting for compile, refresh later')
      }
      return serverRender(serverBundle, template, req, res)
    }).catch(next)
  })
}
