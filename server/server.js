const express = require('express')
const serverRender = require('./util/server-render')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const session = require('express-session')
const fs = require('fs')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'
const app = express()

app.use(bodyParser.json())//  把json数据转化成req.body上的数据
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  resave: false,
  saveUninitialized: false,
  secret: 'react cnode class'
}))// session设置

app.use(favicon(path.join(__dirname, '../favicon.ico')))

app.use('/api/user', require('./util/handle-login'))
app.use('/api', require('./util/proxy'))

console.log(isDev)
if (!isDev) {
  const serverEntry = require('../dist/server-entry')
  const template = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf8') // 读取文件
  app.use('/public', express.static(path.join(__dirname, '../dist'))) // 处理静态文件

  app.get('*', function (req, res, next) {
    serverRender(serverEntry, template, req, res).catch(next)
  })
} else {
  const devStatic = require('./util/dev-static')
  devStatic(app)
}
//  error handle 中间件
app.use(function (error, req, res, next) {
  console.log(error)
  res.status(500).send(error)
})

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || '3333'

app.listen(port, host, function () {
  console.log('server us listening on 3333')
})
