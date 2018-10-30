import React, { Component } from 'react'
import { AddonControlButton } from './AddonControlButton'

export class AddonTable extends Component {
  renderHeader () {
    return (
      <thead className="grey-text">
        <tr>
          <th width="5%"></th>
          <th width="5%"></th>
          <th width="65%"></th>
          <th width="15%"></th>
          <th width="5%"></th>
          <th width="5%"></th>
        </tr>
      </thead>
    )
  }

  renderRow (addonObj, key) {
    let status = addonObj.status // dlStatus is optional in obj.
    if ((addonObj.dlStatus !== 100) && (addonObj.dlStatus >= 0) && (addonObj.dlStatus < 100)) { // Currently downloading something, display %v
        status = `%${addonObj.dlStatus }`         
    }else if (addonObj.dlStatus === 100) { // Addon has finished downloading and is being unzipped and moved
      status = "Finalizing"
    }

    return (
      <tr key={key}>
        <td>{addonObj.host}</td>
        <td>{status}</td>
        <td className="colAddonName">{addonObj.displayName}</td>
        <td className="colVersion">{addonObj.version}</td>
        <td>
          {AddonControlButton(addonObj, this.props)}
        </td>
        <td>
          <button 
            className='btn-flat btn-small' 
            onClick={() => this.props.onRemove(addonObj)}>
            <i className="material-icons">delete_forever</i>
          </button>
        </td>
      </tr>
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
        <table width="100%" className=''>
          {this.renderHeader()}
          {tag}
        </table>
      </div>
    )
  }
}
