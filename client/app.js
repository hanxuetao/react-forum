import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { AppContainer } from 'react-hot-loader'  //eslint-disable-line
import App from './views/app'  //eslint-disable-line

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { teal, lime } from '@material-ui/core/colors'

import { AppState, TopicStore } from './store/store'//  引入AppState对象在此实例化

const theme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: lime,
    type: 'light',
  },
})

const initialState = window.__INITIAL__STATE__ || {} //eslint-disable-line

const creatApp = (TheApp) => {
  class Main extends React.Component {
    // Remove the server-side injected CSS.
    componentDidMount() {
      const jssStyles = document.getElementById('jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      return <TheApp />
    }
  }
  return Main
}

const appState = new AppState(initialState.appState)
const topicStore = new TopicStore(initialState.topicStore)

const root = document.getElementById('root')
const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider appState={appState} topicStore={topicStore}>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <Component />
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root,
  )
}

render(creatApp(App))

if (module.hot) {
  module.hot.accept('./views/app.jsx', () => {
    const NextApp = require('./views/app.jsx').default //eslint-disable-line
    render(creatApp(NextApp))
  })
}
