//  正式环境下的服务端渲染
const ejs = require('ejs')
const serialize = require('serialize-javascript')
const ReactDomServer = require('react-dom/server')
const bootstrapper = require('react-async-bootstrapper')
const Helmet = require('react-helmet').default

//  ui部分的服务端渲染 提升ui组件加载速度 用户体验极致丝滑
const SheetsRegistry = require('react-jss').SheetsRegistry
const createMuiTheme = require('@material-ui/core/styles').createMuiTheme
const createGenerateClassName = require('@material-ui/core/styles/createGenerateClassName').default
const colors = require('@material-ui/core/colors')

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  }, {})
}

module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => {
    const createStoreMap = bundle.createStoreMap
    const createApp = bundle.default
    const user = req.session.user
    const routerContext = {}
    const store = createStoreMap()

    if (user) {
      store.appState.user.isLogin = true
      store.appState.user.info = user
    }

    //  ui部分服务器端渲染
    const sheetsRegistry = new SheetsRegistry()
    const generateClassName = createGenerateClassName()
    const theme = createMuiTheme({
      palette: {
        primary: colors.teal,
        accent: colors.pink,
        type: 'light'
      },
      typography: {
        useNextVariants: true
      }
    })

    const app = createApp(store, routerContext, sheetsRegistry, theme, generateClassName, req.url)

    bootstrapper(app).then(() => {
      const content = ReactDomServer.renderToString(app)
      if (routerContext.url) {
        res.status(302).setHeader('Location', routerContext.url)
        res.end()
        return
      }

      const helmet = Helmet.rewind()
      const state = getStoreState(store)
      const html = ejs.render(template, {
        appString: content,
        initialState: serialize(state),
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
        materialCss: sheetsRegistry.toString()
      })

      res.send(html)
      resolve()
    }).catch(reject)
  })
}
