import React from 'react'
import PropTypes from 'prop-types'
import { ListItem, ListItemText, Avatar } from '@material-ui/core';


const TopicItem = ({ topic, onClick }) => {
  return (
    <ListItem button onClick={onClick}>
      <Avatar src={topic.author.avatar_url} />
      <ListItemText
        primary={topic.title}
        secondary={`Latest Replies：${topic.last_reply_at}`}
      />
    </ListItem>
  )
}


TopicItem.propTypes = {
  topic: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default TopicItem
