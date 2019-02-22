import React from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  inject,
  observer,
} from 'mobx-react'
import TopicList from '../views/topic-list/index'
import TopicDetail from '../views/topic-detail/index'
import Login from '../views/user/login'
import UserInfo from '../views/user/info'
import TopicCreate from '../views/topic-create/index'

/* eslint-disable */
const PrivateRoute = ({ isLogin, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={
      props => (
        isLogin ?
          <Component {...props} /> :
          <Redirect to={{
            pathname: '/user/login',
            search: `?from=${rest.path}`
          }}
          />
      )
    }
  />
)
/* eslint-enable */
/* 因为mobx会修改context shouldComponentUpdate的内容  */
/* 所以在mobx和router一起用的时候会造成冲突 导致不能重新渲染 */
/* 所以需要使用withRouter来强制渲染 */
const InjectedPrivateRoute = withRouter(inject((stores) => {
  return {
    isLogin: stores.appState.user.isLogin,
  }
})(observer(PrivateRoute)))

PrivateRoute.propTypes = {
  isLogin: PropTypes.bool,
  component: PropTypes.element.isRequired,
}

PrivateRoute.defaultProps = {
  isLogin: false,
}

export default () => [
  <Route path="/" render={() => <Redirect to="/list" />} exact key="first" />,
  <Route path="/list" component={TopicList} key="list" />,
  <Route path="/detail/:id" component={TopicDetail} key="detail" />,
  <Route path="/user/login" component={Login} key="login" exact />,
  <InjectedPrivateRoute path="/user/info" component={UserInfo} key="info" exact />,
  <InjectedPrivateRoute path="/topic/create" component={TopicCreate} key="create" />,

]
