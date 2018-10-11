import React, { Component } from 'react'
import { ipcRenderer } from 'electron'

function checkURL (newUrl) {
  const isURL = /^(http|https):\/\/[^ "]+$/.test(newUrl)
  if (isURL !== true) {
    ipcRenderer.send('newURL', newUrl)
    const errorObj = { 'error': "ERROR: Invalid URL '" + newUrl + "'" }
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
    if (url !== '' && checkURL(url)) {
      ipcRenderer.send('newURL', url)
    }
  }

  renderButton () {
    return (
      <div className='col s2'>
        <button 
          className='btn-small waves-effect waves-light' 
          onClick={this.onGet.bind(this)}>
          Add
        </button>
      </div>
    )
  }

  renderInput () {
    return (
      <div className='col s10'>
        <div className='input-field'>
          <label htmlFor="addonInput">Addon url</label>
          <input id='addonInput' value={this.state.url} onChange={this.onChange.bind(this)} type='text' />
        </div>
      </div>
    )
  }

  render () {
    return (
      <div className='row valign-wrapper'>
        {this.renderButton()}
        {this.renderInput()}
      </div>
    )
  }
}
