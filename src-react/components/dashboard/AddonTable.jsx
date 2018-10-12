import React, { Component } from 'react'
import { ipcRenderer } from 'electron'

export class AddonTable extends Component {

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

    const statusText = addonObj.dlStatus === 100 
      ? 'Ready'
      : `%${addonObj.dlStatus}`

    return (
      <tr key={key}>
        <td>{addonObj.displayName}</td>
        <td>{addonObj.host}</td>
        <td>{addonObj.version}</td>
        <td>{statusText}</td>
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
    const tags = this.props.addonList.map((a, i) => this.renderRow(a, i))
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
    const { addonList } = this.props
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
