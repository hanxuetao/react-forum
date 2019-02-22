import React from 'react'
import PropTypes from 'prop-types'
import marked from 'marked'
import Helmet from 'react-helmet'
import {
  inject,
  observer,
} from 'mobx-react'
import dateFormat from 'dateformat'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import IconReply from '@material-ui/icons/Reply'
import CircularProgress from '@material-ui/core/CircularProgress'
import SimpleMDE from 'react-simplemde-editor'
import Container from '../layout/container'

// import { TopicStore } from '../../store/topic-store'
import { topicDetailStyle } from './styles'
import Reply from './reply'

@inject((stores) => {
  return {
    topicStore: stores.topicStore,
    appState: stores.appState,
    user: stores.appState.user,
  }
}) @observer
class TopicDetail extends React.Component {
  static contextTypes = {
    router: PropTypes.func,
  }

  constructor() {
    super()
    this.state = {
      newReply: '',
    }
    this.goToLogin = this.goToLogin.bind(this)
    this.handleNewReplayChange = this.handleNewReplayChange.bind(this)
    this.doReply = this.doReply.bind(this)
  }

  componentDidMount() {
    const id = this.getTopicId()
    this.props.topicStore.getTopicDetail(id)
  }

  getTopicId() {
    return this.props.match.params.id
  }

  goToLogin() {
    this.context.router.history.push('/user/login')
  }

  doReply() {
    const id = this.getTopicId()
    const topic = this.props.topicStore.detailMap[id]
    topic.doReply(this.state.newReply)
      .then(() => {
        this.setState({
          newReply: '',
        })
      }).catch((err) => {
        console.log(err) // eslint-disable-line
      })
  }

  handleNewReplayChange(value) {
    this.setState({
      newReply: value,
    })
  }


  render() {
    const {
      classes,
      user,
    } = this.props
    const id = this.getTopicId()
    const topic = this.props.topicStore.detailMap[id]
    if (!topic) {
      return (
        <Container>
          <section className={classes.loadingContainer}>
            <CircularProgress color="primary" />
          </section>
        </Container>
      )
    }
    return (
      <div>
        <Container>
          <Helmet>
            <title>{topic.title}</title>
          </Helmet>
          <header className={classes.header}>
            <h3>{topic.title}</h3>
          </header>
          <section className={classes.body}>
            <p dangerouslySetInnerHTML={{ __html: marked(topic.content) }} />
          </section>
        </Container>

        {
          topic.createdReplies && topic.createdReplies.length > 0 ?
            (
              <Paper elevation={4} className={classes.replies}>
                <header className={classes.replyHeader}>
                  <span>My Latest Replied</span>
                  <span>{`${topic.createdReplies.length} Replies`}</span>
                </header>
                {
                  topic.createdReplies.map(reply => (
                    <Reply
                      key={reply.id}
                      reply={Object.assign({}, reply, {
                        author: {
                          avatar_url: user.info.avatar_url,
                          loginname: user.info.loginname,
                        },
                      })}
                    />
                  ))
                }
              </Paper>
              /* eslint-enable */
            ) : null
        }

        <Paper elevation={4} className={classes.replies}>
          <header className={classes.replyHeader}>
            <span>{`${topic.reply_count} Replies`}</span>
            <span>{`Latest Replied ${dateFormat(topic.last_reply_at, 'dddd, mmmm dS, yyyy, h:MM:ss TT')}`}</span>
          </header>
          {
            /* eslint-disable */
            user.isLogin ?
              <section className={classes.replyEditor}>
                <SimpleMDE
                  onChange={this.handleNewReplayChange}
                  value={this.state.newReply}
                  options={{
                    toolbar: false,
                    autofocus: false,
                    spellChecker: false,
                    placeholder: 'Add your wonderful reply',
                  }}
                />
                <Button
                  variant="contained"
                  color='primary'
                  onClick={this.doReply}
                  className={classes.replyButton}>
                  <IconReply />
                </Button>
              </section>
              : null
            /* eslint-enable */
          }
          {
            /* eslint-disable */
            !user.isLogin ?
              <section className={classes.notLoginButton}>
                <Button variant='contained' color="secondary" onClick={() => this.goToLogin()}>
                  Log in and Add Replies
                </Button>
              </section> :
              null
            /* eslint-enable */
          }

          <section>
            {
              topic.replies.map(reply => <Reply reply={reply} key={reply.id} />)
            }
          </section>
        </Paper>
      </div>
    )
  }
}

TopicDetail.wrappedComponent.propTypes = {
  // appState: PropTypes.object.isRequired,
  topicStore: PropTypes.object.isRequired, // eslint-disable-line
  user: PropTypes.object.isRequired,
}

TopicDetail.propTypes = {
  match: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(topicDetailStyle)(TopicDetail)
