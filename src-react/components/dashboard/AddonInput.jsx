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
        <div className='input-field col s8 black-text'>
          <nav>
              <form>
                <div class="input-field white ">
                <input id='addonInput' value={this.state.url} onChange={this.onChange.bind(this)} type='text' type="search" required/>
                <label htmlFor="addonInput">{this.props.inputLabel}</label>
                </div>
              </form>
          </nav>
        </div>
    )
  }

  render () {
    return (
      <div className='row'>
        <form class="col s10 offset-s2">
          {this.renderInput()}
          {this.renderButton()}
        </form>
      </div>
    )
  }
}
