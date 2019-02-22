import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
  inject,
  observer,
} from 'mobx-react'
import AppBar from '@material-ui/core/AppBar'
import ToolBar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
}

@inject((stores) => {
  return {
    appState: stores.appState,
  }
}) @observer
class MainAppBar extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  constructor() {
    super()
    this.onHomeIconClick = this.onHomeIconClick.bind(this)
    this.createButtonClick = this.createButtonClick.bind(this)
    this.loginButtonClick = this.loginButtonClick.bind(this)
  }

  /* eslint-disable */
  onHomeIconClick() {
    this.context.router.history.push('/list?tab=all')
  }

  createButtonClick() {
    this.context.router.history.push('/topic/create')
  }
 /* eslint-enable */

  loginButtonClick() {
    if (this.context.router.history.push('/user/login')) {
      this.context.router.history.push('/user/info')
    } else {
      this.context.router.history.push('/user/login')
    }
  }


  render() {
    const { classes } = this.props
    const {
      user,
    } = this.props.appState
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <ToolBar>
            <IconButton color="inherit" variant="contained" onClick={this.onHomeIconClick}>
              <HomeIcon />
            </IconButton>
            <Typography component="h2" variant="headline" color="inherit" className={classes.flex}>
              HNode
            </Typography>
            <Button color="primary" variant="contained" onClick={this.createButtonClick}>
              Create Topic
            </Button>
            <Button color="primary" variant="contained" onClick={this.loginButtonClick}>
              {
                user.isLogin ? user.info.loginname : 'Log in'
              }
            </Button>
          </ToolBar>
        </AppBar>
      </div>
    )
  }
}

MainAppBar.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
}

export default withStyles(styles)(MainAppBar)
