import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import logger from 'redux-logger'
import {Dashboard} from './screens/Dashboard'

import reducers from './redux/reducers/index'
import { Dashboard } from './screens/Dashboard'
import AddonInputContainer from './modules/dashboard/AddonInputContainer'
import { Footer } from './Footer'
import IpcListener from './redux/IpcListener'

const store = createStore(
  reducers,
  applyMiddleware(logger)
)
const electronChannels = [
  'addonList',
  'modAddonObj',
  'updateAddonDL'
]

class App extends React.Component {
  render () {
    return (
        <div>
          <AddonInputContainer/>
          <div>
          <Dashboard />
          <IpcListener channels={electronChannels}/>
          </div>
        </div>
    )
  }
}

ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('root'))
//ReactDOM.render(<Footer />, document.getElementById('footer'))
