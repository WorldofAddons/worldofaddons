import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import reducers from './redux/reducers/index'

export default function configureStore (initialState) {
  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(logger)
  )

  if (module.hot) { // check for hot reload in redux
    module.hot.accept(() => {
      const nextRootReducer = require('./redux/reducers/index').default
      store.replaceReducer(nextRootReducer)
    })
  }
  return store
}
