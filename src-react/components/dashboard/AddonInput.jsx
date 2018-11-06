import React, { Component } from 'react'

function checkURL (newUrl) {
  const isURL = /^(http|https):\/\/[^ "]+$/.test(newUrl)
  if (isURL !== true) {
    const errorObj = { 'error': "ERROR: Invalid URL '" + newUrl + "'" }
    console.error(errorObj) // TODO: display error to user
  }
  return isURL
}

export class AddonInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      url: ''
    }
  }

  onChange (e) {
    this.setState({ url: e.target.value })
  }

  onSubmit (e) {
    const { url } = this.state
    if (url !== '' && checkURL(url)) {
      this.props.onSubmit(url)
    }
  }

  renderInput () {
    return (
      <div className="browser-default">
        <input id='addonInput' className='browser-default urlInput navBarItem' type='text' placeholder={this.props.inputLabel} value={this.state.url} onChange={this.onChange.bind(this)} onKeyPress={this.onSubmit.bind(this)}/>
      </div>
    )
  }

  render () {
    return (
      <div className='row nav-wrapper white z-depth-2'>
        <div className="col s8 offset-s2">
          {this.renderInput()}
        </div>
      </div>
    )
  }
}
