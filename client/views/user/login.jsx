import React from 'react'
import PropTypes from 'prop-types'
import {
  inject,
  observer,
} from 'mobx-react'

import {
  Redirect,
} from 'react-router-dom'
import queryString from 'query-string'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'

import UserWrapper from './user'
import LoginStyles from './styles/login-style'

@inject((stores) => {
  return {
    appState: stores.appState,
    user: stores.appState.user,
  }
}) @observer
class UserLogin extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.state = {
      accesstoken: '',
      helpText: '',
    }
    this.handleInput = this.handleInput.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.getFrom = this.getFrom.bind(this)
  }


  getFrom(location) {
     location = location || this.props.location //eslint-disable-line
    const query = queryString.parse(location.search)
    return query.from || '/user/info'
  }

  handleInput(event) {
    this.setState({
      accesstoken: event.target.value.trim(),
    })
  }

  handleLogin() {
    if (!this.state.accesstoken) {
      return this.setState({
        helpText: 'AccessToken must be filled',
      })
    }
    this.setState({
      helpText: '',
    })
    return this.props.appState.login(this.state.accesstoken)
      .catch((error) => {
        return error
      })
  }

  render() {
    const { classes } = this.props
    const from = this.getFrom()
    const { isLogin } = this.props.user

    if (isLogin) {
      return <Redirect to={from} />
    }
    return (
      <UserWrapper>
        <div className={classes.root}>
          <TextField
            label="Please Input your Cnode AccessToken"
            placeholder="Please Input Cnode AccessToken"
            required
            helpText={this.state.helpText}
            value={this.state.accesstoken}
            onChange={this.handleInput}
            className={classes.input}
          />
          <Button
            raised
            color="primary"
            onClick={this.handleLogin}
            className={classes.loginButton}
          >
            Log In
          </Button>
        </div>
      </UserWrapper>
    )
  }
}

UserLogin.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

UserLogin.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

export default withStyles(LoginStyles)(UserLogin)
