import React from 'react'
const { dialog } = require('electron').remote
import {getThemeSecondary, getThemeInput, getThemePrimary} from '../../utils/index'

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

  onToggleLight () {
    const { settings } = this.props
    if (settings.theme !== 'light'){
      settings.theme = 'light'
      this.props.onNewSettings(settings)
    }
  }

  onToggleDark () {
    const { settings } = this.props
    if (settings.theme !== 'dark'){
      settings.theme = 'dark'
      this.props.onNewSettings(settings)
    }
  }

  renderThemeSelection(theme) {
    const { settings } = this.props

    if (settings.theme === theme) {
      return <i className="material-icons green-text">done</i>
    }else {
      return <i></i>
    }
  }

  renderToggleExplain() {
    const { settings } = this.props
    if (settings.checkUpdateOnStart === true) {
      return <p>On launch, World of Addons will auto-check for addon updates.</p>
    }else {
      return <p>World of Addons will not auto-check for updates.</p>
    }
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
    const containerCss = getThemePrimary(this.props.theme)
    const inputCss = getThemeInput(this.props.theme)
    return (
      <div className={`modal-content ${containerCss}`}>
        <div className='row'>
          <button className='waves-effect waves-green red-text btn-flat' onClick={this.onToggleModal.bind(this)}><b>Close</b></button>
        </div>
        <div className='row'>
          <table>
            <tbody>
              <tr>
                <td width='50%'><b>Install Location</b><p className="small">World of Warcraft addon directory.</p></td>
                <td width='50%' className="settingsRight">
                  <button className={`pathButton ${inputCss}`} onClick={(e) => this.onModAddonDir(e)} >
                    {settings.addonDir}
                  </button>
                </td>
              </tr>
              <tr>
                <td width='50%'><b>Record File</b><br></br><p>Information about your addons (version, hosts, etc.) are saved here.</p></td>
                <td width='50%' className="settingsRight">
                  <button className={`pathButton ${inputCss}`} onClick={(e) => this.onModAddonRecordFile(e)} >
                    {settings.addonRecordFile}
                  </button>
                </td>
              </tr>
              <tr>
                <td width='50%'>
                  <b>Auto-Check Update</b>
                  <br></br>
                  {this.renderToggleExplain()}
                </td>
                <td width='50%' className="settingsRight">
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

              <tr>
                <td width='50%'>
                  <b>Theme</b><br></br>
                  Light/Dark mode toggle
                </td>
                <td width='50%' className="settingsRight">
                  <div className="row">
                    <div className="col s3">
                      <button className="btn-floating btn-large waves-effect waves-teal grey lighten-5" onClick={(e) => this.onToggleLight(e)}>{this.renderThemeSelection('light')}</button>
                    </div>
                    <div className="col s2">
                      <button className="btn-floating btn-large waves-effect waves-teal blue-grey darken-3" onClick={(e) => this.onToggleDark(e)}>{this.renderThemeSelection('dark')}</button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
