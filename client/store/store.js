import AppState from './app-state'
import TopicStore from './topic-store'

export { AppState, TopicStore }

export default {
  AppState,
  TopicStore,
}

/* eslint-disable */
export const createStoreMap = () => ({

  appState: new AppState(),
  topicStore: new TopicStore(),

})
/* eslint-enable */
