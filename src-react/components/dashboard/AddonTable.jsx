import React, { Component } from 'react'
import { AddonControlButton } from './AddonControlButton'

export class AddonTable extends Component {
  renderRow (addonObj, key) {
    let status = addonObj.status // dlStatus is optional in obj.
    if ((addonObj.dlStatus !== 100) && (addonObj.dlStatus >= 0) && (addonObj.dlStatus < 100)) { // Currently downloading something, display %v
        status = `%${addonObj.dlStatus }`         
    }else if (addonObj.dlStatus === 100) { // Addon has finished downloading and is being unzipped and moved
      status = "Finalizing"
    }

    return (
      <tr key={key}>
        <td width="5%">{addonObj.host}</td>
        <td width="5%">{status}</td>
        <td width="65%" className="colAddonName">{addonObj.displayName}</td>
        <td width="15%" className="colVersion">{addonObj.version}</td>
        <td width="5%"> {AddonControlButton(addonObj, this.props)} </td>
        <td width="5%">
          <button 
            className='waves-effect waves-red btn-flat btn-small' 
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
        <table width="100%" className='highlight'>
          {tag}
        </table>
      </div>
    )
  }
}
