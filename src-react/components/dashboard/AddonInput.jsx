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
        <button 
          className='btn-small waves-effect waves-light light-blue darken-4' 
          onClick= {
            e => {
                this.onSubmit()
                e.preventDefault()
            }
          }>
          {this.props.buttonLabel}
        </button>
    )
  }

  renderInput () {
    return (
      <div className="col s8">
        <input placeholder={this.props.inputLabel} id='addonInput' value={this.state.url} onChange={this.onChange.bind(this)} type='text' className='textInput'/>
      </div>
    )
  }

  render () {
    return (
      <div className='row'>
        <form className="col s10 offset-s2">
          {this.renderInput()}
          {this.renderButton()}
        </form>
      </div>
    )
  }
}
