import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import logger from 'redux-logger'

import reducers from './redux/reducers/index'
import { NavBar, Dashboard } from './screens/Dashboard'
import { Footer } from './Footer'
import IpcListener from './redux/IpcListener'

const store = createStore(
  reducers,
  applyMiddleware(logger)
)
const electronChannels = [
  'addonList',
  'newAddonObj',
  'updateAddonStatus'
]

class Adder extends React.Component {
  render () {
    return (
      <div>
        <NavBar/>
      </div>
    )
  }
}

class App extends React.Component {
  render () {
    return (
        <div>
          <Dashboard />
          <IpcListener channels={electronChannels}/>
        </div>
    )
  }
}
ReactDOM.render(<Provider store={store}><Adder/></Provider>,document.getElementById('searchBar'))
ReactDOM.render(<Provider store={store}><App/></Provider>,document.getElementById('root'))
//ReactDOM.render(<Footer />, document.getElementById('footer'))
