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
    const path = dialog.showOpenDialog({ properties: ['openDirectory'], defaultPath: settings.addonDir})
    if (path !== undefined) {
      settings.addonDir = path[0]
      this.props.onNewSettings(settings)
    }
  }

  onModAddonRecordFile () {
    const { settings } = this.props
    const path = dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: '.json', extensions: ['json'] }], defaultPath: settings.addonRecordFile})
    if (path !== undefined) {
      settings.addonRecordFile = path[0]
      this.props.onNewSettings(settings)
    }
  }

  onToggleCheckUpdateOnStart () {
    const { settings } = this.props
    settings.checkUpdateOnStart = !settings.checkUpdateOnStart 
    this.props.onNewSettings(settings)
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
                <td width='10%'><b>Install Location</b></td>
                <td width='20%'><p className="small">Where your addons will be installed.</p></td>
                <td width='70%' className="settingsRight">
                  <button className='pathButton' onClick={(e) => this.onModAddonDir(e)} >
                    {settings.addonDir}
                  </button>
                </td>
              </tr>
              <tr>
                <td width='10%'><b>Record File</b></td>
                <td width='20%'><p>Information about your addons (version, hosts, etc.) are saved here. You can load another addon configuration by changing this file.</p></td>
                <td width='70%' className="settingsRight">
                  <button className='pathButton' onClick={(e) => this.onModAddonRecordFile(e)} >
                    {settings.addonRecordFile}
                  </button>
                </td>
              </tr>
              <tr>
                <td></td>
                <td width='30%'><p>Automatically check for addon updates when opening World of Addons.</p></td>
                <td width='70%' className="settingsRight">
                  <div className='switch settingsRight'>
                    <label>
                      Off
                      <input type='checkbox' checked={settings.checkUpdateOnStart} onChange={(e) => this.onToggleCheckUpdateOnStart(e)} />
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
          <button className='waves-effect waves-green btn-flat btn-small' onClick={this.onToggleModal.bind(this)}>Close</button>
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
