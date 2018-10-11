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
    ipcRenderer.on('updateAddonStatus', this.updateDLPercent.bind(this))
  }

  componentWillUnmount () {
    ipcRenderer.removeListener('addonList', this.initAddonList.bind(this))
    ipcRenderer.removeListener('newAddonObj', this.addRow.bind(this))
    ipcRenderer.removeListener('updateAddonStatus', this.updateDLPercent.bind(this))
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

  onUpdate (addonObj) {
    ipcRenderer.send('updateObj', addonObj)
  }

  onRemove () {
    // noop
  }

  renderRow (addonObj, key) {
    const btnTag = addonObj.dlStatus === 100
      ? <button className='btn-small waves-effect waves-light' onClick={() => this.onUpdate(addonObj)}>Update</button>
      : <button className='btn-small waves-effect waves-light' onClick={() => this.onInstall(addonObj)}>Install</button>

    return (
      <tr key={key}>
        <td>{addonObj.displayName}</td>
        <td>{addonObj.host}</td>
        <td>{addonObj.version}</td>
        <td>{addonObj.dlStatus}%</td>
        <td>
          {btnTag}
        </td>
        <td>
          <button className='btn-small waves-effect waves-light' 
            onClick={this.onRemove.bind(this)}>
            Remove
          </button>
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

  renderEmptyBody () {
    return (
      <tbody>
        <tr>
          <td align='center' colSpan={6}>
            <h4>No Addons</h4>
          </td>
        </tr>
      </tbody>
    )
  }

  render () {
    const { addonList } = this.state
    const tag = addonList.length === 0 ? this.renderEmptyBody() : this.renderBody()

    return (
      <div key='addon-table'>
        <table className='striped'>
          {this.renderHeader()}
          {tag}
        </table>
      </div>
    )
  }
}
