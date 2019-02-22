import React from 'react'
import PropTypes from 'prop-types'
import {
  inject,
  observer,
} from 'mobx-react'
import List, { ListItem, ListItemText } from '@material-ui/core/List' //  eslint-disable-line
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
// import Avatar from '@material-ui/core/Avatar'
import { withStyles } from '@material-ui/core/styles'
import TopicItem from './topic-item'
import UserWrapper from './user'
import InfoStyles from './styles/user-info-style'

// const TopicItem = ({ topic }) => {
//   return (
//     <ListItem>
//       <Avatar src={topic.author.avatar_url} />
//       <ListItemText
//         primary={topic.title}
//         secondary={`Latest Replies：${topic.last_reply_at}`}
//       />
//     </ListItem>
//   )
// }


// TopicItem.propTypes = {
//   topic: PropTypes.object.isRequired,
// }


@inject((stores) => {
  return {
    user: stores.appState.user,
    appState: stores.appState,
  }
}) @observer
class UserInfo extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  componentWillMount() {
    this.props.appState.getUserDetail()
    this.props.appState.getUserCollection()
  }

  goToTopic(id) {
    this.context.router.history.push(`/detail/${id}`)
  }

  render() {
    const { classes } = this.props
    const topics = this.props.user.detail.recentTopics
    const replies = this.props.user.detail.recentReplies
    const collections = this.props.user.collections.list
    return (
      <UserWrapper>
        <div className={classes.root}>
          <Grid container spacing={16} align="stretch">
            <Grid item xs={12} md={4}>
              <Paper elevation={2}>
                <Typography className={classes.partTitle}>
                  <span>Recently published topic</span>
                </Typography>
                <List>
                  {
                    /* eslint-disable */
                    topics.length > 0 ?
                      topics.map(topic =>
                        <TopicItem
                          topic={topic}
                          key={topic.id}
                          onClick={() => this.goToTopic(topic.id)}
                        />) :
                      <Typography align="center">
                        No topics have been posted recently
                      </Typography>
                    /* eslint-enable */
                  }
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2}>
                <Typography className={classes.partTitle}>
                  <span>New Reply</span>
                </Typography>
                <List>
                  {
                    /* eslint-disable */
                    replies.length > 0 ?
                      replies.map((topic) =>
                        <TopicItem
                          topic={topic}
                          key={topic.id}
                          onClick={() => this.goToTopic(topic.id)}
                        />
                      ) :
                      <Typography align="center">
                        No recent responses
                      </Typography>
                    /* eslint-enable */
                  }
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2}>
                <Typography className={classes.partTitle}>
                  <span>Favorite topic</span>
                </Typography>
                <List>
                  {
                    /* eslint-disable */
                    collections.length > 0 ?
                      collections.map(topic =>
                        <TopicItem
                          topic={topic}
                          key={topic.id}
                          onClick={() => this.goToTopic(topic.id)}
                        />
                      ) :
                      <Typography align="center">
                        There is no collection topic yet.
                      </Typography>
                    /* eslint-enable */
                  }
                </List>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </UserWrapper>
    )
  }
}

UserInfo.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

UserInfo.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(InfoStyles)(UserInfo)
