import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { Dashboard } from './screens/Dashboard'
import AddonInputContainer from './modules/dashboard/AddonInputContainer'
import IpcListener from './redux/IpcListener'
import configureStore from './configureStore'

const store = configureStore()
const electronChannels = [
  'addonList',
  'modAddonObj',
  'updateAddonDL'
]

class App extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <div>
          <AddonInputContainer/>
          <div>
            <Dashboard />
            <IpcListener channels={electronChannels}/>
          </div>
        </div>
      </Provider>
    )
  }
}


ReactDOM.render(<App/>, document.getElementById('root'))
