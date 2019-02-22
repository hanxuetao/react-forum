import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { Provider, useStaticRendering } from 'mobx-react'

import { JssProvider } from 'react-jss'
import { MuiThemeProvider } from '@material-ui/core/styles'

import App from './views/app'
import { createStoreMap } from './store/store'

useStaticRendering(true) // 让mobx在服务端渲染的时候不会重复的数据变换,以防止内存溢出

//  store的形式是{appStore: xxx} 需要转化为{appState=xxx}

/* eslint-disable */

export default (stores, routerContext, sheetsRegistry, theme, generateClassName, url) => {
  return(
  <Provider {...stores}>
    <StaticRouter context={routerContext} location={url}>
      <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
          <App />
        </MuiThemeProvider>
      </JssProvider>
    </StaticRouter>
  </Provider>
  )
}


/* eslint-enable */
export { createStoreMap }
