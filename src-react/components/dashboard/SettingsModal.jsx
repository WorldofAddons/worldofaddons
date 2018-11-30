import React from 'react'
import { shell } from 'electron'
import {getThemeInput, getThemePrimary} from '../../utils/index'
const { dialog } = require('electron').remote
const { app } = window.require('electron').remote

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
      <button className='navBarItem waves-effect waves-green btn-small' onClick={this.onToggleModal.bind(this)}>
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
          <button className='btn-flat waves-effect waves-green red-text' onClick={this.onToggleModal.bind(this)}><b>Close</b></button>
        </div>
        <div className='row'>
          <table>
            <tbody>
              <tr>
                <td><b>Install Location</b><p className="small">World of Warcraft addon directory.</p></td>
                <td className="settingsRight">
                  <button className={`pathButton ${inputCss}`} onClick={(e) => this.onModAddonDir(e)} >
                    {settings.addonDir}
                  </button>
                </td>
              </tr>
              <tr>
                <td><b>Record File</b><br></br><p>Information about your addons (version, hosts, etc.) are saved here.</p></td>
                <td className="settingsRight">
                  <button className={`pathButton ${inputCss}`} onClick={(e) => this.onModAddonRecordFile(e)} >
                    {settings.addonRecordFile}
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Auto-Check Update</b>
                  <br></br>
                  {this.renderToggleExplain()}
                </td>
                <td className="settingsRight">
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
                <td>
                  <b>Theme</b><br></br>
                  Light/Dark mode toggle
                </td>
                <td className="settingsRight">
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
        Version {app.getVersion()}
        <div className="row">
          <div className="col s2">
            <p><button className="btn-small waves-effect waves-teal" href="#" onClick = {() => shell.openExternal("https://github.com/WorldofAddons/worldofaddons/releases")}>Releases</button></p>
          </div>
          <div className="col s2">
            <p><button className="btn-small waves-effect waves-teal" href="#" onClick = {() => shell.openExternal("https://github.com/WorldofAddons/worldofaddons/wiki")}>Wiki</button></p>
          </div>
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
