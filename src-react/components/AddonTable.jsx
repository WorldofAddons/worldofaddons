import React, { Component } from 'react'
import { ipcRenderer } from 'electron'

// TODO: Optimize memory consumption by getting rid of addonList in state.
export class AddonTable extends Component {
  constructor (props) {
    super(props)

    this.state = {
      addonList: []
    }

    ipcRenderer.send('windowDoneLoading', {}) // react is done rendering.
  }

  componentDidMount () {
    ipcRenderer.on('addonList', this.initAddonList.bind(this))
    ipcRenderer.on('newAddonObj', this.addRow.bind(this))
    ipcRenderer.on('updateAddonDL', this.updateDLPercent.bind(this))
  }

  componentWillUnmount () {
    ipcRenderer.removeListener('addonList', this.initAddonList.bind(this))
    ipcRenderer.removeListener('newAddonObj', this.addRow.bind(this))
    ipcRenderer.removeListener('updateAddonDL', this.updateDLPercent.bind(this))
  }

  initAddonList (e, addonObj) {
    // translate addonObj
    const addonList = []
    Object.keys(addonObj).map(key => {
      addonObj[key].dlStatus = 100
      addonList.push(addonObj[key])
    })

    this.setState({ addonList })
  }

  // TODO: refactor this
  updateDLPercent (e, updateObj) {
    const { name, dlStatus } = updateObj
    let { addonList } = this.state
    let idx = addonList.findIndex(a => a.name === name)
    if (idx === -1) {
      // throw new Error('Newly downloaded addon could not be found.')
    }
    let addon = addonList[idx]
    addon.dlStatus = dlStatus

    const newAddonList = [...addonList]
    newAddonList[idx] = addon

    this.setState({ addonList: newAddonList })
    this.renderRow(addon, idx)
  }

  addRow (e, newAddon) {
    let { addonList } = this.state
    console.log(newAddon)
    addonList.push(newAddon)
    this.setState({ addonList })
  }

  // Sends request to install addon
  onInstall (addonObj) {
    ipcRenderer.send('installAddon', addonObj)
  }

  // Sends request to check addon for updates
  onCheckUpdate (addonObj) {
    ipcRenderer.send('checkAddonUpdate', addonObj)
  }

  // Sends request to install an update
  onInstallUpdate (addonObj) {
    ipcRenderer.send('installUpdate', addonObj)
  }

  onRemove () {
    // noop
  }

  renderRow (addonObj, key) {
    let btnTag
    let dlStatus
    switch (addonObj.status) {
      case 'INSTALLED':
        btnTag = <button onClick={() => this.onCheckUpdate(addonObj)}>Check Update</button>
        break;
      case 'NEW UPDATE':
        btnTag = <button onClick={() => this.onInstallUpdate(addonObj)}>Update</button>
        break;
      default:
        btnTag = <button onClick={() => this.onInstall(addonObj)}>Install</button>
    }

    if (addonObj.dlStatus !== 100) {
      dlStatus = <td>{addonObj.dlStatus}</td>
      if ( (addonObj.dlStatus >= 0) && (addonObj.dlStatus > 100) ){ // Currently downloading something so hide the install button
        btnTag = ""
      }
    }

    return (
      <tr key={key}>
        <td>{addonObj.displayName}</td>
        <td>{addonObj.host}</td>
        <td>{addonObj.version}</td>
        <td>{addonObj.status}</td>
        {dlStatus}
        <td>
          {btnTag}
        </td>
        <td>
          <button onClick={this.onRemove.bind(this)}>Remove</button>
        </td>
      </tr>
    )
  }

  renderHeader () {
    return (
      <thead>
        <tr>
          <th>Name</th>
          <th>Host</th>
          <th>Version</th>
          <th>Status</th>
          <th />
          <th />
        </tr>
      </thead>
    )
  }

  renderBody () {
    const tags = this.state.addonList.map((a, i) => this.renderRow(a, i)) 
    return (
      <tbody>
        {tags}
      </tbody>
    )
  }

  render () {
    return (
      <div key='addon-table'>
        <table>
          {this.renderHeader()}
          {this.renderBody()}
        </table>
      </div>
    )
  }
}
