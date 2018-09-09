import React, { Component } from 'react'
import { ipcRenderer } from 'electron'

export class AddonTable extends Component {
  constructor(props){
    super(props)

    this.state = {
      addonList: []
    }

    // event listeners
    ipcRenderer.on('newAddonObj', this.addRow)
    ipcRenderer.on('updateAddonStatus', (e, updateObj) => {}) // TODO: fix download status
  }

  addRow(e, newAddon) {
    let { addonList } = this.state
    addonList.push(newAddon)
    this.setState({addonList})
  }

  onInstall(e) {

  }

  onRemove(e) {

  }

  renderRow(addonObj) {
    return(
      <tr>
        <td>{addonObj.name}</td>
        <td>{addonObj.host}</td>
        <td>{addonObj.version}</td>
        <td>{"TODO: download Status"}</td>
        <td>
          <button onClick={this.onInstall.bind(this)}>Install</button>
        </td>
        <td>
          <button onClick={this.onRemove.bind(this)}>Remove</button>
        </td>
      </tr>
    )
  }

  render(){
    const tags = this.state.addonList.map(a => this.renderRow(a))

    return(
      <div>
        <table>
          {tags}
        </table>
      </div>
    )
  }

}