import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import reducers from './redux/reducers/index'
import { Dashboard } from './screens/Dashboard'
import { Footer } from './Footer'
import IpcListener from './redux/IpcListener'

const store = createStore(reducers)
const electronChannels = [
  'addonList',
  'newAddonObj',
  'updateAddonStatus'
]

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

ReactDOM.render(<Provider store={store}><App/></Provider>,document.getElementById('root'))
ReactDOM.render(<Footer />, document.getElementById('footer'))
