import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import reducers from './redux/reducers/index'
import { Dashboard } from './screens/Dashboard'
import { Footer } from './Footer'

const store = createStore(reducers)

class App extends React.Component {
  render () {
    return (
        <div>
          <Dashboard />
        </div>
    )
  }
}

ReactDOM.render(<Provider store={store}><App/></Provider>,document.getElementById('root'))
ReactDOM.render(<Footer />, document.getElementById('footer'))
