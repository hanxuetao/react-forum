export const tabs = {
  all: 'All',
  share: 'Share',
  job: 'Job',
  ask: 'Ask',
  good: 'Good',
  dev: 'Dev',
}

export const topicSchema = {
  id: '',
  author_id: '',
  tab: '',
  content: '',
  title: '',
  last_reply_at: '',
  good: false,
  top: false,
  reply_count: 0,
  visit_count: 0,
  create_at: '',
  author: {
    loginname: '',
    avatar_url: '',
  },
}

export const replySchema = {
  id: '',
  author: {
    loginname: '',
    avatar_url: '',
  },
  content: '',
  ups: [],
  create_at: '',
  reply_id: null,
  is_uped: false,
}
