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

  renderButton () {
    return (
      <div className='col s2'>
        <button 
          className='btn-small waves-effect waves-light light-blue darken-4' 
          onClick={this.onSubmit.bind(this)}>
          {this.props.buttonLabel}
        </button>
      </div>
    )
  }

  renderInput () {
    return (
      <div className='col s10'>
        <div className='input-field'>
          <label htmlFor="addonInput">{this.props.inputLabel}</label>
          <input id='addonInput' value={this.state.url} onChange={this.onChange.bind(this)} type='text' />
        </div>
      </div>
    )
  }

  render () {
    return (
      <div className='row valign-wrapper'>
        {this.renderInput()}
        {this.renderButton()}
      </div>
    )
  }
}
