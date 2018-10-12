import { connect } from 'react-redux'
import React, { Component } from 'react'
import { ipcRenderer } from 'electron'


const sendToReducerAction = (type, data) => {
  return {type, data}
}

class IpcListener extends Component {
  constructor (props) {
    super(props)
    ipcRenderer.send('windowDoneLoading', {}) // react is done rendering.
  }

  componentDidMount () {
    this.props.channels.forEach(chn => {
      this.createReduxListener(chn)
    })
  }

  componentWillUnmount () {
    this.props.channels.forEach(chn => {
      this.removeReduxListener(chn)
    })
  }

  createReduxListener(channel) {
    const { sendToReducer } = this.props
    ipcRenderer.on(channel, (e, data) => sendToReducer(e, data, channel))
  }

  removeReduxListener(channel) {
    const { sendToReducer } = this.props
    ipcRenderer.removeListener(channel, (e, data) => sendToReducer(e, data, channel))
  }

  render() {
    return <div key='ipcListener'>{this.props.children || null}</div>
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    sendToReducer: (e, data, type) => dispatch(sendToReducerAction(type, data))
  }
}

export default connect(
  null,
  mapDispatchToProps
)(IpcListener)
