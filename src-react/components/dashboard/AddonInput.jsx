import React, { Component } from 'react'
import {getThemePrimary, getThemeInput} from '../../utils/index'

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
    const containerCss = getThemeInput(this.props.theme)
    return (
      <div className='browser-default'>
        <input id='addonInput' className={`browser-default urlInput ${containerCss}`} type='text' placeholder={this.props.inputLabel} value={this.state.url} onChange={this.onChange.bind(this)} onKeyPress={this.onSubmit.bind(this)} />
      </div>
    )
  }

  render () {
    const containerCss = getThemePrimary(this.props.theme)
    return (
      <div className={`${containerCss}`}>
          {this.renderInput()}
      </div>
    )
  }
}
