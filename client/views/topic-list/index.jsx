import React from 'react'
import {
  observer,
  inject,
} from 'mobx-react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import queryString from 'query-string'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '../layout/container'
import TopicListItem from './list-item'
import { tabs } from '../../util/variable-define'

@inject((stores) => {
  return {
    appState: stores.appState,
    topicStore: stores.topicStore,
  }
}) @observer
export default class TopicList extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  constructor(context) {
    super(context)
    this.changTab = this.changTab.bind(this)
    this.listItemClick = this.listItemClick.bind(this)
  }

  componentDidMount() {
    const tab = this.getTab()
    this.props.topicStore.fetchTopics(tab)
    // do something here
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.props.topicStore.fetchTopics(this.getTab(nextProps.location.search))
    }
  }

  getTab(search) {
    search = search || this.props.location.search //eslint-disable-line
    const query = queryString.parse(search)
    return query.tab || 'all'
  }

  bootstrap() {
    const query = queryString.parse(this.props.location.search)
    const tab = query.tab || 'all'
    return this.props.topicStore.fetchTopics(tab).then(() => {
      return true
    }).catch(() => {
      return false
    })
  }


  changTab(event, value) {
    this.context.router.history.push({
      pathname: '/list',
      search: `?tab=${value}`,
    })
  }

  listItemClick(topic) {
    this.context.router.history.push(`/detail/${topic.id}`)
  }

  render() {
    const {
      topicStore,
    } = this.props

    const topicList = topicStore.topics
    const syncingTopics = topicStore.syncing
    const tab = this.getTab()
    return (
      <Container>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="this is description" />
        </Helmet>
        <Tabs value={tab} onChange={this.changTab}>
          {
            Object.keys(tabs).map((t) => (<Tab key={t} label={tabs[t]} value={t} />))//eslint-disable-line
          }
        </Tabs>
        <List>
          {
            topicList.map(topic => (
              <TopicListItem
                key={topic.id}
                onClick={() => this.listItemClick(topic)}
                topic={topic}
              />
            ))
          }
        </List>
        {
          syncingTopics ?
            (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  padding: '40px 0',
                }}
              >
                <CircularProgress color="primary" size={100} />
              </div>
            ) :
            null
        }
      </Container>
    )
  }
}


TopicList.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired, // eslint-disable-line
  topicStore: PropTypes.object.isRequired,

}

TopicList.propTypes = {
  location: PropTypes.object.isRequired,
}
