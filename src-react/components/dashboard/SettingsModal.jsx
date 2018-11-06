import React from 'react'
const { dialog } = require('electron').remote

export class SettingsModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: props.show || false
    }
  }

  onToggleModal (e) {
    this.setState({ show: !this.state.show })
    if (this.state.show === false) { // Fetch config settings when opening modal
      this.props.onSettings()
    }
  }

  onModAddonDir () {
    const { settings } = this.props
    const path = dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (path !== undefined) {
      settings.addonDir = path[0]
      console.log(settings.addonDir)
    }
  }

  onModAddonRecordFile () {
    const { settings } = this.props
    const path = dialog.showOpenDialog({ properties: ['openFile'] })
    if (path !== undefined) {
      settings.addonRecordFile = path[0]
      console.log(settings.addonRecordFile)
    }
  }

  onToggleCheckUpdateOnStart (value) {
    this.props.settings.checkUpdateOnStart = !value
    console.log(this.props.settings.checkUpdateOnStart)
    return this.props.settings.checkUpdateOnStart
  }

  renderSettingsBtn () {
    return (
      <button className='waves-effect waves-green btn-flat btn-small' onClick={this.onToggleModal.bind(this)}>
        <i className='material-icons'>settings</i>
      </button>
    )
  }

  renderModal () {
    const { settings } = this.props
    return (
      <div className='modal-content'>
        <div className='row'>
          <table>
            <tbody>
              <tr>
                <td>Addon Directory</td>
                <td>
                  <button className='waves-effect waves-green btn-flat btn-small' onClick={(e) => this.onModAddonDir(e)} >
                    {settings.addonDir}
                  </button>
                </td>
              </tr>
              <tr>
                <td>Addon Record File</td>
                <td>
                  <button className='waves-effect waves-green btn-flat btn-small' onClick={(e) => this.onModAddonRecordFile(e)} >
                    {settings.addonRecordFile}
                  </button>
                </td>
              </tr>
              <tr>
                <td>Check Update on Start</td>
                <td>
                  <div className='switch'>
                    <label>
                      Off
                      <input type='checkbox' checked={settings.checkUpdateOnStart} onChange={this.onToggleCheckUpdateOnStart.bind(this)} />
                      <span className='lever' />
                      On
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='row'>
          <button onClick={this.onToggleModal.bind(this)}>Close</button>
        </div>
      </div>
    )
  }

  render () {
    return (
      <div>
        {this.renderSettingsBtn()}
        {this.state.show ? this.renderModal() : null}
        {this.state.show ? <div className='overlay' onClick={this.onToggleModal.bind(this)} /> : null}
      </div>
    )
  }
}
