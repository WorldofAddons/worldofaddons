import React, { Component } from 'react'
import { ipcRenderer } from 'electron'

function checkURL (newUrl) {
  const isURL = /^(http|https):\/\/[^ "]+$/.test(newUrl)
  if (isURL !== true) {
    ipcRenderer.send('newURL', newUrl)
    const errorObj = { 'error': "ERROR: Invalid url '" + newUrl + "'" }
    console.error(errorObj) // TODO: display error to user
  }
  return isURL
}

export class GetAddonInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      url: ''
    }
  }

  onChange (e) {
    this.setState({ url: e.target.value })
  }

  onGet (e) {
    const { url } = this.state
    if (checkURL(url)) {
      ipcRenderer.send('newURL', url)
    }
  }

  render () {
    return (
      <div>
        <input value={this.state.url} onChange={this.onChange.bind(this)} type='text' />
        <button onClick={this.onGet.bind(this)}>Get Addon</button>
      </div>
    )
  }
}
