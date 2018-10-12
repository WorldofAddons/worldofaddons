import { connect } from 'react-redux'
import { Component } from 'react'
import { ipcRenderer } from 'electron'
import { listenerToRedux } from './actions/index'

class ReduxListenerController extends Component {
  constructor (props) {
    super(props)
    ipcRenderer.send('windowDoneLoading', {}) // react is done rendering.
  }

  componentDidMount () {
    ipcRenderer.on('addonList', this.initAddonList.bind(this))
    ipcRenderer.on('newAddonObj', this.addRow.bind(this))
    ipcRenderer.on('updateAddonStatus', this.updateDLPercent.bind(this))
  }

  componentWillUnmount () {
    ipcRenderer.removeListener('addonList', this.initAddonList.bind(this))
    ipcRenderer.removeListener('newAddonObj', this.addRow.bind(this))
    ipcRenderer.removeListener('updateAddonStatus', this.updateDLPercent.bind(this))
  }

  createReduxListener(channel) {
    const { sendToStore } = this.props
    ipcRenderer.on(channel, sendToStore(e, data, channel))
  }

  removeReduxListener(channel) {
    const { sendToStore } = this.props
    ipcRenderer.removeListener(channel, sendToStore(e, data, channel))
  }

  render() {
    return null
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    sendToStore: (e, data, type) => dispatch(listenerToRedux(type, data))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxListenerController)
