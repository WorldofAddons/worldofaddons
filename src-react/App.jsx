import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import Dashboard from './screens/Dashboard'
import IpcListener from './redux/IpcListener'
import configureStore from './configureStore'

const store = configureStore()
const electronChannels = [
  'modSettings',
  'addonList',
  'modAddonObj',
  'updateAddonDL',
  'delAddonObj',
  'addonNoUpdate'
]

class App extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <div>
          <Dashboard />
          <IpcListener channels={electronChannels} />
        </div>
      </Provider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
