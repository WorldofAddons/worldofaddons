import React from 'react'

export class SettingsModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: props.show || false
    }
  }

  onToggleModal (e) {
    this.setState({show: !this.state.show})
  }

  renderSettingsBtn() {
    return (
      <button className='btn modal-trigger' onClick={this.onToggleModal.bind(this)}>
        Settings
      </button>
    )
  }

  renderModal() {
    return (
      <div className='modal'>
        <div className='modal-content'>
          <p>Something something about settings</p>
        </div>
        <div className='modal-footer'>
          <button onClick={this.onToggleModal.bind(this)}>Close</button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderSettingsBtn()}
        {this.state.show ? this.renderModal() : null}
        {this.state.show ? <div className='overlay'/> : null}
      </div>
    )
  }

}