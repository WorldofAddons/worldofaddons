import React, { Component } from 'react'
import { ipcRenderer } from 'electron'

// TODO: Optimize memory consumption by getting rid of addonList in state.
export class AddonTable extends Component {
  constructor (props) {
    super(props)

    this.state = {
      addonList: []
    }
  }

  componentDidMount () {
    ipcRenderer.on('AddonList', this.initAddonList.bind(this))
    ipcRenderer.on('newAddonObj', this.addRow.bind(this))
    ipcRenderer.on('updateAddonStatus', this.updateDLPercent.bind(this))
  }

  componentWillUnmount () {
    ipcRenderer.removeListener('AddonList', this.initAddonList.bind(this))
    ipcRenderer.removeListener('newAddonObj', this.addRow.bind(this))
    ipcRenderer.removeListener('updateAddonStatus', this.updateDLPercent.bind(this))
  }

  initAddonList(e, addonList) {
    this.setState({addonList})
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
    addon.percentage = dlStatus

    const newAddonList = [...addonList]
    newAddonList[idx] = addon

    this.setState({ addonList: newAddonList })
  }

  addRow (e, newAddon) {
    let { addonList } = this.state
    console.log(newAddon)
    addonList.push(newAddon)
    this.setState({ addonList })
  }

  onInstall (addonObj) {
    ipcRenderer.send('installAddon', addonObj)
  }

  onRemove () {

  }

  renderRow (addonObj, key) {
    return (
      <tr key={key}>
        <td>{addonObj.displayName}</td>
        <td>{addonObj.host}</td>
        <td>{addonObj.version}</td>
        <td>{addonObj.percentage || 0}%</td>
        <td>
          <button onClick={() => this.onInstall(addonObj)}>Install</button>
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
